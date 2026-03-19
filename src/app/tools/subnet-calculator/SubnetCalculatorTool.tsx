"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- IPv4 math helpers ---

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
  // CIDR notation: 192.168.1.0/24
  const cidrMatch = trimmed.match(/^([\d.]+)\/(\d{1,2})$/);
  if (cidrMatch) {
    const ip = cidrMatch[1];
    const prefix = parseInt(cidrMatch[2], 10);
    if (validateIp(ip) && prefix >= 0 && prefix <= 32) return { ip, prefix };
  }
  // Plain IP
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

// Common CIDR presets
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

export default function SubnetCalculatorTool() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [prefix, setPrefix] = useState(24);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBinary, setShowBinary] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("subnet-calculator");

  const parsed = useMemo(() => parseInput(input), [input]);

  const result = useMemo(() => {
    if (!parsed) return null;
    // Use prefix from CIDR input if present, otherwise use dropdown
    const hasCidr = input.trim().includes("/");
    const effectivePrefix = hasCidr ? parsed.prefix : prefix;
    return calculate(parsed.ip, effectivePrefix);
  }, [parsed, input, prefix]);

  // Sync prefix dropdown when CIDR input changes
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
      // Update input to reflect new prefix if it has CIDR notation
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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Subnet Calculator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Calculate network address, broadcast, host range, and subnet mask from
        any IPv4 CIDR notation. Results update instantly.
      </p>

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
            <ResultRow
              label="Network Address"
              value={result.networkAddress}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="network"
            />
            <ResultRow
              label="Broadcast Address"
              value={result.broadcastAddress}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="broadcast"
            />
            <ResultRow
              label="Subnet Mask"
              value={result.subnetMask}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="mask"
            />
            <ResultRow
              label="Wildcard Mask"
              value={result.wildcardMask}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="wildcard"
            />
            <ResultRow
              label="CIDR Notation"
              value={`${result.networkAddress}/${result.prefix}`}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="cidr"
            />
            <ResultRow
              label="First Usable Host"
              value={result.firstHost}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="first"
            />
            <ResultRow
              label="Last Usable Host"
              value={result.lastHost}
              mono
              onCopy={handleCopy}
              copiedField={copiedField}
              field="last"
            />
            <ResultRow
              label="Total Addresses"
              value={result.totalAddresses.toLocaleString()}
              onCopy={handleCopy}
              copiedField={copiedField}
              field="total"
            />
            <ResultRow
              label="Usable Hosts"
              value={result.usableHosts.toLocaleString()}
              onCopy={handleCopy}
              copiedField={copiedField}
              field="usable"
            />
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
              <span
                className={`inline-block transition-transform ${showBinary ? "rotate-90" : ""}`}
              >
                &#9654;
              </span>
              Binary Breakdown
            </button>
            {showBinary && (
              <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Field
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Decimal
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Binary
                      </th>
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
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      CIDR
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Subnet Mask
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Addresses
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Usable Hosts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {CIDR_TABLE.map((row) => (
                    <tr
                      key={row.prefix}
                      className={
                        row.prefix === effectivePrefix
                          ? "bg-indigo-50 dark:bg-indigo-950/50"
                          : ""
                      }
                    >
                      <td className="px-4 py-1.5 font-mono text-gray-900 dark:text-gray-100">
                        /{row.prefix}
                      </td>
                      <td className="px-4 py-1.5 font-mono text-gray-600 dark:text-gray-400">
                        {row.mask}
                      </td>
                      <td className="px-4 py-1.5 text-right text-gray-600 dark:text-gray-400">
                        {row.addresses}
                      </td>
                      <td className="px-4 py-1.5 text-right text-gray-600 dark:text-gray-400">
                        {row.hosts}
                      </td>
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
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              192.168.1.0/24
            </code>
            ).
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
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}

// --- Sub-components ---

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

// --- CIDR reference data ---

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
