"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ═══════════════════════════════════════════════════════════════════
// IPv4 math helpers
// ═══════════════════════════════════════════════════════════════════

function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join(".");
}

function cidrToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

function numberToBinary(n: number): string {
  return [
    ((n >>> 24) & 0xff).toString(2).padStart(8, "0"),
    ((n >>> 16) & 0xff).toString(2).padStart(8, "0"),
    ((n >>> 8) & 0xff).toString(2).padStart(8, "0"),
    (n & 0xff).toString(2).padStart(8, "0"),
  ].join(".");
}

function ipClass(firstOctet: number): string {
  if (firstOctet < 128) return "A";
  if (firstOctet < 192) return "B";
  if (firstOctet < 224) return "C";
  if (firstOctet < 240) return "D (Multicast)";
  return "E (Reserved)";
}

function isPrivate(ip: number): boolean {
  const a = (ip >>> 24) & 0xff;
  const b = (ip >>> 16) & 0xff;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

const IP_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function validateIp(ip: string): boolean {
  const match = ip.match(IP_REGEX);
  if (!match) return false;
  return match.slice(1).every((o) => {
    const n = parseInt(o, 10);
    return n >= 0 && n <= 255;
  });
}

function parseInput(raw: string): { ip: string; prefix: number } | null {
  const trimmed = raw.trim();
  const cidrMatch = trimmed.match(/^([\d.]+)\/(\d{1,2})$/);
  if (cidrMatch) {
    const ip = cidrMatch[1];
    const prefix = parseInt(cidrMatch[2], 10);
    if (validateIp(ip) && prefix >= 0 && prefix <= 32) return { ip, prefix };
  }
  if (validateIp(trimmed)) return { ip: trimmed, prefix: 24 };
  return null;
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  prefix: number;
  ipClassLabel: string;
  isPrivateRange: boolean;
  binaryIp: string;
  binaryMask: string;
  binaryNetwork: string;
  binaryBroadcast: string;
}

function calculate(ip: string, prefix: number): SubnetResult {
  const ipNum = ipToNumber(ip);
  const mask = cidrToMask(prefix);
  const wildcard = (~mask) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalAddresses = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : totalAddresses - 2;
  const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
  const firstOctet = (ipNum >>> 24) & 0xff;

  return {
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),
    subnetMask: numberToIp(mask),
    wildcardMask: numberToIp(wildcard),
    firstHost: numberToIp(firstHost),
    lastHost: numberToIp(lastHost),
    totalAddresses,
    usableHosts,
    prefix,
    ipClassLabel: ipClass(firstOctet),
    isPrivateRange: isPrivate(ipNum),
    binaryIp: numberToBinary(ipNum),
    binaryMask: numberToBinary(mask),
    binaryNetwork: numberToBinary(network),
    binaryBroadcast: numberToBinary(broadcast),
  };
}

// ═══════════════════════════════════════════════════════════════════
// IP Range → CIDR helpers
// ═══════════════════════════════════════════════════════════════════

