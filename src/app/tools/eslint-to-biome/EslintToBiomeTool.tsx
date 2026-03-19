"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ConversionWarning {
  rule: string;
  reason: string;
  severity: "info" | "warning" | "error";
}

interface ConversionResult {
  biomeJson: BiomeConfig;
  stats: {
    totalRules: number;
    converted: number;
    unsupported: number;
    warnings: number;
  };
  warnings: ConversionWarning[];
}

interface BiomeConfig {
  $schema: string;
  organizeImports?: { enabled: boolean };
  formatter?: {
    enabled?: boolean;
    indentStyle?: string;
    indentWidth?: number;
    lineWidth?: number;
    lineEnding?: string;
  };
  linter?: {
    enabled: boolean;
    rules?: {
      recommended?: boolean;
      correctness?: Record<string, string>;
      suspicious?: Record<string, string>;
      style?: Record<string, string>;
      complexity?: Record<string, string>;
      nursery?: Record<string, string>;
      performance?: Record<string, string>;
      security?: Record<string, string>;
      a11y?: Record<string, string>;
    };
  };
  javascript?: {
    formatter?: {
      quoteStyle?: string;
      semicolons?: string;
      trailingCommas?: string;
      arrowParentheses?: string;
    };
  };
}

type EslintSeverity = "off" | "warn" | "error" | 0 | 1 | 2;

interface EslintConfig {
  rules?: Record<string, EslintSeverity | [EslintSeverity, ...unknown[]]>;
  extends?: string | string[];
  plugins?: string[];
  env?: Record<string, boolean>;
  parserOptions?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  overrides?: unknown[];
}

// ─── ESLint → Biome Rule Mapping ────────────────────────────────────────────

