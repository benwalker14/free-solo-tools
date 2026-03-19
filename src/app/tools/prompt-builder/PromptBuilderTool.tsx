"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "builder" | "templates" | "reference";
type OutputFormat = "raw" | "openai" | "anthropic" | "gemini" | "system-user";

interface PromptVariable {
  id: string;
  name: string;
  description: string;
  defaultValue: string;
}

interface PromptSection {
  id: string;
  label: string;
  enabled: boolean;
  content: string;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  systemPrompt: string;
  sections: PromptSection[];
  variables: PromptVariable[];
  outputFormat: OutputFormat;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

const TEMPLATES: PromptTemplate[] = [
  {
    id: "code-review",
    name: "Code Review Assistant",
    description: "Reviews code for bugs, performance, and best practices",
    category: "Development",
    systemPrompt:
      "You are an expert code reviewer. Analyze the provided code for bugs, performance issues, security vulnerabilities, and adherence to best practices. Be specific and actionable in your feedback.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are an expert {{language}} code reviewer with 10+ years of experience." },
      { id: "context", label: "Context", enabled: true, content: "Review the following {{language}} code from a {{project_type}} project." },
      { id: "task", label: "Task", enabled: true, content: "Analyze this code for:\n1. Bugs and logical errors\n2. Performance issues\n3. Security vulnerabilities\n4. Best practice violations\n5. Readability improvements" },
      { id: "format", label: "Output Format", enabled: true, content: "For each issue found, provide:\n- **Severity**: Critical / Warning / Info\n- **Line**: The affected code\n- **Issue**: What's wrong\n- **Fix**: How to fix it" },
      { id: "constraints", label: "Constraints", enabled: false, content: "Keep feedback concise. Focus on the top 5 most important issues." },
    ],
    variables: [
      { id: "language", name: "language", description: "Programming language", defaultValue: "TypeScript" },
      { id: "project_type", name: "project_type", description: "Type of project", defaultValue: "web application" },
    ],
    outputFormat: "system-user",
  },
  {
    id: "api-docs",
    name: "API Documentation Writer",
    description: "Generates API documentation from endpoint definitions",
    category: "Documentation",
    systemPrompt:
      "You are a technical writer specializing in API documentation. Write clear, complete documentation following industry best practices.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are an expert technical writer who creates clear, developer-friendly API documentation." },
      { id: "context", label: "Context", enabled: true, content: "Document the following {{api_style}} API endpoint for {{audience}} developers." },
      { id: "task", label: "Task", enabled: true, content: "Generate documentation including:\n- Endpoint description\n- Request parameters (path, query, body)\n- Response schema with examples\n- Error codes and handling\n- Code examples in {{language}}" },
      { id: "format", label: "Output Format", enabled: true, content: "Use Markdown format with:\n- H2 for sections\n- Tables for parameters\n- Fenced code blocks for examples\n- Collapsible sections for lengthy responses" },
      { id: "constraints", label: "Constraints", enabled: false, content: "Keep examples realistic. Include both success and error response examples." },
    ],
    variables: [
      { id: "api_style", name: "api_style", description: "API style", defaultValue: "REST" },
      { id: "audience", name: "audience", description: "Target audience", defaultValue: "backend" },
      { id: "language", name: "language", description: "Code example language", defaultValue: "cURL" },
    ],
    outputFormat: "system-user",
  },
  {
    id: "test-generator",
    name: "Unit Test Generator",
    description: "Generates comprehensive unit tests for functions and classes",
    category: "Development",
    systemPrompt:
      "You are a testing expert. Write thorough unit tests that cover edge cases, error paths, and common scenarios.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are a senior QA engineer specializing in {{framework}} unit testing." },
      { id: "context", label: "Context", enabled: true, content: "Write unit tests for the following {{language}} code using {{framework}}." },
      { id: "task", label: "Task", enabled: true, content: "Generate tests covering:\n1. Happy path scenarios\n2. Edge cases (empty input, null, boundary values)\n3. Error handling paths\n4. Type validation\n5. Async behavior (if applicable)" },
      { id: "format", label: "Output Format", enabled: true, content: "Output only the test file code. Use describe/it blocks. Include setup and teardown where needed." },
      { id: "constraints", label: "Constraints", enabled: true, content: "Aim for >90% code coverage. Each test should be independent. Use meaningful test descriptions." },
    ],
    variables: [
      { id: "language", name: "language", description: "Programming language", defaultValue: "TypeScript" },
      { id: "framework", name: "framework", description: "Test framework", defaultValue: "Jest" },
    ],
    outputFormat: "system-user",
  },
  {
    id: "data-analyst",
    name: "Data Analysis Assistant",
    description: "Analyzes datasets and provides insights with visualizations",
    category: "Data",
    systemPrompt:
      "You are a data analyst. Analyze the provided data and generate actionable insights with clear explanations.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are a senior data analyst with expertise in {{domain}} analytics." },
      { id: "context", label: "Context", enabled: true, content: "Analyze the following {{data_format}} dataset containing {{description}}." },
      { id: "task", label: "Task", enabled: true, content: "Provide:\n1. Summary statistics\n2. Key trends and patterns\n3. Anomalies or outliers\n4. Actionable recommendations\n5. Suggested visualizations" },
      { id: "format", label: "Output Format", enabled: true, content: "Structure your analysis with:\n- Executive summary (2-3 sentences)\n- Detailed findings with numbers\n- Charts/visualization descriptions\n- Recommendations ranked by impact" },
      { id: "constraints", label: "Constraints", enabled: false, content: "Use simple language. Avoid jargon. Focus on business-relevant insights." },
    ],
    variables: [
      { id: "domain", name: "domain", description: "Analytics domain", defaultValue: "web" },
      { id: "data_format", name: "data_format", description: "Data format", defaultValue: "CSV" },
      { id: "description", name: "description", description: "Data description", defaultValue: "user behavior metrics" },
    ],
    outputFormat: "raw",
  },
  {
    id: "commit-message",
    name: "Git Commit Message Writer",
    description: "Writes conventional commit messages from code diffs",
    category: "Development",
    systemPrompt:
      "You write concise, conventional commit messages that clearly describe changes.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are a developer who writes excellent Git commit messages following the Conventional Commits specification." },
      { id: "context", label: "Context", enabled: true, content: "Write a commit message for the following code diff in a {{project_type}} project." },
      { id: "task", label: "Task", enabled: true, content: "Generate a commit message with:\n- Type prefix (feat/fix/refactor/docs/test/chore)\n- Optional scope in parentheses\n- Short description (max 72 chars)\n- Optional body explaining WHY (not what)" },
      { id: "format", label: "Output Format", enabled: true, content: "Format:\n```\ntype(scope): short description\n\nOptional body explaining motivation and context.\n```" },
      { id: "constraints", label: "Constraints", enabled: true, content: "First line max 72 characters. Use imperative mood. Don't end with period." },
    ],
    variables: [
      { id: "project_type", name: "project_type", description: "Project type", defaultValue: "web application" },
    ],
    outputFormat: "raw",
  },
  {
    id: "sql-query",
    name: "SQL Query Builder",
    description: "Generates SQL queries from natural language descriptions",
    category: "Data",
    systemPrompt:
      "You are a database expert. Write efficient, safe SQL queries from natural language descriptions.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are a senior database engineer with deep expertise in {{db_type}}." },
      { id: "context", label: "Context", enabled: true, content: "Given the following database schema, write a SQL query for {{db_type}}." },
      { id: "task", label: "Task", enabled: true, content: "Write a SQL query that:\n- Accomplishes the described goal\n- Uses appropriate JOINs, indexes, and filtering\n- Handles NULL values correctly\n- Is optimized for performance" },
      { id: "format", label: "Output Format", enabled: true, content: "Provide:\n1. The SQL query in a code block\n2. Brief explanation of the approach\n3. Performance notes (indexes needed, estimated complexity)\n4. Alternative approaches if relevant" },
      { id: "constraints", label: "Constraints", enabled: true, content: "Use parameterized queries (never raw string interpolation). Follow SQL naming conventions. Add comments for complex logic." },
    ],
    variables: [
      { id: "db_type", name: "db_type", description: "Database type", defaultValue: "PostgreSQL" },
    ],
    outputFormat: "system-user",
  },
  {
    id: "refactor",
    name: "Code Refactoring Guide",
    description: "Suggests refactoring improvements for cleaner code",
    category: "Development",
    systemPrompt:
      "You are a software architect. Suggest concrete refactoring improvements that make code cleaner and more maintainable.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are a software architect specializing in {{language}} with deep knowledge of design patterns and SOLID principles." },
      { id: "context", label: "Context", enabled: true, content: "Refactor the following {{language}} code to improve readability, maintainability, and adherence to best practices." },
      { id: "task", label: "Task", enabled: true, content: "Analyze and suggest refactoring for:\n1. Code duplication (DRY)\n2. Single Responsibility violations\n3. Over-complex functions\n4. Poor naming\n5. Missing abstractions\n6. Testability improvements" },
      { id: "format", label: "Output Format", enabled: true, content: "For each suggestion:\n- **What**: The code smell\n- **Why**: Why it's a problem\n- **How**: The refactored code\n- **Impact**: High/Medium/Low" },
      { id: "constraints", label: "Constraints", enabled: false, content: "Prioritize high-impact changes. Don't over-engineer. Keep suggestions practical." },
    ],
    variables: [
      { id: "language", name: "language", description: "Programming language", defaultValue: "TypeScript" },
    ],
    outputFormat: "system-user",
  },
  {
    id: "explain-code",
    name: "Code Explainer",
    description: "Explains complex code in simple terms with annotations",
    category: "Education",
    systemPrompt:
      "You explain code clearly for developers of all skill levels. Break down complex logic step by step.",
    sections: [
      { id: "role", label: "Role", enabled: true, content: "You are a patient programming teacher who explains {{language}} code in clear, simple terms." },
      { id: "context", label: "Context", enabled: true, content: "Explain the following {{language}} code to a {{skill_level}} developer." },
      { id: "task", label: "Task", enabled: true, content: "Provide:\n1. High-level summary (what it does)\n2. Line-by-line walkthrough\n3. Key concepts used\n4. Potential gotchas or edge cases\n5. Suggestions for further learning" },
      { id: "format", label: "Output Format", enabled: true, content: "Use:\n- Simple language, avoid jargon\n- Numbered steps for the walkthrough\n- Code snippets to illustrate points\n- Analogies where helpful" },
      { id: "constraints", label: "Constraints", enabled: false, content: "Match explanation depth to the audience level. Don't assume prior knowledge beyond the stated skill level." },
    ],
    variables: [
      { id: "language", name: "language", description: "Programming language", defaultValue: "Python" },
      { id: "skill_level", name: "skill_level", description: "Audience skill level", defaultValue: "junior" },
    ],
    outputFormat: "raw",
  },
];