function rangeToCidrs(startIp: number, endIp: number): string[] {
  const result: string[] = [];
  let current = startIp;
  while (current <= endIp) {
    // Find the largest block starting at `current` that fits within the range
    let maxBits = 32;
    // Block must be aligned: current must be a multiple of 2^(32-prefix)
    while (maxBits > 0) {
      const blockSize = 1 << (32 - maxBits + 1);
      if ((current % blockSize) === 0) {
        maxBits--;
      } else {
        break;
      }
    }
    // Block must not exceed end
    while (maxBits < 32) {
      const blockEnd = (current + (1 << (32 - maxBits)) - 1) >>> 0;
      if (blockEnd <= endIp) break;
      maxBits++;
    }
    result.push(`${numberToIp(current)}/${maxBits}`);
    current = (current + (1 << (32 - maxBits))) >>> 0;
    if (current === 0) break; // wrapped around
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════
// VLSM helpers
// ═══════════════════════════════════════════════════════════════════

interface VlsmSubnet {
  name: string;
  requestedHosts: number;
  allocatedPrefix: number;
  allocatedSize: number;
  usableHosts: number;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
}

function vlsmDivide(
  networkIp: number,
  networkPrefix: number,
  requests: { name: string; hosts: number }[]
): { subnets: VlsmSubnet[]; error?: string } {
  const totalSize = Math.pow(2, 32 - networkPrefix);
  // Sort by hosts descending (largest first for optimal allocation)
  const sorted = [...requests].sort((a, b) => b.hosts - a.hosts);

  const subnets: VlsmSubnet[] = [];
  let currentAddress = networkIp;
  const networkEnd = (networkIp + totalSize - 1) >>> 0;

  for (const req of sorted) {
    // Find smallest prefix that fits requested hosts
    let prefix = 32;
    while (prefix > 0) {
      const size = Math.pow(2, 32 - prefix);
      const usable = prefix >= 31 ? (prefix === 32 ? 1 : 2) : size - 2;
      if (usable >= req.hosts) {
        prefix++;
        // Check if the one above still fits
        const sizeAbove = Math.pow(2, 32 - prefix);
        const usableAbove = prefix >= 31 ? (prefix === 32 ? 1 : 2) : sizeAbove - 2;
        if (usableAbove >= req.hosts) {
          // keep prefix
        } else {
          prefix--;
        }
        break;
      }
      prefix--;
    }
    // Use the smallest block that fits
    // Recalculate: find the exact prefix
    let bestPrefix = 32;
    for (let p = 32; p >= networkPrefix; p--) {
      const usable = p >= 31 ? (p === 32 ? 1 : 2) : Math.pow(2, 32 - p) - 2;
      if (usable >= req.hosts) {
        bestPrefix = p;
      } else {
        break;
      }
    }

    const allocatedSize = Math.pow(2, 32 - bestPrefix);
    const broadcastAddr = (currentAddress + allocatedSize - 1) >>> 0;

    if (broadcastAddr > networkEnd) {
      return {
        subnets,
        error: `Not enough space for "${req.name}" (needs ${req.hosts} hosts). Address space exhausted.`,
      };
    }

    const mask = cidrToMask(bestPrefix);
    const firstHostAddr = bestPrefix >= 31 ? currentAddress : (currentAddress + 1) >>> 0;
    const lastHostAddr = bestPrefix >= 31 ? broadcastAddr : (broadcastAddr - 1) >>> 0;

    subnets.push({
      name: req.name,
      requestedHosts: req.hosts,
      allocatedPrefix: bestPrefix,
      allocatedSize,
      usableHosts: bestPrefix >= 31 ? (bestPrefix === 32 ? 1 : 2) : allocatedSize - 2,
      networkAddress: numberToIp(currentAddress),
      broadcastAddress: numberToIp(broadcastAddr),
      firstHost: numberToIp(firstHostAddr),
      lastHost: numberToIp(lastHostAddr),
      subnetMask: numberToIp(mask),
    });

    currentAddress = (broadcastAddr + 1) >>> 0;
    if (currentAddress === 0) break;
  }

  return { subnets };
}

// ═══════════════════════════════════════════════════════════════════
// IP Info helpers
// ═══════════════════════════════════════════════════════════════════

interface IpInfo {
  ip: string;
  ipNumber: number;
  binary: string;
  hex: string;
  ipClass: string;
  isPrivate: boolean;
  type: string;
  rfc: string;
  reversePtr: string;
  ipv6Mapped: string;
  ipv6Compatible: string;
}

function getIpInfo(ip: string): IpInfo {
  const num = ipToNumber(ip);
  const a = (num >>> 24) & 0xff;
  const b = (num >>> 16) & 0xff;

  let type = "Public Unicast";
  let rfc = "";

  if (a === 0) {
    type = "This Network";
    rfc = "RFC 1122";
  } else if (a === 10) {
    type = "Private (Class A)";
    rfc = "RFC 1918";
  } else if (a === 100 && b >= 64 && b <= 127) {
    type = "Shared Address Space (CGNAT)";
    rfc = "RFC 6598";
  } else if (a === 127) {
    type = "Loopback";
    rfc = "RFC 1122";
  } else if (a === 169 && b === 254) {
    type = "Link-Local (APIPA)";
    rfc = "RFC 3927";
  } else if (a === 172 && b >= 16 && b <= 31) {
    type = "Private (Class B)";
    rfc = "RFC 1918";
  } else if (a === 192 && b === 0 && ((num >>> 8) & 0xff) === 0) {
    type = "IETF Protocol Assignments";
    rfc = "RFC 6890";
  } else if (a === 192 && b === 0 && ((num >>> 8) & 0xff) === 2) {
    type = "Documentation (TEST-NET-1)";
    rfc = "RFC 5737";
  } else if (a === 192 && b === 88 && ((num >>> 8) & 0xff) === 99) {
    type = "6to4 Relay Anycast";
    rfc = "RFC 3068";
  } else if (a === 192 && b === 168) {
    type = "Private (Class C)";
    rfc = "RFC 1918";
  } else if (a === 198 && (b === 18 || b === 19)) {
    type = "Benchmarking";
    rfc = "RFC 2544";
  } else if (a === 198 && b === 51 && ((num >>> 8) & 0xff) === 100) {
    type = "Documentation (TEST-NET-2)";
    rfc = "RFC 5737";
  } else if (a === 203 && b === 0 && ((num >>> 8) & 0xff) === 113) {
    type = "Documentation (TEST-NET-3)";
    rfc = "RFC 5737";
  } else if (a >= 224 && a <= 239) {
    type = "Multicast";
    rfc = "RFC 5771";
  } else if (a >= 240 && a <= 255) {
    if (num === 0xffffffff) {
      type = "Limited Broadcast";
      rfc = "RFC 919";
    } else {
      type = "Reserved (Future Use)";
      rfc = "RFC 1112";
    }
  }

  const octets = ip.split(".").map(Number);
  const reversePtr = `${octets[3]}.${octets[2]}.${octets[1]}.${octets[0]}.in-addr.arpa`;
  const hexParts = octets.map((o) => o.toString(16).padStart(2, "0"));
  const ipv6Mapped = `::ffff:${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;
  const ipv6Compatible = `::${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}`;

  return {
    ip,
    ipNumber: num,
    binary: numberToBinary(num),
    hex: `0x${hexParts.join("")}`,
    ipClass: ipClass(a),
    isPrivate: isPrivate(num),
    type,
    rfc,
    reversePtr,
    ipv6Mapped,
    ipv6Compatible,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Common data
// ═══════════════════════════════════════════════════════════════════

const PRESETS = [
  { label: "/8", desc: "Class A — 16.7M hosts", prefix: 8 },
  { label: "/16", desc: "Class B — 65,534 hosts", prefix: 16 },
  { label: "/24", desc: "Class C — 254 hosts", prefix: 24 },
  { label: "/25", desc: "Half C — 126 hosts", prefix: 25 },
  { label: "/26", desc: "Quarter C — 62 hosts", prefix: 26 },
  { label: "/27", desc: "32 addresses — 30 hosts", prefix: 27 },
  { label: "/28", desc: "16 addresses — 14 hosts", prefix: 28 },
  { label: "/30", desc: "Point-to-point — 2 hosts", prefix: 30 },
] as const;

type TabId = "calculator" | "vlsm" | "range" | "info";

const TABS: { id: TabId; label: string; desc: string }[] = [
  { id: "calculator", label: "Subnet Calculator", desc: "CIDR to subnet details" },
  { id: "vlsm", label: "VLSM Divider", desc: "Split network into subnets" },
  { id: "range", label: "IP Range → CIDR", desc: "Range to CIDR blocks" },
  { id: "info", label: "IP Address Info", desc: "Classify & inspect any IP" },
];

// ═══════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════

export default function SubnetCalculatorTool() {
  const [activeTab, setActiveTab] = useState<TabId>("calculator");
  const { trackFirstInteraction } = useToolAnalytics("subnet-calculator");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        IP / CIDR Toolkit
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Subnet calculator, VLSM divider, IP range converter, and IP address
        classifier — all in one toolkit.
      </p>

      {/* Tab navigation */}
      <div className="mb-8 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[140px] rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-xs font-normal opacity-60 mt-0.5 hidden sm:block">
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {activeTab === "calculator" && (
        <SubnetCalculatorTab trackFirstInteraction={trackFirstInteraction} />
      )}
      {activeTab === "vlsm" && (
        <VlsmTab trackFirstInteraction={trackFirstInteraction} />
      )}
      {activeTab === "range" && (
        <RangeTab trackFirstInteraction={trackFirstInteraction} />
      )}
      {activeTab === "info" && (
        <IpInfoTab trackFirstInteraction={trackFirstInteraction} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Tab 1: Subnet Calculator (original)
// ═══════════════════════════════════════════════════════════════════

function SubnetCalculatorTab({
  trackFirstInteraction,
}: {
  trackFirstInteraction: () => void;
}) {
  const [input, setInput] = useState("192.168.1.0/24");
  const [prefix, setPrefix] = useState(24);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBinary, setShowBinary] = useState(false);

  const parsed = useMemo(() => parseInput(input), [input]);

  const result = useMemo(() => {
    if (!parsed) return null;
    const hasCidr = input.trim().includes("/");
    const effectivePrefix = hasCidr ? parsed.prefix : prefix;
    return calculate(parsed.ip, effectivePrefix);
  }, [parsed, input, prefix]);

  const effectivePrefix = useMemo(() => {
    if (parsed && input.trim().includes("/")) return parsed.prefix;
    return prefix;
  }, [parsed, input, prefix]);

  const handleInputChange = useCallback(
    (value: string) => {
      trackFirstInteraction();
      setInput(value);
      const p = parseInput(value);
      if (p && value.includes("/")) {
        setPrefix(p.prefix);
      }
    },
    [trackFirstInteraction]
  );

  const handlePrefixChange = useCallback(
    (value: number) => {
      trackFirstInteraction();
      setPrefix(value);
      const p = parseInput(input);
      if (p) {
        setInput(`${p.ip}/${value}`);
      }
    },
    [trackFirstInteraction, input]
  );

  const applyPreset = useCallback(
    (presetPrefix: number) => {
      trackFirstInteraction();
      const p = parseInput(input);
      const ip = p ? p.ip : "192.168.1.0";
      setPrefix(presetPrefix);
      setInput(`${ip}/${presetPrefix}`);
    },
    [trackFirstInteraction, input]
  );

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  const isValid = parsed !== null;

  return (
    <>
      {/* Input section */}
      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            IP Address / CIDR
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="192.168.1.0/24"
            className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 ${
              isValid || input.trim() === ""
                ? "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
            }`}
            spellCheck={false}
            autoComplete="off"
          />
          {!isValid && input.trim() !== "" && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Enter a valid IPv4 address (e.g., 192.168.1.0/24)
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Prefix length
          </label>
          <select
            value={effectivePrefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 sm:w-28"
          >
            {Array.from({ length: 33 }, (_, i) => (
              <option key={i} value={i}>
                /{i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Common Subnets
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.prefix}
              onClick={() => applyPreset(preset.prefix)}
              className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                effectivePrefix === preset.prefix
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              }`}
            >
              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                {preset.label}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {preset.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 mb-6">
            <ResultRow label="Network Address" value={result.networkAddress} mono onCopy={handleCopy} copiedField={copiedField} field="network" />
            <ResultRow label="Broadcast Address" value={result.broadcastAddress} mono onCopy={handleCopy} copiedField={copiedField} field="broadcast" />
            <ResultRow label="Subnet Mask" value={result.subnetMask} mono onCopy={handleCopy} copiedField={copiedField} field="mask" />
            <ResultRow label="Wildcard Mask" value={result.wildcardMask} mono onCopy={handleCopy} copiedField={copiedField} field="wildcard" />
            <ResultRow label="CIDR Notation" value={`${result.networkAddress}/${result.prefix}`} mono onCopy={handleCopy} copiedField={copiedField} field="cidr" />
            <ResultRow label="First Usable Host" value={result.firstHost} mono onCopy={handleCopy} copiedField={copiedField} field="first" />
            <ResultRow label="Last Usable Host" value={result.lastHost} mono onCopy={handleCopy} copiedField={copiedField} field="last" />
            <ResultRow label="Total Addresses" value={result.totalAddresses.toLocaleString()} onCopy={handleCopy} copiedField={copiedField} field="total" />
            <ResultRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} onCopy={handleCopy} copiedField={copiedField} field="usable" />
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  IP Class
                </span>
                <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                  Class {result.ipClassLabel}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Range Type
                </span>
                <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      result.isPrivateRange
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                    }`}
                  >
                    {result.isPrivateRange ? "Private (RFC 1918)" : "Public"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Binary breakdown toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowBinary(!showBinary)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <span className={`inline-block transition-transform ${showBinary ? "rotate-90" : ""}`}>
                &#9654;
              </span>
              Binary Breakdown
            </button>
            {showBinary && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Field</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Decimal</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Binary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <BinaryRow label="IP Address" decimal={parsed!.ip} binary={result.binaryIp} />
                    <BinaryRow label="Subnet Mask" decimal={result.subnetMask} binary={result.binaryMask} />
                    <BinaryRow label="Network" decimal={result.networkAddress} binary={result.binaryNetwork} />
                    <BinaryRow label="Broadcast" decimal={result.broadcastAddress} binary={result.binaryBroadcast} />
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CIDR reference table */}
          <details className="mb-6 group">
            <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors list-none flex items-center gap-2">
              <span className="inline-block transition-transform group-open:rotate-90">
                &#9654;
              </span>
              CIDR Reference Table
            </summary>
            <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">CIDR</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Subnet Mask</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Addresses</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Usable Hosts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {CIDR_TABLE.map((row) => (
                    <tr
                      key={row.prefix}
                      className={row.prefix === effectivePrefix ? "bg-indigo-50 dark:bg-indigo-950/50" : ""}
                    >
                      <td className="px-4 py-1.5 font-mono text-gray-900 dark:text-gray-100">/{row.prefix}</td>
                      <td className="px-4 py-1.5 font-mono text-gray-600 dark:text-gray-400">{row.mask}</td>
                      <td className="px-4 py-1.5 text-right text-gray-600 dark:text-gray-400">{row.addresses}</td>
                      <td className="px-4 py-1.5 text-right text-gray-600 dark:text-gray-400">{row.hosts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}

      {/* Quick reference */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Subnet Calculation
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>CIDR notation</strong> combines an IP address with a prefix
            length (e.g.,{" "}
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">192.168.1.0/24</code>).
          </li>
          <li>
            The <strong>prefix length</strong> defines how many bits are the
            network portion — the rest are host bits.
          </li>
          <li>
            <strong>Network address</strong> = all host bits set to 0.{" "}
            <strong>Broadcast</strong> = all host bits set to 1.
          </li>
          <li>
            <strong>Usable hosts</strong> = total addresses minus network and
            broadcast (except /31 and /32 special cases).
          </li>
          <li>
            <strong>Private ranges</strong> (RFC 1918): 10.0.0.0/8,
            172.16.0.0/12, 192.168.0.0/16.
          </li>
          <li>Everything runs in your browser — no data is sent over the network.</li>
        </ul>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Tab 2: VLSM Divider
// ═══════════════════════════════════════════════════════════════════

function VlsmTab({
  trackFirstInteraction,
}: {
  trackFirstInteraction: () => void;
}) {
  const [networkInput, setNetworkInput] = useState("10.0.0.0/24");
  const [subnets, setSubnets] = useState([
    { name: "Server Room", hosts: "50" },
    { name: "Office WiFi", hosts: "100" },
    { name: "Guest Network", hosts: "25" },
    { name: "Management", hosts: "10" },
  ]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const parsed = useMemo(() => parseInput(networkInput), [networkInput]);

  const result = useMemo(() => {
    if (!parsed) return null;
    const requests = subnets
      .filter((s) => s.name.trim() && parseInt(s.hosts, 10) > 0)
      .map((s) => ({ name: s.name.trim(), hosts: parseInt(s.hosts, 10) }));
    if (requests.length === 0) return null;
    return vlsmDivide(ipToNumber(parsed.ip), parsed.prefix, requests);
  }, [parsed, subnets]);

  const addSubnet = useCallback(() => {
    trackFirstInteraction();
    setSubnets((prev) => [...prev, { name: "", hosts: "" }]);
  }, [trackFirstInteraction]);

  const removeSubnet = useCallback(
    (index: number) => {
      trackFirstInteraction();
      setSubnets((prev) => prev.filter((_, i) => i !== index));
    },
    [trackFirstInteraction]
  );

  const updateSubnet = useCallback(
    (index: number, field: "name" | "hosts", value: string) => {
      trackFirstInteraction();
      setSubnets((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [trackFirstInteraction]
  );

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  const isValid = parsed !== null;

  // Calculate total requested vs available
  const totalRequested = subnets.reduce(
    (sum, s) => sum + (parseInt(s.hosts, 10) || 0),
    0
  );
  const totalAvailable = parsed ? Math.pow(2, 32 - parsed.prefix) : 0;

  return (
    <>
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Parent Network (CIDR)
        </label>
        <input
          type="text"
          value={networkInput}
          onChange={(e) => {
            trackFirstInteraction();
            setNetworkInput(e.target.value);
          }}
          placeholder="10.0.0.0/24"
          className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 ${
            isValid || networkInput.trim() === ""
              ? "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
          spellCheck={false}
          autoComplete="off"
        />
        {isValid && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {totalAvailable.toLocaleString()} total addresses available
          </p>
        )}
      </div>

      {/* Subnet requests */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Subnet Requirements
          </label>
          <button
            onClick={addSubnet}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            + Add Subnet
          </button>
        </div>
        <div className="space-y-2">
          {subnets.map((subnet, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={subnet.name}
                onChange={(e) => updateSubnet(i, "name", e.target.value)}
                placeholder="Subnet name"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                spellCheck={false}
              />
              <input
                type="number"
                value={subnet.hosts}
                onChange={(e) => updateSubnet(i, "hosts", e.target.value)}
                placeholder="Hosts"
                min="1"
                className="w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
              {subnets.length > 1 && (
                <button
                  onClick={() => removeSubnet(i)}
                  className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm text-gray-400 hover:text-red-500 hover:border-red-300 dark:border-gray-600 dark:hover:border-red-700 transition-colors"
                  title="Remove subnet"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        {totalRequested > 0 && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Total hosts requested: {totalRequested.toLocaleString()}
          </p>
        )}
      </div>

      {/* VLSM Results */}
      {result && (
        <>
          {result.error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {result.error}
            </div>
          )}
          {result.subnets.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Subnet
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Network
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Range
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Needed
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Usable
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Mask
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {result.subnets.map((s, i) => (
                    <tr key={i} className="group">
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                        {s.name}
                      </td>
                      <td className="px-4 py-2 font-mono text-gray-700 dark:text-gray-300">
                        <button
                          onClick={() =>
                            handleCopy(
                              `${s.networkAddress}/${s.allocatedPrefix}`,
                              `vlsm-net-${i}`
                            )
                          }
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Copy CIDR"
                        >
                          {s.networkAddress}/{s.allocatedPrefix}
                          {copiedField === `vlsm-net-${i}` && (
                            <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                              Copied!
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {s.firstHost} — {s.lastHost}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                        {s.requestedHosts}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                        {s.usableHosts.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-center font-mono text-xs text-gray-500 dark:text-gray-400">
                        {s.subnetMask}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Utilization bar */}
          {result.subnets.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Address Space Utilization</span>
                <span>
                  {result.subnets
                    .reduce((s, r) => s + r.allocatedSize, 0)
                    .toLocaleString()}{" "}
                  / {totalAvailable.toLocaleString()} allocated
                </span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${Math.min(100, (result.subnets.reduce((s, r) => s + r.allocatedSize, 0) / totalAvailable) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About VLSM
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>VLSM</strong> (Variable Length Subnet Masking) divides a
            network into subnets of different sizes to minimize waste.
          </li>
          <li>
            Subnets are allocated <strong>largest first</strong> for optimal
            packing.
          </li>
          <li>
            Each subnet is sized to the smallest power-of-2 block that fits the
            requested number of hosts.
          </li>
          <li>Everything runs in your browser — no data is sent over the network.</li>
        </ul>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Tab 3: IP Range → CIDR
// ═══════════════════════════════════════════════════════════════════

function RangeTab({
  trackFirstInteraction,
}: {
  trackFirstInteraction: () => void;
}) {
  const [startIp, setStartIp] = useState("192.168.1.0");
  const [endIp, setEndIp] = useState("192.168.1.255");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const startValid = validateIp(startIp.trim());
  const endValid = validateIp(endIp.trim());

  const result = useMemo(() => {
    if (!startValid || !endValid) return null;
    const s = ipToNumber(startIp.trim());
    const e = ipToNumber(endIp.trim());
    if (s > e) return null;
    return rangeToCidrs(s, e);
  }, [startIp, endIp, startValid, endValid]);

  const rangeError = useMemo(() => {
    if (!startValid || !endValid) return null;
    const s = ipToNumber(startIp.trim());
    const e = ipToNumber(endIp.trim());
    if (s > e) return "Start IP must be less than or equal to End IP";
    return null;
  }, [startIp, endIp, startValid, endValid]);

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  const copyAll = useCallback(() => {
    if (!result) return;
    const text = result.join("\n");
    navigator.clipboard.writeText(text);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 1500);
  }, [result]);

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Start IP
          </label>
          <input
            type="text"
            value={startIp}
            onChange={(e) => {
              trackFirstInteraction();
              setStartIp(e.target.value);
            }}
            placeholder="192.168.1.0"
            className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 ${
              startValid || startIp.trim() === ""
                ? "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
            }`}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            End IP
          </label>
          <input
            type="text"
            value={endIp}
            onChange={(e) => {
              trackFirstInteraction();
              setEndIp(e.target.value);
            }}
            placeholder="192.168.1.255"
            className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 ${
              endValid || endIp.trim() === ""
                ? "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
            }`}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {rangeError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {rangeError}
        </div>
      )}

      {result && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              CIDR Blocks ({result.length})
            </h2>
            <button
              onClick={copyAll}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {copiedField === "all" ? "Copied!" : "Copy All"}
            </button>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {result.map((cidr, i) => {
              const p = parseInput(cidr)!;
              const info = calculate(p.ip, p.prefix);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 group"
                >
                  <div className="flex-1">
                    <button
                      onClick={() => handleCopy(cidr, `cidr-${i}`)}
                      className="font-mono text-sm text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {cidr}
                      {copiedField === `cidr-${i}` && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                          Copied!
                        </span>
                      )}
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {info.firstHost} — {info.lastHost} ({info.usableHosts.toLocaleString()} hosts)
                    </div>
                  </div>
                  <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                    {info.subnetMask}
                  </span>
                </div>
              );
            })}
          </div>
          {result.length > 0 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Total addresses covered:{" "}
              {result
                .reduce((sum, cidr) => {
                  const p = parseInput(cidr)!;
                  return sum + Math.pow(2, 32 - p.prefix);
                }, 0)
                .toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Quick examples */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Examples
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { start: "10.0.0.0", end: "10.0.0.255", label: "Single /24" },
            { start: "192.168.1.0", end: "192.168.2.255", label: "Two /24s" },
            { start: "172.16.0.0", end: "172.16.0.9", label: "Small range" },
          ].map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                trackFirstInteraction();
                setStartIp(ex.start);
                setEndIp(ex.end);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-left hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {ex.label}
              </span>
              <span className="block text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                {ex.start} — {ex.end}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About IP Range to CIDR
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Converts an arbitrary IP range into the <strong>minimum set of
            CIDR blocks</strong> that cover the range exactly.
          </li>
          <li>
            Useful for <strong>firewall rules</strong>, ACLs, and route
            aggregation where CIDR notation is required.
          </li>
          <li>
            The algorithm finds the largest aligned block at each step to
            minimize the number of entries.
          </li>
          <li>Everything runs in your browser — no data is sent over the network.</li>
        </ul>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Tab 4: IP Address Info
// ═══════════════════════════════════════════════════════════════════

function IpInfoTab({
  trackFirstInteraction,
}: {
  trackFirstInteraction: () => void;
}) {
  const [input, setInput] = useState("8.8.8.8");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isValid = validateIp(input.trim());

  const info = useMemo(() => {
    if (!isValid) return null;
    return getIpInfo(input.trim());
  }, [input, isValid]);

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <>
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          IP Address
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            trackFirstInteraction();
            setInput(e.target.value);
          }}
          placeholder="8.8.8.8"
          className={`w-full rounded-lg border px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 ${
            isValid || input.trim() === ""
              ? "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
          spellCheck={false}
          autoComplete="off"
        />
        {!isValid && input.trim() !== "" && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            Enter a valid IPv4 address (e.g., 8.8.8.8)
          </p>
        )}
      </div>

      {/* Quick examples */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Try These
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { ip: "8.8.8.8", label: "Google DNS" },
            { ip: "10.0.0.1", label: "Private" },
            { ip: "127.0.0.1", label: "Loopback" },
            { ip: "169.254.1.1", label: "Link-Local" },
            { ip: "224.0.0.1", label: "Multicast" },
            { ip: "100.64.0.1", label: "CGNAT" },
            { ip: "255.255.255.255", label: "Broadcast" },
          ].map((ex) => (
            <button
              key={ex.ip}
              onClick={() => {
                trackFirstInteraction();
                setInput(ex.ip);
              }}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                input.trim() === ex.ip
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              }`}
            >
              <span className="font-mono">{ex.ip}</span>
              <span className="ml-1.5 text-xs opacity-60">{ex.label}</span>
            </button>
          ))}
        </div>
      </div>

      {info && (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 mb-6">
          <ResultRow label="IP Address" value={info.ip} mono onCopy={handleCopy} copiedField={copiedField} field="ip" />
          <ResultRow label="Decimal Value" value={info.ipNumber.toLocaleString()} onCopy={handleCopy} copiedField={copiedField} field="decimal" />
          <ResultRow label="Hex" value={info.hex} mono onCopy={handleCopy} copiedField={copiedField} field="hex" />
          <ResultRow label="Binary" value={info.binary} mono onCopy={handleCopy} copiedField={copiedField} field="binary" />
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                IP Class
              </span>
              <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                Class {info.ipClass}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Address Type
              </span>
              <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    info.isPrivate
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : info.type.includes("Loopback") || info.type.includes("Link-Local")
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                        : info.type.includes("Multicast") || info.type.includes("Reserved") || info.type.includes("Broadcast")
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  }`}
                >
                  {info.type}
                </span>
              </div>
            </div>
          </div>
          {info.rfc && (
            <div className="px-4 py-3">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                Reference
              </span>
              <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5 font-mono">
                {info.rfc}
              </div>
            </div>
          )}
          <ResultRow label="Reverse DNS (PTR)" value={info.reversePtr} mono onCopy={handleCopy} copiedField={copiedField} field="ptr" />
          <ResultRow label="IPv6-Mapped" value={info.ipv6Mapped} mono onCopy={handleCopy} copiedField={copiedField} field="v6mapped" />
          <ResultRow label="IPv6-Compatible" value={info.ipv6Compatible} mono onCopy={handleCopy} copiedField={copiedField} field="v6compat" />
        </div>
      )}

      {/* Special ranges reference */}
      <details className="mb-6 group">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors list-none flex items-center gap-2">
          <span className="inline-block transition-transform group-open:rotate-90">
            &#9654;
          </span>
          Special IPv4 Ranges Reference
        </summary>
        <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Range</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Purpose</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">RFC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { range: "10.0.0.0/8", purpose: "Private (Class A)", rfc: "RFC 1918" },
                { range: "172.16.0.0/12", purpose: "Private (Class B)", rfc: "RFC 1918" },
                { range: "192.168.0.0/16", purpose: "Private (Class C)", rfc: "RFC 1918" },
                { range: "127.0.0.0/8", purpose: "Loopback", rfc: "RFC 1122" },
                { range: "169.254.0.0/16", purpose: "Link-Local (APIPA)", rfc: "RFC 3927" },
                { range: "100.64.0.0/10", purpose: "Shared / CGNAT", rfc: "RFC 6598" },
                { range: "192.0.2.0/24", purpose: "Documentation (TEST-NET-1)", rfc: "RFC 5737" },
                { range: "198.51.100.0/24", purpose: "Documentation (TEST-NET-2)", rfc: "RFC 5737" },
                { range: "203.0.113.0/24", purpose: "Documentation (TEST-NET-3)", rfc: "RFC 5737" },
                { range: "224.0.0.0/4", purpose: "Multicast", rfc: "RFC 5771" },
                { range: "240.0.0.0/4", purpose: "Reserved (Future Use)", rfc: "RFC 1112" },
              ].map((r) => (
                <tr key={r.range}>
                  <td className="px-4 py-1.5 font-mono text-gray-900 dark:text-gray-100">{r.range}</td>
                  <td className="px-4 py-1.5 text-gray-600 dark:text-gray-400">{r.purpose}</td>
                  <td className="px-4 py-1.5 text-gray-500 dark:text-gray-500 font-mono text-xs">{r.rfc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About IP Address Info
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Shows the <strong>type classification</strong>, numeric
            representations, and reverse DNS format for any IPv4 address.
          </li>
          <li>
            Identifies <strong>special ranges</strong> like private (RFC 1918),
            loopback, link-local, CGNAT, multicast, and documentation networks.
          </li>
          <li>
            Provides <strong>IPv6-mapped</strong> and{" "}
            <strong>IPv6-compatible</strong> representations for dual-stack
            environments.
          </li>
          <li>Everything runs in your browser — no data is sent over the network.</li>
        </ul>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Shared sub-components
// ═══════════════════════════════════════════════════════════════════

function ResultRow({
  label,
  value,
  mono,
  onCopy,
  copiedField,
  field,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: (text: string, field: string) => void;
  copiedField: string | null;
  field: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 group">
      <div>
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <div
          className={`text-sm text-gray-900 dark:text-gray-100 mt-0.5 ${mono ? "font-mono" : ""}`}
        >
          {value}
        </div>
      </div>
      <button
        onClick={() => onCopy(value, field)}
        className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
      >
        {copiedField === field ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function BinaryRow({
  label,
  decimal,
  binary,
}: {
  label: string;
  decimal: string;
  binary: string;
}) {
  return (
    <tr>
      <td className="px-4 py-1.5 font-medium text-gray-900 dark:text-gray-100">
        {label}
      </td>
      <td className="px-4 py-1.5 font-mono text-gray-600 dark:text-gray-400">
        {decimal}
      </td>
      <td className="px-4 py-1.5 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
        {binary}
      </td>
    </tr>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CIDR reference data
// ═══════════════════════════════════════════════════════════════════

const CIDR_TABLE = [
  { prefix: 8, mask: "255.0.0.0", addresses: "16,777,216", hosts: "16,777,214" },
  { prefix: 9, mask: "255.128.0.0", addresses: "8,388,608", hosts: "8,388,606" },
  { prefix: 10, mask: "255.192.0.0", addresses: "4,194,304", hosts: "4,194,302" },
  { prefix: 11, mask: "255.224.0.0", addresses: "2,097,152", hosts: "2,097,150" },
  { prefix: 12, mask: "255.240.0.0", addresses: "1,048,576", hosts: "1,048,574" },
  { prefix: 13, mask: "255.248.0.0", addresses: "524,288", hosts: "524,286" },
  { prefix: 14, mask: "255.252.0.0", addresses: "262,144", hosts: "262,142" },
  { prefix: 15, mask: "255.254.0.0", addresses: "131,072", hosts: "131,070" },
  { prefix: 16, mask: "255.255.0.0", addresses: "65,536", hosts: "65,534" },
  { prefix: 17, mask: "255.255.128.0", addresses: "32,768", hosts: "32,766" },
  { prefix: 18, mask: "255.255.192.0", addresses: "16,384", hosts: "16,382" },
  { prefix: 19, mask: "255.255.224.0", addresses: "8,192", hosts: "8,190" },
  { prefix: 20, mask: "255.255.240.0", addresses: "4,096", hosts: "4,094" },
  { prefix: 21, mask: "255.255.248.0", addresses: "2,048", hosts: "2,046" },
  { prefix: 22, mask: "255.255.252.0", addresses: "1,024", hosts: "1,022" },
  { prefix: 23, mask: "255.255.254.0", addresses: "512", hosts: "510" },
  { prefix: 24, mask: "255.255.255.0", addresses: "256", hosts: "254" },
  { prefix: 25, mask: "255.255.255.128", addresses: "128", hosts: "126" },
  { prefix: 26, mask: "255.255.255.192", addresses: "64", hosts: "62" },
  { prefix: 27, mask: "255.255.255.224", addresses: "32", hosts: "30" },
  { prefix: 28, mask: "255.255.255.240", addresses: "16", hosts: "14" },
  { prefix: 29, mask: "255.255.255.248", addresses: "8", hosts: "6" },
  { prefix: 30, mask: "255.255.255.252", addresses: "4", hosts: "2" },
  { prefix: 31, mask: "255.255.255.254", addresses: "2", hosts: "2" },
  { prefix: 32, mask: "255.255.255.255", addresses: "1", hosts: "1" },
];