const RULE_MAP: Record<string, { biomeGroup: string; biomeName: string }> = {
  // correctness
  "no-unused-vars": { biomeGroup: "correctness", biomeName: "noUnusedVariables" },
  "no-undef": { biomeGroup: "correctness", biomeName: "noUndeclaredVariables" },
  "no-unreachable": { biomeGroup: "correctness", biomeName: "noUnreachable" },
  "no-constant-condition": { biomeGroup: "correctness", biomeName: "noConstantCondition" },
  "no-empty-pattern": { biomeGroup: "correctness", biomeName: "noEmptyPattern" },
  "use-isnan": { biomeGroup: "correctness", biomeName: "useIsNan" },
  "valid-typeof": { biomeGroup: "correctness", biomeName: "useValidTypeof" },
  "no-self-assign": { biomeGroup: "correctness", biomeName: "noSelfAssign" },
  "no-unsafe-finally": { biomeGroup: "correctness", biomeName: "noUnsafeFinally" },
  "no-unsafe-optional-chaining": { biomeGroup: "correctness", biomeName: "noUnsafeOptionalChaining" },
  "no-unused-labels": { biomeGroup: "correctness", biomeName: "noUnusedLabels" },
  "no-constructor-return": { biomeGroup: "correctness", biomeName: "noConstructorReturn" },
  "no-inner-declarations": { biomeGroup: "correctness", biomeName: "noInnerDeclarations" },
  "no-setter-return": { biomeGroup: "correctness", biomeName: "noSetterReturn" },
  "no-dupe-args": { biomeGroup: "correctness", biomeName: "noDuplicateParameters" },
  "no-dupe-keys": { biomeGroup: "correctness", biomeName: "noDuplicateObjectKeys" },
  "no-import-assign": { biomeGroup: "correctness", biomeName: "noImportAssign" },
  "no-new-native-nonconstructor": { biomeGroup: "correctness", biomeName: "noNewSymbol" },
  "no-global-assign": { biomeGroup: "correctness", biomeName: "noGlobalAssign" },
  "no-nonoctal-decimal-escape": { biomeGroup: "correctness", biomeName: "noNonoctalDecimalEscape" },
  "no-irregular-whitespace": { biomeGroup: "correctness", biomeName: "noIrregularWhitespace" },

  // suspicious
  "no-debugger": { biomeGroup: "suspicious", biomeName: "noDebugger" },
  "no-fallthrough": { biomeGroup: "suspicious", biomeName: "noFallthroughSwitchClause" },
  "no-shadow-restricted-names": { biomeGroup: "suspicious", biomeName: "noShadowRestrictedNames" },
  "no-sparse-arrays": { biomeGroup: "suspicious", biomeName: "noSparseArray" },
  "no-empty": { biomeGroup: "suspicious", biomeName: "noEmptyBlockStatements" },
  "no-extra-boolean-cast": { biomeGroup: "suspicious", biomeName: "noExtraBooleanCast" },
  "no-loss-of-precision": { biomeGroup: "suspicious", biomeName: "noPrecisionLoss" },
  "no-prototype-builtins": { biomeGroup: "suspicious", biomeName: "noPrototypeBuiltins" },
  "no-unsafe-negation": { biomeGroup: "suspicious", biomeName: "noUnsafeNegation" },
  "no-var": { biomeGroup: "suspicious", biomeName: "noVar" },
  "no-redeclare": { biomeGroup: "suspicious", biomeName: "noRedeclare" },
  "no-label-var": { biomeGroup: "suspicious", biomeName: "noLabelVar" },
  "no-self-compare": { biomeGroup: "suspicious", biomeName: "noSelfCompare" },
  "no-duplicate-case": { biomeGroup: "suspicious", biomeName: "noDuplicateCase" },
  "no-async-promise-executor": { biomeGroup: "suspicious", biomeName: "noAsyncPromiseExecutor" },
  "no-control-regex": { biomeGroup: "suspicious", biomeName: "noControlCharactersInRegex" },
  "no-misleading-character-class": { biomeGroup: "suspicious", biomeName: "noMisleadingCharacterClass" },
  "no-ex-assign": { biomeGroup: "suspicious", biomeName: "noCatchAssign" },
  "no-func-assign": { biomeGroup: "suspicious", biomeName: "noFunctionAssign" },
  "no-class-assign": { biomeGroup: "suspicious", biomeName: "noClassAssign" },
  "no-compare-neg-zero": { biomeGroup: "suspicious", biomeName: "noCompareNegZero" },
  "require-yield": { biomeGroup: "suspicious", biomeName: "useYield" },
  "no-with": { biomeGroup: "suspicious", biomeName: "noWith" },
  "no-useless-catch": { biomeGroup: "suspicious", biomeName: "noUselessCatch" },

  // style
  "no-useless-rename": { biomeGroup: "style", biomeName: "noUselessRename" },
  "prefer-const": { biomeGroup: "style", biomeName: "useConst" },
  "prefer-template": { biomeGroup: "style", biomeName: "useTemplate" },
  "no-lonely-if": { biomeGroup: "style", biomeName: "noUselessElse" },
  "prefer-exponentiation-operator": { biomeGroup: "style", biomeName: "useExponentiationOperator" },
  "one-var": { biomeGroup: "style", biomeName: "useSingleVarDeclarator" },
  "prefer-numeric-literals": { biomeGroup: "style", biomeName: "useNumericLiterals" },
  "default-case-last": { biomeGroup: "style", biomeName: "useDefaultSwitchClauseLast" },
  "no-useless-computed-key": { biomeGroup: "style", biomeName: "useLiteralKeys" },
  "operator-assignment": { biomeGroup: "style", biomeName: "useShorthandAssign" },
  "no-negated-condition": { biomeGroup: "style", biomeName: "noNegationElse" },

  // complexity
  "no-useless-constructor": { biomeGroup: "complexity", biomeName: "noUselessConstructor" },
  "no-empty-static-block": { biomeGroup: "complexity", biomeName: "noEmptyStaticBlock" },
  "no-regex-spaces": { biomeGroup: "complexity", biomeName: "noMultipleSpacesInRegularExpressionLiterals" },
  "no-extra-label": { biomeGroup: "complexity", biomeName: "noUselessLabel" },
  "no-lone-blocks": { biomeGroup: "complexity", biomeName: "noUselessLoneBlockStatements" },
  "prefer-arrow-callback": { biomeGroup: "complexity", biomeName: "useArrowFunction" },
  "no-useless-escape": { biomeGroup: "complexity", biomeName: "noUselessStringRaw" },
  "no-useless-concat": { biomeGroup: "complexity", biomeName: "noUselessStringConcat" },

  // performance
  "no-delete-var": { biomeGroup: "performance", biomeName: "noDelete" },

  // security
  "no-eval": { biomeGroup: "security", biomeName: "noGlobalEval" },

  // a11y (from eslint-plugin-jsx-a11y)
  "jsx-a11y/alt-text": { biomeGroup: "a11y", biomeName: "useAltText" },
  "jsx-a11y/anchor-has-content": { biomeGroup: "a11y", biomeName: "useAnchorContent" },
  "jsx-a11y/anchor-is-valid": { biomeGroup: "a11y", biomeName: "useValidAnchor" },
  "jsx-a11y/aria-activedescendant-has-tabindex": { biomeGroup: "a11y", biomeName: "useAriaActivedescendantHasTabindex" },
  "jsx-a11y/aria-props": { biomeGroup: "a11y", biomeName: "useValidAriaProps" },
  "jsx-a11y/aria-role": { biomeGroup: "a11y", biomeName: "useValidAriaRole" },
  "jsx-a11y/aria-unsupported-elements": { biomeGroup: "a11y", biomeName: "noAriaUnsupportedOnRole" },
  "jsx-a11y/click-events-have-key-events": { biomeGroup: "a11y", biomeName: "useKeyWithClickEvents" },
  "jsx-a11y/heading-has-content": { biomeGroup: "a11y", biomeName: "useHeadingContent" },
  "jsx-a11y/html-has-lang": { biomeGroup: "a11y", biomeName: "useHtmlLang" },
  "jsx-a11y/img-redundant-alt": { biomeGroup: "a11y", biomeName: "noRedundantAlt" },
  "jsx-a11y/interactive-supports-focus": { biomeGroup: "a11y", biomeName: "useButtonType" },
  "jsx-a11y/lang": { biomeGroup: "a11y", biomeName: "useValidLang" },
  "jsx-a11y/media-has-caption": { biomeGroup: "a11y", biomeName: "useMediaCaption" },
  "jsx-a11y/mouse-events-have-key-events": { biomeGroup: "a11y", biomeName: "useKeyWithMouseEvents" },
  "jsx-a11y/no-access-key": { biomeGroup: "a11y", biomeName: "noAccessKey" },
  "jsx-a11y/no-aria-hidden-on-focusable": { biomeGroup: "a11y", biomeName: "noAriaHiddenOnFocusable" },
  "jsx-a11y/no-autofocus": { biomeGroup: "a11y", biomeName: "noAutofocus" },
  "jsx-a11y/no-distracting-elements": { biomeGroup: "a11y", biomeName: "noDistractingElements" },
  "jsx-a11y/no-interactive-element-to-noninteractive-role": { biomeGroup: "a11y", biomeName: "noInteractiveElementToNoninteractiveRole" },
  "jsx-a11y/no-noninteractive-element-to-interactive-role": { biomeGroup: "a11y", biomeName: "noNoninteractiveElementToInteractiveRole" },
  "jsx-a11y/no-noninteractive-tabindex": { biomeGroup: "a11y", biomeName: "noNoninteractiveTabindex" },
  "jsx-a11y/no-redundant-roles": { biomeGroup: "a11y", biomeName: "noRedundantRoles" },
  "jsx-a11y/role-has-required-aria-props": { biomeGroup: "a11y", biomeName: "useAriaPropsForRole" },
  "jsx-a11y/scope": { biomeGroup: "a11y", biomeName: "noHeaderScope" },
  "jsx-a11y/tabindex-no-positive": { biomeGroup: "a11y", biomeName: "noPositiveTabindex" },

  // TypeScript (from @typescript-eslint)
  "@typescript-eslint/no-unused-vars": { biomeGroup: "correctness", biomeName: "noUnusedVariables" },
  "@typescript-eslint/no-explicit-any": { biomeGroup: "suspicious", biomeName: "noExplicitAny" },
  "@typescript-eslint/ban-types": { biomeGroup: "complexity", biomeName: "noBannedTypes" },
  "@typescript-eslint/no-non-null-assertion": { biomeGroup: "style", biomeName: "noNonNullAssertion" },
  "@typescript-eslint/no-empty-interface": { biomeGroup: "suspicious", biomeName: "noEmptyInterface" },
  "@typescript-eslint/no-namespace": { biomeGroup: "style", biomeName: "noNamespace" },
  "@typescript-eslint/prefer-as-const": { biomeGroup: "style", biomeName: "useAsConstAssertion" },
  "@typescript-eslint/no-inferrable-types": { biomeGroup: "style", biomeName: "noInferrableTypes" },
  "@typescript-eslint/no-misused-new": { biomeGroup: "suspicious", biomeName: "noMisusedNew" },
  "@typescript-eslint/no-array-constructor": { biomeGroup: "correctness", biomeName: "useArrayLiterals" },
  "@typescript-eslint/no-extra-non-null-assertion": { biomeGroup: "suspicious", biomeName: "noExtraNonNullAssertion" },
  "@typescript-eslint/no-this-alias": { biomeGroup: "complexity", biomeName: "noThisInStatic" },
  "@typescript-eslint/no-unnecessary-type-constraint": { biomeGroup: "complexity", biomeName: "noUselessTypeConstraint" },
  "@typescript-eslint/no-unsafe-declaration-merging": { biomeGroup: "suspicious", biomeName: "noUnsafeDeclarationMerging" },
  "@typescript-eslint/consistent-type-imports": { biomeGroup: "style", biomeName: "useImportType" },
  "@typescript-eslint/no-redeclare": { biomeGroup: "suspicious", biomeName: "noRedeclare" },
  "@typescript-eslint/prefer-enum-initializers": { biomeGroup: "style", biomeName: "useEnumInitializers" },
  "@typescript-eslint/no-useless-constructor": { biomeGroup: "complexity", biomeName: "noUselessConstructor" },

  // React (from eslint-plugin-react / eslint-plugin-react-hooks)
  "react/jsx-no-duplicate-props": { biomeGroup: "suspicious", biomeName: "noDuplicateJsxProps" },
  "react/no-danger-with-children": { biomeGroup: "security", biomeName: "noDangerouslySetInnerHtmlWithChildren" },
  "react/no-children-prop": { biomeGroup: "correctness", biomeName: "noChildrenProp" },
  "react/void-dom-elements-no-children": { biomeGroup: "correctness", biomeName: "noVoidElementsWithChildren" },
  "react/jsx-key": { biomeGroup: "correctness", biomeName: "useJsxKeyInIterable" },
  "react/jsx-no-comment-textnodes": { biomeGroup: "suspicious", biomeName: "noCommentText" },
  "react/jsx-no-target-blank": { biomeGroup: "a11y", biomeName: "noBlankTarget" },
  "react/jsx-no-useless-fragment": { biomeGroup: "complexity", biomeName: "noUselessFragments" },
  "react-hooks/rules-of-hooks": { biomeGroup: "correctness", biomeName: "useHookAtTopLevel" },
  "react-hooks/exhaustive-deps": { biomeGroup: "correctness", biomeName: "useExhaustiveDependencies" },

  // Import rules
  "import/no-duplicates": { biomeGroup: "correctness", biomeName: "noDuplicateImports" },
  "no-duplicate-imports": { biomeGroup: "correctness", biomeName: "noDuplicateImports" },
};

