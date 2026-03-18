"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface Keyframe {
  id: number;
  percent: number;
  translateX: number;
  translateY: number;
  scale: number;
  rotate: number;
  opacity: number;
  skewX: number;
  skewY: number;
}

interface AnimationConfig {
  duration: number;
  timingFunction: string;
  delay: number;
  iterationCount: string;
  direction: string;
  fillMode: string;
}

interface Preset {
  name: string;
  label: string;
  keyframes: Omit<Keyframe, "id">[];
  config?: Partial<AnimationConfig>;
}

const TIMING_FUNCTIONS = [
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "linear",
  "steps(4, end)",
  "steps(8, end)",
];

const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"];

const FILL_MODES = ["none", "forwards", "backwards", "both"];

const ITERATION_OPTIONS = ["1", "2", "3", "5", "infinite"];

const PRESETS: Preset[] = [
  {
    name: "Fade In",
    label: "Opacity 0 → 1",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 0, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.6, fillMode: "both" },
  },
  {
    name: "Fade Out",
    label: "Opacity 1 → 0",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 0, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.6, fillMode: "both" },
  },
  {
    name: "Slide In Left",
    label: "Enter from left",
    keyframes: [
      { percent: 0, translateX: -100, translateY: 0, scale: 1, rotate: 0, opacity: 0, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.5, timingFunction: "ease-out", fillMode: "both" },
  },
  {
    name: "Slide In Up",
    label: "Enter from below",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 40, scale: 1, rotate: 0, opacity: 0, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.5, timingFunction: "ease-out", fillMode: "both" },
  },
  {
    name: "Bounce",
    label: "Elastic bounce",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 20, translateX: 0, translateY: -30, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 40, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 60, translateX: 0, translateY: -15, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 80, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 1, timingFunction: "ease", iterationCount: "infinite" },
  },
  {
    name: "Pulse",
    label: "Scale throb",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 50, translateX: 0, translateY: 0, scale: 1.08, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 1.5, timingFunction: "ease-in-out", iterationCount: "infinite" },
  },
  {
    name: "Shake",
    label: "Horizontal shake",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 10, translateX: -10, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 20, translateX: 10, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 30, translateX: -10, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 40, translateX: 10, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 50, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.6, timingFunction: "ease-in-out" },
  },
  {
    name: "Spin",
    label: "Full rotation",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 1, timingFunction: "linear", iterationCount: "infinite" },
  },
  {
    name: "Zoom In",
    label: "Scale up entrance",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 0.3, rotate: 0, opacity: 0, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.5, timingFunction: "ease-out", fillMode: "both" },
  },
  {
    name: "Flip",
    label: "Y-axis flip",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 50, translateX: 0, translateY: 0, scale: 1, rotate: 180, opacity: 0.5, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 0.8, timingFunction: "ease-in-out" },
  },
  {
    name: "Swing",
    label: "Pendulum sway",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 20, translateX: 0, translateY: 0, scale: 1, rotate: 15, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 40, translateX: 0, translateY: 0, scale: 1, rotate: -10, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 60, translateX: 0, translateY: 0, scale: 1, rotate: 5, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 80, translateX: 0, translateY: 0, scale: 1, rotate: -5, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 1, timingFunction: "ease-in-out" },
  },
  {
    name: "Jello",
    label: "Wobbly skew",
    keyframes: [
      { percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
      { percent: 22, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: -12.5, skewY: -12.5 },
      { percent: 33, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 6.25, skewY: 6.25 },
      { percent: 44, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: -3.125, skewY: -3.125 },
      { percent: 55, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 1.5, skewY: 1.5 },
      { percent: 66, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: -0.75, skewY: -0.75 },
      { percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
    ],
    config: { duration: 1, timingFunction: "ease-in-out" },
  },
];

let nextId = 3;

function defaultKeyframe(percent: number): Keyframe {
  return {
    id: nextId++,
    percent,
    translateX: 0,
    translateY: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    skewX: 0,
    skewY: 0,
  };
}

function buildTransform(kf: Keyframe | Omit<Keyframe, "id">): string {
  const parts: string[] = [];
  if (kf.translateX !== 0 || kf.translateY !== 0) {
    parts.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
  }
  if (kf.scale !== 1) parts.push(`scale(${kf.scale})`);
  if (kf.rotate !== 0) parts.push(`rotate(${kf.rotate}deg)`);
  if (kf.skewX !== 0 || kf.skewY !== 0) {
    parts.push(`skew(${kf.skewX}deg, ${kf.skewY}deg)`);
  }
  return parts.length > 0 ? parts.join(" ") : "none";
}

export default function CSSAnimationTool() {
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    { id: 1, percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 0, skewX: 0, skewY: 0 },
    { id: 2, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, skewX: 0, skewY: 0 },
  ]);
  const [activeId, setActiveId] = useState(1);
  const [config, setConfig] = useState<AnimationConfig>({
    duration: 0.6,
    timingFunction: "ease",
    delay: 0,
    iterationCount: "1",
    direction: "normal",
    fillMode: "both",
  });
  const [animationName, setAnimationName] = useState("myAnimation");
  const [isPlaying, setIsPlaying] = useState(true);
  const [previewShape, setPreviewShape] = useState<"box" | "circle" | "text">("box");
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { trackFirstInteraction } = useToolAnalytics("css-animation");
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const sortedKeyframes = [...keyframes].sort((a, b) => a.percent - b.percent);
  const activeKf = keyframes.find((kf) => kf.id === activeId) ?? keyframes[0];

  const buildKeyframesCSS = useCallback(() => {
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
    const lines = sorted.map((kf) => {
      const transform = buildTransform(kf);
      const props: string[] = [];
      if (transform !== "none") props.push(`    transform: ${transform};`);
      if (kf.opacity !== 1) props.push(`    opacity: ${kf.opacity};`);
      if (props.length === 0) props.push(`    transform: none;`);
      return `  ${kf.percent}% {\n${props.join("\n")}\n  }`;
    });
    return `@keyframes ${animationName || "myAnimation"} {\n${lines.join("\n")}\n}`;
  }, [keyframes, animationName]);

  const buildAnimationCSS = useCallback(() => {
    const name = animationName || "myAnimation";
    const parts = [
      name,
      `${config.duration}s`,
      config.timingFunction,
      `${config.delay}s`,
      config.iterationCount,
      config.direction,
      config.fillMode,
    ];
    return `animation: ${parts.join(" ")};`;
  }, [animationName, config]);

  const keyframesCSS = buildKeyframesCSS();
  const animationCSS = buildAnimationCSS();
  const fullCSS = `${keyframesCSS}\n\n.animated-element {\n  ${animationCSS}\n}`;

  // Build inline style for live preview
  const previewStyleTag = (() => {
    const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
    const lines = sorted.map((kf) => {
      const transform = buildTransform(kf);
      const props: string[] = [];
      if (transform !== "none") props.push(`transform: ${transform}`);
      if (kf.opacity !== 1) props.push(`opacity: ${kf.opacity}`);
      if (props.length === 0) props.push("transform: none");
      return `${kf.percent}% { ${props.join("; ")}; }`;
    });
    const name = `preview_${animKey}`;
    const kfRule = `@keyframes ${name} { ${lines.join(" ")} }`;
    const animParts = [
      name,
      `${config.duration}s`,
      config.timingFunction,
      `${config.delay}s`,
      config.iterationCount,
      config.direction,
      config.fillMode,
    ];
    const animRule = `.css-anim-preview { animation: ${animParts.join(" ")}; ${isPlaying ? "" : "animation-play-state: paused;"} }`;
    return `${kfRule} ${animRule}`;
  })();

  function updateKeyframe(id: number, updates: Partial<Omit<Keyframe, "id">>) {
    trackFirstInteraction();
    setKeyframes(keyframes.map((kf) => (kf.id === id ? { ...kf, ...updates } : kf)));
  }

  function addKeyframe() {
    trackFirstInteraction();
    if (keyframes.length >= 10) return;
    // Find a good default percent
    const existing = keyframes.map((kf) => kf.percent).sort((a, b) => a - b);
    let newPercent = 50;
    if (existing.includes(50)) {
      for (let i = 10; i <= 90; i += 10) {
        if (!existing.includes(i)) { newPercent = i; break; }
      }
    }
    const newKf = defaultKeyframe(newPercent);
    setKeyframes([...keyframes, newKf]);
    setActiveId(newKf.id);
  }

  function removeKeyframe(id: number) {
    trackFirstInteraction();
    if (keyframes.length <= 2) return;
    const filtered = keyframes.filter((kf) => kf.id !== id);
    setKeyframes(filtered);
    if (activeId === id) setActiveId(filtered[0].id);
  }

  function applyPreset(preset: Preset) {
    trackFirstInteraction();
    const newKfs = preset.keyframes.map((kf) => ({ ...kf, id: nextId++ }));
    setKeyframes(newKfs);
    setActiveId(newKfs[0].id);
    if (preset.config) {
      setConfig({ ...config, ...preset.config });
    }
    replay();
  }

  function replay() {
    setAnimKey((k) => k + 1);
    setIsPlaying(true);
  }

  function copyCSS() {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function updateConfig(updates: Partial<AnimationConfig>) {
    trackFirstInteraction();
    setConfig({ ...config, ...updates });
  }

  const inputClass =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const btnClass =
    "rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        CSS Animation Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Build CSS keyframe animations visually. Configure timing, add keyframes,
        preview live, then copy production-ready CSS.
      </p>

      {/* Inject preview animation */}
      <style dangerouslySetInnerHTML={{ __html: previewStyleTag }} ref={styleRef} />

      {/* Live Preview */}
      <div className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </span>
            <div className="flex gap-1">
              {(["box", "circle", "text"] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => { trackFirstInteraction(); setPreviewShape(shape); }}
                  className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    previewShape === shape
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { trackFirstInteraction(); setIsPlaying(!isPlaying); }}
              className={btnClass}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={replay} className={btnClass}>
              Replay
            </button>
          </div>
        </div>
        <div className="flex min-h-56 items-center justify-center bg-gray-50 p-8 dark:bg-gray-800/30">
          <div
            key={animKey}
            className="css-anim-preview"
          >
            {previewShape === "box" && (
              <div className="h-20 w-20 rounded-lg bg-indigo-500 shadow-lg" />
            )}
            {previewShape === "circle" && (
              <div className="h-20 w-20 rounded-full bg-indigo-500 shadow-lg" />
            )}
            {previewShape === "text" && (
              <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                DevBolt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Animation Properties */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Animation Properties
        </h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Name
              </label>
              <input
                type="text"
                value={animationName}
                onChange={(e) => {
                  trackFirstInteraction();
                  setAnimationName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""));
                }}
                className={`${inputClass} w-full`}
                placeholder="myAnimation"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Duration (s)
              </label>
              <input
                type="number"
                min={0.1}
                max={20}
                step={0.1}
                value={config.duration}
                onChange={(e) => updateConfig({ duration: Math.max(0.1, Number(e.target.value) || 0.1) })}
                className={`${inputClass} w-full`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Timing Function
              </label>
              <select
                value={config.timingFunction}
                onChange={(e) => updateConfig({ timingFunction: e.target.value })}
                className={`${inputClass} w-full`}
              >
                {TIMING_FUNCTIONS.map((tf) => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Delay (s)
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={config.delay}
                onChange={(e) => updateConfig({ delay: Math.max(0, Number(e.target.value) || 0) })}
                className={`${inputClass} w-full`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Iterations
              </label>
              <select
                value={config.iterationCount}
                onChange={(e) => updateConfig({ iterationCount: e.target.value })}
                className={`${inputClass} w-full`}
              >
                {ITERATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Direction
              </label>
              <select
                value={config.direction}
                onChange={(e) => updateConfig({ direction: e.target.value })}
                className={`${inputClass} w-full`}
              >
                {DIRECTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Fill Mode
              </label>
              <select
                value={config.fillMode}
                onChange={(e) => updateConfig({ fillMode: e.target.value })}
                className={`${inputClass} w-full`}
              >
                {FILL_MODES.map((fm) => (
                  <option key={fm} value={fm}>{fm}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Keyframes ({keyframes.length})
          </h2>
          <button
            onClick={addKeyframe}
            disabled={keyframes.length >= 10}
            className={`${btnClass} ${keyframes.length >= 10 ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            + Add Keyframe
          </button>
        </div>

        {/* Keyframe timeline */}
        <div className="mb-4 relative">
          <div className="h-8 rounded-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-indigo-500/5" />
            {sortedKeyframes.map((kf) => (
              <button
                key={kf.id}
                onClick={() => setActiveId(kf.id)}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 transition-all ${
                  activeId === kf.id
                    ? "border-indigo-500 bg-indigo-500 scale-125 z-10"
                    : "border-gray-400 bg-white dark:border-gray-500 dark:bg-gray-800 hover:border-indigo-400"
                }`}
                style={{ left: `${Math.max(4, Math.min(96, kf.percent))}%` }}
                title={`${kf.percent}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400 dark:text-gray-500 px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Keyframe tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {sortedKeyframes.map((kf) => (
            <button
              key={kf.id}
              onClick={() => setActiveId(kf.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeId === kf.id
                  ? "border border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {kf.percent}%
            </button>
          ))}
        </div>

        {/* Active Keyframe Controls */}
        {activeKf && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 space-y-4">
            {/* Percentage */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Percent
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={activeKf.percent}
                onChange={(e) => updateKeyframe(activeKf.id, { percent: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={activeKf.percent}
                  onChange={(e) => updateKeyframe(activeKf.id, { percent: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Translate X */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Translate X
              </label>
              <input
                type="range"
                min={-200}
                max={200}
                value={activeKf.translateX}
                onChange={(e) => updateKeyframe(activeKf.id, { translateX: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-500}
                  max={500}
                  value={activeKf.translateX}
                  onChange={(e) => updateKeyframe(activeKf.id, { translateX: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
              </div>
            </div>

            {/* Translate Y */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Translate Y
              </label>
              <input
                type="range"
                min={-200}
                max={200}
                value={activeKf.translateY}
                onChange={(e) => updateKeyframe(activeKf.id, { translateY: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-500}
                  max={500}
                  value={activeKf.translateY}
                  onChange={(e) => updateKeyframe(activeKf.id, { translateY: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">px</span>
              </div>
            </div>

            {/* Scale */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Scale
              </label>
              <input
                type="range"
                min={0}
                max={300}
                value={Math.round(activeKf.scale * 100)}
                onChange={(e) => updateKeyframe(activeKf.id, { scale: Number(e.target.value) / 100 })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.05}
                  value={activeKf.scale}
                  onChange={(e) => updateKeyframe(activeKf.id, { scale: Math.max(0, Number(e.target.value) || 0) })}
                  className={`${inputClass} w-20`}
                />
              </div>
            </div>

            {/* Rotate */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Rotate
              </label>
              <input
                type="range"
                min={-360}
                max={360}
                value={activeKf.rotate}
                onChange={(e) => updateKeyframe(activeKf.id, { rotate: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-720}
                  max={720}
                  value={activeKf.rotate}
                  onChange={(e) => updateKeyframe(activeKf.id, { rotate: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">deg</span>
              </div>
            </div>

            {/* Opacity */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Opacity
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(activeKf.opacity * 100)}
                onChange={(e) => updateKeyframe(activeKf.id, { opacity: Number(e.target.value) / 100 })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <span className="w-12 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                {Math.round(activeKf.opacity * 100)}%
              </span>
            </div>

            {/* Skew X/Y */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Skew X
              </label>
              <input
                type="range"
                min={-45}
                max={45}
                value={activeKf.skewX}
                onChange={(e) => updateKeyframe(activeKf.id, { skewX: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-90}
                  max={90}
                  value={activeKf.skewX}
                  onChange={(e) => updateKeyframe(activeKf.id, { skewX: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">deg</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                Skew Y
              </label>
              <input
                type="range"
                min={-45}
                max={45}
                value={activeKf.skewY}
                onChange={(e) => updateKeyframe(activeKf.id, { skewY: Number(e.target.value) })}
                className="w-40 accent-indigo-600 sm:w-56"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={-90}
                  max={90}
                  value={activeKf.skewY}
                  onChange={(e) => updateKeyframe(activeKf.id, { skewY: Number(e.target.value) || 0 })}
                  className={`${inputClass} w-20`}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">deg</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => removeKeyframe(activeKf.id)}
                disabled={keyframes.length <= 2}
                className={`rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 transition-colors ${
                  keyframes.length <= 2 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                Remove Keyframe
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Output */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS Output
          </h2>
          <button
            onClick={copyCSS}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
        <pre className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
          {fullCSS}
        </pre>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Presets
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="group rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-indigo-400 dark:border-gray-700 dark:hover:border-indigo-600"
            >
              <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
                {preset.name}
              </span>
              <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                — {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <details className="rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
          About CSS Animations
        </summary>
        <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 space-y-2">
          <p>
            CSS animations allow elements to transition between styles over time using{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              @keyframes
            </code>{" "}
            rules and the{" "}
            <code className="mx-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              animation
            </code>{" "}
            shorthand property.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">@keyframes</strong>{" "}
            define the animation steps. Each keyframe specifies CSS properties at a
            given percentage (0% = start, 100% = end).
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Duration</strong>{" "}
            controls how long one cycle takes.{" "}
            <strong className="text-gray-900 dark:text-white">Delay</strong>{" "}
            sets time before the animation starts.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Timing function</strong>{" "}
            controls acceleration:{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              ease
            </code>{" "}
            starts slow, speeds up, then slows;{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              linear
            </code>{" "}
            is constant speed.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Fill mode</strong>{" "}
            determines styles before/after animation:{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              forwards
            </code>{" "}
            keeps the final state,{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              both
            </code>{" "}
            applies in both directions.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Direction</strong>:{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              alternate
            </code>{" "}
            reverses every other cycle, creating smooth back-and-forth effects.
            Use with{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              infinite
            </code>{" "}
            iteration count for looping animations.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Performance tip</strong>:{" "}
            animate{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              transform
            </code>{" "}
            and{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              opacity
            </code>{" "}
            for best performance — they run on the GPU compositor and don&apos;t
            trigger layout recalculations.
          </p>
        </div>
      </details>
    </div>
  );
}