const TEMPLATE_CATEGORIES = ["All", "Development", "Documentation", "Data", "Education"];

// ---------------------------------------------------------------------------
// Output format configs
// ---------------------------------------------------------------------------

const OUTPUT_FORMATS: { value: OutputFormat; label: string; description: string }[] = [
  { value: "raw", label: "Plain Text", description: "Single prompt string — paste directly into any chat UI" },
  { value: "system-user", label: "System + User", description: "Separated system and user messages" },
  { value: "openai", label: "OpenAI API", description: "JSON for OpenAI Chat Completions API" },
  { value: "anthropic", label: "Anthropic API", description: "JSON for Anthropic Messages API" },
  { value: "gemini", label: "Gemini API", description: "JSON for Google Gemini API" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let _nextId = 1;
function uid() {
  return `id_${Date.now()}_${_nextId++}`;
}

function interpolateVars(text: string, variables: PromptVariable[]): string {
  let result = text;
  for (const v of variables) {
    result = result.replaceAll(`{{${v.name}}}`, v.defaultValue || `{{${v.name}}}`);
  }
  return result;
}

function buildPrompt(sections: PromptSection[], variables: PromptVariable[]): string {
  return sections
    .filter((s) => s.enabled && s.content.trim())
    .map((s) => `## ${s.label}\n${interpolateVars(s.content, variables)}`)
    .join("\n\n");
}

function buildSystemPrompt(systemPrompt: string, variables: PromptVariable[]): string {
  return interpolateVars(systemPrompt, variables);
}

function formatOutput(
  systemPrompt: string,
  userContent: string,
  format: OutputFormat,
  variables: PromptVariable[]
): string {
  const sys = buildSystemPrompt(systemPrompt, variables);
  const user = userContent;

  switch (format) {
    case "raw":
      return sys ? `${sys}\n\n---\n\n${user}` : user;

    case "system-user":
      return `[SYSTEM]\n${sys}\n\n[USER]\n${user}`;

    case "openai":
      return JSON.stringify(
        {
          model: "gpt-4o",
          messages: [
            ...(sys ? [{ role: "system", content: sys }] : []),
            { role: "user", content: user },
          ],
          temperature: 0.7,
        },
        null,
        2
      );

    case "anthropic":
      return JSON.stringify(
        {
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          ...(sys ? { system: sys } : {}),
          messages: [{ role: "user", content: user }],
        },
        null,
        2
      );

    case "gemini":
      return JSON.stringify(
        {
          contents: [
            ...(sys
              ? [{ role: "user", parts: [{ text: `System instructions: ${sys}` }] },
                 { role: "model", parts: [{ text: "Understood. I'll follow these instructions." }] }]
              : []),
            { role: "user", parts: [{ text: user }] },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        },
        null,
        2
      );

    default:
      return user;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PromptBuilderTool() {
  useToolAnalytics("prompt-builder");

  const [tab, setTab] = useState<Tab>("builder");
  const [templateFilter, setTemplateFilter] = useState("All");

  // Builder state
  const [systemPrompt, setSystemPrompt] = useState(TEMPLATES[0].systemPrompt);
  const [sections, setSections] = useState<PromptSection[]>(
    () => TEMPLATES[0].sections.map((s) => ({ ...s }))
  );
  const [variables, setVariables] = useState<PromptVariable[]>(
    () => TEMPLATES[0].variables.map((v) => ({ ...v }))
  );
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("system-user");
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0].id);
  const [userInput, setUserInput] = useState("");

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const builtPrompt = useMemo(
    () => buildPrompt(sections, variables),
    [sections, variables]
  );

  const finalOutput = useMemo(
    () => formatOutput(systemPrompt, builtPrompt + (userInput ? `\n\n${userInput}` : ""), outputFormat, variables),
    [systemPrompt, builtPrompt, userInput, outputFormat, variables]
  );

  const tokenEstimate = useMemo(() => {
    // Rough estimate: ~4 chars per token
    return Math.ceil(finalOutput.length / 4);
  }, [finalOutput]);

  const filteredTemplates = useMemo(() => {
    if (templateFilter === "All") return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === templateFilter);
  }, [templateFilter]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const loadTemplate = useCallback((t: PromptTemplate) => {
    setSystemPrompt(t.systemPrompt);
    setSections(t.sections.map((s) => ({ ...s })));
    setVariables(t.variables.map((v) => ({ ...v })));
    setOutputFormat(t.outputFormat);
    setActiveTemplate(t.id);
    setUserInput("");
    setTab("builder");
  }, []);

  const toggleSection = useCallback((id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }, []);

  const updateSection = useCallback((id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  }, []);

  const addSection = useCallback(() => {
    setSections((prev) => [
      ...prev,
      { id: uid(), label: "New Section", enabled: true, content: "" },
    ]);
  }, []);

  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const renameSectionLabel = useCallback((id: string, label: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, label } : s))
    );
  }, []);

  const updateVariable = useCallback(
    (id: string, field: keyof PromptVariable, value: string) => {
      setVariables((prev) =>
        prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
      );
    },
    []
  );

  const addVariable = useCallback(() => {
    setVariables((prev) => [
      ...prev,
      { id: uid(), name: "new_var", description: "", defaultValue: "" },
    ]);
  }, []);

  const removeVariable = useCallback((id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const copyOutput = useCallback(async () => {
    await navigator.clipboard.writeText(finalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [finalOutput]);

  const downloadOutput = useCallback(() => {
    const ext = outputFormat === "openai" || outputFormat === "anthropic" || outputFormat === "gemini" ? "json" : "txt";
    const blob = new Blob([finalOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [finalOutput, outputFormat]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        tab === t
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
          >
            ← Home
          </Link>
          <span className="text-zinc-600">/</span>
          <h1 className="text-2xl font-bold tracking-tight">
            AI Prompt Template Builder
          </h1>
        </div>

        <p className="mb-6 text-zinc-400 max-w-2xl">
          Build structured prompts with reusable templates, variables, and
          multi-format output for OpenAI, Anthropic, and Gemini APIs. All
          processing happens in your browser.
        </p>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {tabBtn("builder", "Builder")}
          {tabBtn("templates", "Templates")}
          {tabBtn("reference", "Reference")}
        </div>

        {/* ================================================================= */}
        {/* BUILDER TAB                                                       */}
        {/* ================================================================= */}
        {tab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Editor */}
            <div className="space-y-4">
              {/* System Prompt */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  System Prompt
                </label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y"
                  placeholder="Define the AI's role and behavior..."
                />
              </div>

              {/* Sections */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-zinc-300">
                    Prompt Sections
                  </h3>
                  <button
                    onClick={addSection}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    + Add Section
                  </button>
                </div>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`rounded-lg border p-3 transition-colors ${
                        section.enabled
                          ? "border-zinc-700 bg-zinc-800/50"
                          : "border-zinc-800 bg-zinc-900/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs border transition-colors ${
                            section.enabled
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "border-zinc-600 text-zinc-500"
                          }`}
                        >
                          {section.enabled ? "✓" : ""}
                        </button>
                        <input
                          value={section.label}
                          onChange={(e) =>
                            renameSectionLabel(section.id, e.target.value)
                          }
                          className="bg-transparent text-sm font-medium text-zinc-200 focus:outline-none focus:text-white border-b border-transparent focus:border-zinc-600 flex-1"
                        />
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                          title="Remove section"
                        >
                          ✕
                        </button>
                      </div>
                      {section.enabled && (
                        <textarea
                          value={section.content}
                          onChange={(e) =>
                            updateSection(section.id, e.target.value)
                          }
                          rows={3}
                          className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/40 resize-y"
                          placeholder="Section content... Use {{variable_name}} for variables"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Variables */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-zinc-300">
                    Variables{" "}
                    <span className="text-zinc-500 font-normal">
                      (use {"{{name}}"} in prompts)
                    </span>
                  </h3>
                  <button
                    onClick={addVariable}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    + Add Variable
                  </button>
                </div>
                {variables.length === 0 && (
                  <p className="text-xs text-zinc-500">
                    No variables defined. Add one to create dynamic prompts.
                  </p>
                )}
                <div className="space-y-2">
                  {variables.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 rounded-lg bg-zinc-800/50 border border-zinc-700 px-3 py-2"
                    >
                      <code className="text-xs text-amber-400 shrink-0">
                        {`{{`}
                      </code>
                      <input
                        value={v.name}
                        onChange={(e) =>
                          updateVariable(v.id, "name", e.target.value)
                        }
                        className="bg-transparent text-sm text-zinc-100 focus:outline-none w-24 min-w-0"
                        placeholder="name"
                      />
                      <code className="text-xs text-amber-400 shrink-0">
                        {`}}`}
                      </code>
                      <span className="text-zinc-600 mx-1">=</span>
                      <input
                        value={v.defaultValue}
                        onChange={(e) =>
                          updateVariable(v.id, "defaultValue", e.target.value)
                        }
                        className="bg-transparent text-sm text-zinc-200 focus:outline-none flex-1 min-w-0"
                        placeholder="value"
                      />
                      <button
                        onClick={() => removeVariable(v.id)}
                        className="text-zinc-600 hover:text-red-400 text-xs transition-colors shrink-0"
                        title="Remove variable"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional User Input */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Additional User Input{" "}
                  <span className="text-zinc-500 font-normal">
                    (paste code, data, or context)
                  </span>
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-y font-mono"
                  placeholder="Paste code, data, or additional context here..."
                />
              </div>
            </div>

            {/* RIGHT: Preview / Output */}
            <div className="space-y-4">
              {/* Output Format */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">
                  Output Format
                </h3>
                <div className="flex flex-wrap gap-2">
                  {OUTPUT_FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setOutputFormat(f.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        outputFormat === f.value
                          ? "border-blue-500 bg-blue-500/20 text-blue-300"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                      }`}
                      title={f.description}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Preview */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-zinc-300">
                    Output Preview
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span>~{tokenEstimate.toLocaleString()} tokens</span>
                    <span>{finalOutput.length.toLocaleString()} chars</span>
                  </div>
                </div>
                <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300 overflow-auto max-h-[500px] whitespace-pre-wrap font-mono leading-relaxed">
                  {finalOutput || <span className="text-zinc-600 italic">Output preview will appear here...</span>}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
                <button
                  onClick={downloadOutput}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Download
                </button>
              </div>

              {/* Variable Quick-Fill */}
              {variables.length > 0 && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    Variable Quick-Fill
                  </h3>
                  <div className="space-y-2">
                    {variables.map((v) => (
                      <div key={v.id} className="flex items-center gap-2">
                        <label className="text-xs text-amber-400 font-mono w-28 shrink-0 truncate" title={v.name}>
                          {`{{${v.name}}}`}
                        </label>
                        <input
                          value={v.defaultValue}
                          onChange={(e) =>
                            updateVariable(v.id, "defaultValue", e.target.value)
                          }
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                          placeholder={v.description || v.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TEMPLATES TAB                                                     */}
        {/* ================================================================= */}
        {tab === "templates" && (
          <div>
            {/* Category filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTemplateFilter(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    templateFilter === cat
                      ? "border-blue-500 bg-blue-500/20 text-blue-300"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => loadTemplate(t)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    activeTemplate === t.id
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-zinc-200">{t.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">{t.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {t.sections.length} sections
                    </span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {t.variables.length} variables
                    </span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {OUTPUT_FORMATS.find((f) => f.value === t.outputFormat)?.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* REFERENCE TAB                                                     */}
        {/* ================================================================= */}
        {tab === "reference" && (
          <div className="space-y-6 max-w-3xl">
            {/* Prompt Engineering Cheat Sheet */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">
                Prompt Engineering Cheat Sheet
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Be Specific",
                    description:
                      "Replace vague instructions with precise requirements. Instead of \"write good code\", say \"write TypeScript code with proper error handling, types, and JSDoc comments.\"",
                    example:
                      "Bad: \"Help me with my code\"\nGood: \"Review this React component for performance issues, focusing on unnecessary re-renders and missing memoization.\"",
                  },
                  {
                    title: "Use Structured Output",
                    description:
                      "Tell the model exactly how to format its response. Use markdown headers, bullet points, tables, or JSON schema.",
                    example:
                      "\"Respond with a JSON object: { severity: 'critical'|'warning'|'info', issue: string, fix: string }\"",
                  },
                  {
                    title: "Provide Examples (Few-Shot)",
                    description:
                      "Give 2-3 examples of the input/output pattern you want. Models learn patterns from examples better than instructions.",
                    example:
                      "\"Convert function names to descriptions:\\ncalculateTotal → Calculates the total price\\nvalidateEmail → (your turn)\"",
                  },
                  {
                    title: "Set Constraints",
                    description:
                      "Define boundaries: max length, what to include/exclude, response language, formatting rules.",
                    example:
                      "\"Respond in under 200 words. Use only standard library functions. Don't include import statements.\"",
                  },
                  {
                    title: "Chain of Thought",
                    description:
                      "Ask the model to think step by step for complex reasoning tasks. This improves accuracy on math, logic, and multi-step problems.",
                    example:
                      "\"Think through this step by step:\\n1. Identify the inputs\\n2. Trace the data flow\\n3. Find where the bug occurs\\n4. Suggest a fix\"",
                  },
                  {
                    title: "Role Assignment",
                    description:
                      "Assign a specific expert role in the system prompt. This primes the model with domain knowledge and communication style.",
                    example:
                      "\"You are a senior security engineer at a Fortune 500 company. Review this code for OWASP Top 10 vulnerabilities.\"",
                  },
                ].map((tip) => (
                  <div key={tip.title} className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4">
                    <h3 className="font-medium text-zinc-200 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-2">
                      {tip.description}
                    </p>
                    <pre className="text-xs text-zinc-500 bg-zinc-900 rounded p-2 whitespace-pre-wrap font-mono">
                      {tip.example}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* API Format Reference */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">
                API Format Reference
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "OpenAI Chat Completions",
                    description:
                      "Uses `messages` array with role-based messages (system, user, assistant). System message sets behavior.",
                    fields: "model, messages[], temperature, max_tokens, top_p, frequency_penalty, presence_penalty",
                    docs: "platform.openai.com/docs/api-reference/chat",
                  },
                  {
                    name: "Anthropic Messages",
                    description:
                      "Uses top-level `system` parameter (not in messages array) plus `messages` array for user/assistant turns.",
                    fields: "model, system, messages[], max_tokens, temperature, top_p, stop_sequences",
                    docs: "docs.anthropic.com/en/docs/build-with-claude/overview",
                  },
                  {
                    name: "Google Gemini",
                    description:
                      "Uses `contents` array with parts. No native system message — prepend as first user turn with model acknowledgment.",
                    fields: "contents[], generationConfig.temperature, generationConfig.maxOutputTokens, generationConfig.topP",
                    docs: "ai.google.dev/api/generate-content",
                  },
                ].map((api) => (
                  <div key={api.name} className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4">
                    <h3 className="font-medium text-zinc-200 mb-1">
                      {api.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-2">
                      {api.description}
                    </p>
                    <p className="text-xs text-zinc-500">
                      <span className="text-zinc-400">Key fields:</span>{" "}
                      {api.fields}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