// Rules that ESLint has but Biome does NOT support
const UNSUPPORTED_RULES = new Set([
  "no-console",
  "no-alert",
  "no-restricted-syntax",
  "no-restricted-imports",
  "no-restricted-globals",
  "no-restricted-properties",
  "no-param-reassign",
  "no-plusplus",
  "no-continue",
  "no-nested-ternary",
  "no-unneeded-ternary",
  "no-ternary",
  "no-multi-assign",
  "no-return-assign",
  "no-return-await",
  "no-sequences",
  "no-throw-literal",
  "no-unused-expressions",
  "no-void",
  "consistent-return",
  "curly",
  "dot-notation",
  "eqeqeq",
  "guard-for-in",
  "no-caller",
  "no-case-declarations",
  "no-else-return",
  "no-extend-native",
  "no-floating-decimal",
  "no-implied-eval",
  "no-iterator",
  "no-labels",
  "no-loop-func",
  "no-magic-numbers",
  "no-multi-str",
  "no-new",
  "no-new-func",
  "no-new-object",
  "no-new-wrappers",
  "no-octal",
  "no-octal-escape",
  "no-proto",
  "no-script-url",
  "no-shadow",
  "no-template-curly-in-string",
  "no-underscore-dangle",
  "no-use-before-define",
  "prefer-destructuring",
  "prefer-object-spread",
  "prefer-promise-reject-errors",
  "prefer-rest-params",
  "prefer-spread",
  "radix",
  "sort-imports",
  "spaced-comment",
  "strict",
  "symbol-description",
  "yoda",
  "camelcase",
  "capitalized-comments",
  "id-length",
  "max-depth",
  "max-lines",
  "max-params",
  "max-statements",
  "new-cap",
  "no-array-constructor",
  "no-bitwise",
  "no-mixed-operators",
  "no-tabs",
  "no-undefined",
  "lines-between-class-members",
  "padding-line-between-statements",
  // Formatting rules (Biome handles formatting separately)
  "indent",
  "semi",
  "quotes",
  "comma-dangle",
  "arrow-parens",
  "max-len",
  "no-trailing-spaces",
  "no-multiple-empty-lines",
  "eol-last",
  "comma-spacing",
  "key-spacing",
  "object-curly-spacing",
  "array-bracket-spacing",
  "space-before-function-paren",
  "space-before-blocks",
  "space-in-parens",
  "space-infix-ops",
  "keyword-spacing",
  "brace-style",
  "no-mixed-spaces-and-tabs",
  "jsx-quotes",
]);

