"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

const PERMISSION_LABELS = ["Read", "Write", "Execute"] as const;
const ROLE_LABELS = ["Owner", "Group", "Others"] as const;
const PERMISSION_BITS = [4, 2, 1] as const;

const PRESETS = [
  { label: "644", desc: "Files (owner rw, others r)" },
  { label: "755", desc: "Directories / scripts (owner rwx, others rx)" },
  { label: "600", desc: "Private files (owner rw only)" },
  { label: "700", desc: "Private directories (owner rwx only)" },
  { label: "777", desc: "Full access (everyone rwx)" },
  { label: "444", desc: "Read-only for everyone" },
  { label: "750", desc: "Group access (owner rwx, group rx)" },
  { label: "664", desc: "Shared files (owner+group rw, others r)" },
] as const;

type Permissions = [number, number, number]; // [owner, group, others] each 0-7

function permsToBits(perms: Permissions): boolean[][] {
  return perms.map((p) =>
    PERMISSION_BITS.map((bit) => (p & bit) !== 0)
  );
}

function bitsToPerms(bits: boolean[][]): Permissions {
  return bits.map((role) =>
    role.reduce((sum, on, i) => sum + (on ? PERMISSION_BITS[i] : 0), 0)
  ) as Permissions;
}

function permsToSymbolic(perms: Permissions): string {
  return perms
    .map((p) => {
      const r = p & 4 ? "r" : "-";
      const w = p & 2 ? "w" : "-";
      const x = p & 1 ? "x" : "-";
      return r + w + x;
    })
    .join("");
}

function permsToOctal(perms: Permissions): string {
  return perms.join("");
}

function parseOctalInput(input: string): Permissions | null {
  const trimmed = input.trim();
  if (!/^[0-7]{3}$/.test(trimmed)) return null;
  return [
    parseInt(trimmed[0], 10),
    parseInt(trimmed[1], 10),
    parseInt(trimmed[2], 10),
  ] as Permissions;
}

export default function ChmodCalculatorTool() {
  const [perms, setPerms] = useState<Permissions>([6, 4, 4]); // 644
  const [octalInput, setOctalInput] = useState("644");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { trackFirstInteraction } = useToolAnalytics("chmod-calculator");

  const bits = useMemo(() => permsToBits(perms), [perms]);
  const symbolic = useMemo(() => permsToSymbolic(perms), [perms]);
  const octal = useMemo(() => permsToOctal(perms), [perms]);

  const toggleBit = useCallback(
    (roleIdx: number, permIdx: number) => {
      trackFirstInteraction();
      const newBits = bits.map((role) => [...role]);
      newBits[roleIdx][permIdx] = !newBits[roleIdx][permIdx];
      const newPerms = bitsToPerms(newBits);
      setPerms(newPerms);
      setOctalInput(permsToOctal(newPerms));
    },
    [bits, trackFirstInteraction]
  );

  const handleOctalChange = useCallback(
    (value: string) => {
      trackFirstInteraction();
      setOctalInput(value);
      const parsed = parseOctalInput(value);
      if (parsed) setPerms(parsed);
    },
    [trackFirstInteraction]
  );

  const applyPreset = useCallback(
    (preset: string) => {
      trackFirstInteraction();
      const parsed = parseOctalInput(preset);
      if (parsed) {
        setPerms(parsed);
        setOctalInput(preset);
      }
    },
    [trackFirstInteraction]
  );

  function handleCopy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  const octalValid = /^[0-7]{3}$/.test(octalInput.trim());

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Chmod Calculator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Calculate Unix file permissions. Toggle checkboxes or enter an octal
        code — results update instantly.
      </p>

      {/* Octal input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Octal notation
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={octalInput}
            onChange={(e) => handleOctalChange(e.target.value)}
            maxLength={3}
            className={`w-28 rounded-lg border px-4 py-3 font-mono text-lg text-center tracking-widest focus:outline-none focus:ring-1 ${
              octalValid
                ? "border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                : "border-red-300 bg-red-50 text-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-700 dark:bg-red-950 dark:text-red-400"
            }`}
            spellCheck={false}
            autoComplete="off"
          />
          {!octalValid && octalInput.trim().length > 0 && (
            <span className="text-sm text-red-600 dark:text-red-400">
              Enter 3 digits (0–7)
            </span>
          )}
        </div>
      </div>

      {/* Permission matrix */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Role
              </th>
              {PERMISSION_LABELS.map((label) => (
                <th
                  key={label}
                  className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  {label}
                </th>
              ))}
              <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {ROLE_LABELS.map((role, roleIdx) => (
              <tr key={role}>
                <td className="py-3 font-medium text-gray-900 dark:text-gray-100">
                  {role}
                </td>
                {PERMISSION_LABELS.map((_, permIdx) => (
                  <td key={permIdx} className="py-3 text-center">
                    <button
                      onClick={() => toggleBit(roleIdx, permIdx)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                        bits[roleIdx][permIdx]
                          ? "border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                          : "border-gray-300 bg-white text-gray-300 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-600 dark:hover:border-gray-500"
                      }`}
                      aria-label={`${bits[roleIdx][permIdx] ? "Disable" : "Enable"} ${PERMISSION_LABELS[permIdx]} for ${role}`}
                    >
                      {bits[roleIdx][permIdx] ? "✓" : ""}
                    </button>
                  </td>
                ))}
                <td className="py-3 text-center font-mono text-gray-700 dark:text-gray-300">
                  {perms[roleIdx]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 mb-6">
        <div className="flex items-center justify-between px-4 py-3 group">
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Octal
            </span>
            <div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-0.5">
              {octal}
            </div>
          </div>
          <button
            onClick={() => handleCopy(octal, "octal")}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
          >
            {copiedField === "octal" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-3 group">
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Symbolic
            </span>
            <div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-0.5">
              -{symbolic}
            </div>
          </div>
          <button
            onClick={() => handleCopy("-" + symbolic, "symbolic")}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
          >
            {copiedField === "symbolic" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-3 group">
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              chmod command
            </span>
            <div className="font-mono text-sm text-gray-900 dark:text-gray-100 mt-0.5">
              chmod {octal} filename
            </div>
          </div>
          <button
            onClick={() => handleCopy(`chmod ${octal} filename`, "command")}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
          >
            {copiedField === "command" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-3 group">
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              Description
            </span>
            <div className="text-sm text-gray-900 dark:text-gray-100 mt-0.5">
              Owner: {describeDigit(perms[0])} | Group:{" "}
              {describeDigit(perms[1])} | Others: {describeDigit(perms[2])}
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Common Presets
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.label)}
              className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                octal === preset.label
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

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Unix File Permissions
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Each digit represents permissions for{" "}
            <strong>owner</strong>, <strong>group</strong>, and{" "}
            <strong>others</strong>.
          </li>
          <li>
            Read (
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              4
            </code>
            ) + Write (
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              2
            </code>
            ) + Execute (
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              1
            </code>
            ) = octal digit.
          </li>
          <li>
            Example:{" "}
            <code className="rounded bg-gray-200 px-1 dark:bg-gray-800">
              755
            </code>{" "}
            = owner rwx, group rx, others rx.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}

function describeDigit(digit: number): string {
  const parts: string[] = [];
  if (digit & 4) parts.push("read");
  if (digit & 2) parts.push("write");
  if (digit & 1) parts.push("execute");
  return parts.length > 0 ? parts.join(", ") : "none";
}