// ─── Formatter option extraction ────────────────────────────────────────────

function extractFormatterOptions(
  config: EslintConfig
): Partial<BiomeConfig["formatter"]> & { js?: Partial<NonNullable<BiomeConfig["javascript"]>["formatter"]> } {
  const formatter: Partial<BiomeConfig["formatter"]> = {};
  const js: Partial<NonNullable<NonNullable<BiomeConfig["javascript"]>["formatter"]>> = {};
  const rules = config.rules || {};

  // Indent
  const indentRule = rules["indent"];
  if (indentRule) {
    const indentOpts = Array.isArray(indentRule) ? indentRule : [indentRule];
    if (indentOpts[1] === "tab") {
      formatter.indentStyle = "tab";
    } else if (typeof indentOpts[1] === "number") {
      formatter.indentStyle = "space";
      formatter.indentWidth = indentOpts[1];
    }
  }

  // Semicolons
  const semiRule = rules["semi"];
  if (semiRule) {
    const semiOpts = Array.isArray(semiRule) ? semiRule : [semiRule];
    const semiVal = semiOpts.length > 1 ? semiOpts[1] : undefined;
    if (semiVal === "never") {
      js.semicolons = "asNeeded";
    } else if (semiVal === "always") {
      js.semicolons = "always";
    }
  }

  // Quotes
  const quotesRule = rules["quotes"];
  if (quotesRule) {
    const qOpts = Array.isArray(quotesRule) ? quotesRule : [quotesRule];
    const qVal = qOpts.length > 1 ? qOpts[1] : undefined;
    if (qVal === "single") {
      js.quoteStyle = "single";
    } else if (qVal === "double") {
      js.quoteStyle = "double";
    }
  }

  // Trailing commas
  const commaRule = rules["comma-dangle"];
  if (commaRule) {
    const cOpts = Array.isArray(commaRule) ? commaRule : [commaRule];
    const cVal = cOpts.length > 1 ? cOpts[1] : undefined;
    if (cVal === "always-multiline" || cVal === "always") {
      js.trailingCommas = "all";
    } else if (cVal === "never") {
      js.trailingCommas = "none";
    }
  }

  // Arrow parens
  const arrowRule = rules["arrow-parens"];
  if (arrowRule) {
    const aOpts = Array.isArray(arrowRule) ? arrowRule : [arrowRule];
    const aVal = aOpts.length > 1 ? aOpts[1] : undefined;
    if (aVal === "always") {
      js.arrowParentheses = "always";
    } else if (aVal === "as-needed") {
      js.arrowParentheses = "asNeeded";
    }
  }

  // Max line length
  const maxLenRule = rules["max-len"];
  if (maxLenRule) {
    const mOpts = Array.isArray(maxLenRule) ? maxLenRule : [maxLenRule];
    if (typeof mOpts[1] === "number") {
      formatter.lineWidth = mOpts[1];
    } else if (typeof mOpts[1] === "object" && mOpts[1] !== null && "code" in mOpts[1]) {
      formatter.lineWidth = (mOpts[1] as { code: number }).code;
    }
  }

  return { ...formatter, js: Object.keys(js).length > 0 ? js : undefined };
}

// ─── Severity conversion ────────────────────────────────────────────────────

function normalizeSeverity(sev: EslintSeverity | [EslintSeverity, ...unknown[]]): string {
  const raw = Array.isArray(sev) ? sev[0] : sev;
  if (raw === 0 || raw === "off") return "off";
  if (raw === 1 || raw === "warn") return "warn";
  return "error";
}

// ─── Core Conversion ────────────────────────────────────────────────────────

function convertConfig(input: string): ConversionResult {
  let config: EslintConfig;

  // Parse input — handle JSON or JS module.exports
  const trimmed = input.trim();
  if (trimmed.startsWith("{")) {
    // Try JSON (also handles JSONC with trailing commas)
    const cleaned = trimmed
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/,(\s*[}\]])/g, "$1");
    config = JSON.parse(cleaned);
  } else if (trimmed.startsWith("module.exports")) {
    // Extract object from module.exports = { ... }
    const match = trimmed.match(/module\.exports\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
    if (!match) throw new Error("Could not parse module.exports format");
    const cleaned = match[1]
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/,(\s*[}\]])/g, "$1")
      // Convert unquoted keys to quoted
      .replace(/(\{|,)\s*([a-zA-Z_$][\w$-]*)\s*:/g, '$1 "$2":')
      // Handle nested unquoted keys
      .replace(/(\{|,)\s*"([^"]+)"\s*:\s*\{/g, '$1 "$2": {');
    config = JSON.parse(cleaned);
  } else if (trimmed.startsWith("export default") || trimmed.startsWith("export const")) {
    // Flat config (ESLint 9+)
    throw new Error(
      "This appears to be an ESLint flat config (eslint.config.js). This tool converts legacy .eslintrc configs. Flat config support coming soon."
    );
  } else {
    throw new Error(
      "Unsupported format. Paste a .eslintrc.json file or a module.exports = {...} config."
    );
  }

  const warnings: ConversionWarning[] = [];
  const rules = config.rules || {};

  // Detect extends
  const extendsArr = config.extends
    ? Array.isArray(config.extends)
      ? config.extends
      : [config.extends]
    : [];

  if (extendsArr.some((e) => e.includes("prettier"))) {
    warnings.push({
      rule: "extends: prettier",
      reason:
        "Biome has a built-in formatter — you no longer need Prettier or eslint-config-prettier. Remove Prettier from your toolchain.",
      severity: "info",
    });
  }

  if (extendsArr.some((e) => e.includes("airbnb"))) {
    warnings.push({
      rule: "extends: airbnb",
      reason:
        "Biome's recommended rules cover many Airbnb rules. Some Airbnb-specific opinions (import order, naming conventions) are not available in Biome.",
      severity: "warning",
    });
  }

  if (extendsArr.some((e) => e.includes("standard"))) {
    warnings.push({
      rule: "extends: standard",
      reason:
        "eslint-config-standard mixes linting and formatting. Biome's linter + formatter covers most standard rules natively.",
      severity: "info",
    });
  }

  // Check plugins
  const plugins = config.plugins || [];
  if (plugins.includes("import") || plugins.includes("eslint-plugin-import")) {
    warnings.push({
      rule: "plugin: import",
      reason:
        "Biome has built-in import sorting (organizeImports) and some import rules. The full eslint-plugin-import rule set is not fully replicated.",
      severity: "warning",
    });
  }

  // Build Biome rules
  const biomeRules: Record<string, Record<string, string>> = {};
  let converted = 0;
  let unsupported = 0;

  for (const [eslintRule, severity] of Object.entries(rules)) {
    const normalizedSev = normalizeSeverity(severity);
    if (normalizedSev === "off") continue; // Skip disabled rules

    const mapping = RULE_MAP[eslintRule];
    if (mapping) {
      if (!biomeRules[mapping.biomeGroup]) {
        biomeRules[mapping.biomeGroup] = {};
      }
      biomeRules[mapping.biomeGroup][mapping.biomeName] = normalizedSev;
      converted++;
    } else if (UNSUPPORTED_RULES.has(eslintRule)) {
      warnings.push({
        rule: eslintRule,
        reason: `No Biome equivalent. This rule is not available in Biome.`,
        severity: "warning",
      });
      unsupported++;
    } else if (
      eslintRule.startsWith("@typescript-eslint/") ||
      eslintRule.startsWith("react/") ||
      eslintRule.startsWith("react-hooks/") ||
      eslintRule.startsWith("jsx-a11y/") ||
      eslintRule.startsWith("import/")
    ) {
      warnings.push({
        rule: eslintRule,
        reason: `Plugin rule not mapped. Check Biome docs for a potential equivalent.`,
        severity: "info",
      });
      unsupported++;
    } else if (
      !eslintRule.includes("/") &&
      !UNSUPPORTED_RULES.has(eslintRule) &&
      !RULE_MAP[eslintRule]
    ) {
      // Formatting rule or unknown
      if (
        [
          "indent", "semi", "quotes", "comma-dangle", "arrow-parens",
          "max-len", "no-trailing-spaces", "no-multiple-empty-lines",
          "eol-last", "comma-spacing", "key-spacing", "object-curly-spacing",
          "array-bracket-spacing", "space-before-function-paren",
          "space-before-blocks", "space-in-parens", "space-infix-ops",
          "keyword-spacing", "brace-style", "no-mixed-spaces-and-tabs",
          "jsx-quotes",
        ].includes(eslintRule)
      ) {
        // Handled by formatter, skip warning
      } else {
        warnings.push({
          rule: eslintRule,
          reason: `Unknown rule — no Biome mapping found.`,
          severity: "info",
        });
        unsupported++;
      }
    }
  }

  // Extract formatter options from ESLint formatting rules
  const formatterOpts = extractFormatterOptions(config);
  const hasFormatterOpts =
    formatterOpts.indentStyle ||
    formatterOpts.indentWidth ||
    formatterOpts.lineWidth ||
    formatterOpts.js;

  // Build biome.json
  const biomeJson: BiomeConfig = {
    $schema: "https://biomejs.dev/schemas/2.0.0/schema.json",
  };

  // Organize imports if import plugin was used
  if (plugins.includes("import") || plugins.includes("eslint-plugin-import")) {
    biomeJson.organizeImports = { enabled: true };
  }

  // Formatter section
  if (hasFormatterOpts) {
    biomeJson.formatter = { enabled: true };
    if (formatterOpts.indentStyle) biomeJson.formatter.indentStyle = formatterOpts.indentStyle;
    if (formatterOpts.indentWidth) biomeJson.formatter.indentWidth = formatterOpts.indentWidth;
    if (formatterOpts.lineWidth) biomeJson.formatter.lineWidth = formatterOpts.lineWidth;
  }

  // JS formatter section
  if (formatterOpts.js) {
    biomeJson.javascript = { formatter: formatterOpts.js };
  }

  // Linter section
  biomeJson.linter = {
    enabled: true,
    rules: {
      recommended: true,
      ...biomeRules,
    },
  };

  const totalRules = Object.keys(rules).filter(
    (r) => normalizeSeverity(rules[r]) !== "off"
  ).length;

  return {
    biomeJson,
    stats: {
      totalRules,
      converted,
      unsupported,
      warnings: warnings.length,
    },
    warnings,
  };
}

// ─── Sample configs ─────────────────────────────────────────────────────────

const SAMPLES: { name: string; config: string }[] = [
  {
    name: "React + TypeScript",
    config: JSON.stringify(
      {
        extends: [
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:react/recommended",
          "plugin:react-hooks/recommended",
          "prettier",
        ],
        plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
        rules: {
          "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
          "@typescript-eslint/no-explicit-any": "warn",
          "@typescript-eslint/consistent-type-imports": "error",
          "react/jsx-key": "error",
          "react-hooks/rules-of-hooks": "error",
          "react-hooks/exhaustive-deps": "warn",
          "no-console": "warn",
          "prefer-const": "error",
          "no-var": "error",
          semi: ["error", "always"],
          quotes: ["error", "single"],
          indent: ["error", 2],
          "comma-dangle": ["error", "always-multiline"],
        },
      },
      null,
      2
    ),
  },
  {
    name: "Node.js (Airbnb)",
    config: JSON.stringify(
      {
        extends: ["airbnb-base"],
        plugins: ["import"],
        env: { node: true, es2021: true },
        rules: {
          "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
          "no-console": "off",
          "prefer-const": "error",
          "no-var": "error",
          "no-param-reassign": "error",
          "no-underscore-dangle": "off",
          "import/no-duplicates": "error",
          semi: ["error", "always"],
          quotes: ["error", "double"],
          indent: ["error", 2],
          "max-len": ["error", { code: 100 }],
          "arrow-parens": ["error", "always"],
        },
      },
      null,
      2
    ),
  },
  {
    name: "Next.js Strict",
    config: JSON.stringify(
      {
        extends: ["next/core-web-vitals", "plugin:@typescript-eslint/strict"],
        plugins: ["@typescript-eslint"],
        rules: {
          "@typescript-eslint/no-unused-vars": "error",
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/no-non-null-assertion": "warn",
          "@typescript-eslint/consistent-type-imports": "error",
          "@typescript-eslint/ban-types": "warn",
          "react-hooks/exhaustive-deps": "error",
          "no-debugger": "error",
          "no-eval": "error",
          "prefer-const": "error",
          "no-var": "error",
          "no-fallthrough": "error",
          semi: ["error", "never"],
          quotes: ["error", "single"],
        },
      },
      null,
      2
    ),
  },
  {
    name: "Minimal Legacy",
    config: JSON.stringify(
      {
        extends: ["eslint:recommended"],
        env: { browser: true, es6: true },
        rules: {
          "no-unused-vars": "warn",
          "no-undef": "error",
          "no-debugger": "warn",
          "no-console": "warn",
          "no-empty": "warn",
          "no-extra-boolean-cast": "warn",
          eqeqeq: "error",
          curly: "error",
          semi: ["error", "always"],
          quotes: ["error", "double"],
        },
      },
      null,
      2
    ),
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function EslintToBiomeTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"output" | "warnings">("output");
  const [warningFilter, setWarningFilter] = useState<"all" | "warning" | "info" | "error">("all");

  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("eslint-to-biome");
  const { trackAction } = useToolAnalytics("eslint-to-biome");

  const handleConvert = useCallback(() => {
    if (isLimited || !input.trim()) return;
    recordUsage();
    trackAction("convert");
    setError("");
    setResult(null);
    try {
      const res = convertConfig(input);
      setResult(res);
      setActiveTab("output");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  const outputJson = useMemo(() => {
    if (!result) return "";
    return JSON.stringify(result.biomeJson, null, 2);
  }, [result]);

  const filteredWarnings = useMemo(() => {
    if (!result) return [];
    if (warningFilter === "all") return result.warnings;
    return result.warnings.filter((w) => w.severity === warningFilter);
  }, [result, warningFilter]);

  const handleCopy = useCallback(async () => {
    if (!outputJson) return;
    await navigator.clipboard.writeText(outputJson);
    trackAction("copy");
  }, [outputJson, trackAction]);

  const handleDownload = useCallback(() => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "biome.json";
    a.click();
    URL.revokeObjectURL(url);
    trackAction("download");
  }, [outputJson, trackAction]);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
    setError("");
  }, []);

  const handleSample = useCallback(
    (config: string) => {
      setInput(config);
      setResult(null);
      setError("");
    },
    []
  );

  const severityBadge = (sev: string) => {
    const colors: Record<string, string> = {
      error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };
    return (
      <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${colors[sev] || ""}`}>
        {sev}
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← Back to tools
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-100">
        ESLint to Biome Converter
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Convert your .eslintrc config to biome.json. Supports rule mapping for core
        ESLint, TypeScript, React, JSX-A11y, and import plugins. Extracts formatter
        settings from formatting rules.
      </p>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="self-center text-sm text-gray-500 dark:text-gray-400">Samples:</span>
        {SAMPLES.map((s) => (
          <button
            key={s.name}
            onClick={() => handleSample(s.config)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          ESLint Config (paste .eslintrc.json or module.exports)
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          placeholder='Paste your .eslintrc.json or module.exports = { ... } here'
          className="h-64 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          spellCheck={false}
        />
      </div>

      {/* Action buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={handleConvert}
          disabled={isLimited || !input.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Convert to Biome
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <span className="self-center text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter to convert
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Stats bar */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {result.stats.totalRules}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">ESLint Rules</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {result.stats.converted}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Converted</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {result.stats.unsupported}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unsupported</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {result.stats.warnings}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Warnings</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-3 flex gap-1 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === "output"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              biome.json Output
            </button>
            <button
              onClick={() => setActiveTab("warnings")}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === "warnings"
                  ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Warnings{" "}
              {result.warnings.length > 0 && (
                <span className="ml-1 rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {result.warnings.length}
                </span>
              )}
            </button>
          </div>

          {/* Output tab */}
          {activeTab === "output" && (
            <div className="relative">
              <div className="mb-2 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Download biome.json
                </button>
              </div>
              <pre className="overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                {outputJson}
              </pre>
            </div>
          )}

          {/* Warnings tab */}
          {activeTab === "warnings" && (
            <div>
              {result.warnings.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No warnings. All rules were successfully converted.
                </p>
              ) : (
                <>
                  <div className="mb-3 flex gap-2">
                    {(["all", "error", "warning", "info"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setWarningFilter(f)}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                          warningFilter === f
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === "all" ? ` (${result.warnings.length})` : ""}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {filteredWarnings.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        {severityBadge(w.severity)}
                        <div className="min-w-0 flex-1">
                          <code className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {w.rule}
                          </code>
                          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                            {w.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Migration tips */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              Migration Steps
            </h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                Save the output above as <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">biome.json</code> in your project root
              </li>
              <li>
                Install Biome:{" "}
                <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">npm install --save-dev --save-exact @biomejs/biome</code>
              </li>
              <li>
                Run the linter:{" "}
                <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">npx biome check --write .</code>
              </li>
              <li>
                Remove ESLint:{" "}
                <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">npm uninstall eslint eslint-config-prettier @typescript-eslint/eslint-plugin</code>
              </li>
              <li>
                Delete <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">.eslintrc.*</code>{" "}
                and <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">.prettierrc</code>
              </li>
              <li>Update your CI scripts and editor extensions</li>
            </ol>
          </div>
        </>
      )}

      {/* Rule mapping reference */}
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Supported Rule Mappings
        </h2>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          This tool maps {Object.keys(RULE_MAP).length} ESLint rules to their Biome equivalents across
          core, TypeScript, React, JSX-A11y, and import plugins.
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">Rules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(
                Object.entries(RULE_MAP).reduce(
                  (acc, [_eslint, { biomeGroup }]) => {
                    acc[biomeGroup] = (acc[biomeGroup] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              )
                .sort((a, b) => b[1] - a[1])
                .map(([group, count]) => (
                  <tr key={group} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-2 font-mono text-xs text-gray-900 dark:text-gray-100">
                      {group}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{count} rules</td>
                  </tr>
                ))}
              <tr className="bg-gray-50 font-medium dark:bg-gray-800">
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">Total</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {Object.keys(RULE_MAP).length} rules
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
