"use client";

import { useState, useCallback, useMemo } from "react";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Types ──────────────────────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium" | "low";

interface Finding {
  id: string;
  severity: Severity;
  cwe: string;
  title: string;
  description: string;
  line: number;
  column?: number;
  snippet: string;
  fix: string;
  category: string;
}

interface ScanResult {
  findings: Finding[];
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    linesScanned: number;
  };
  grade: string;
}

interface SecurityRule {
  id: string;
  severity: Severity;
  cwe: string;
  title: string;
  category: string;
  description: string;
  fix: string;
  pattern: RegExp;
  lineMatch?: boolean;
  // false positive filter — if matched, skip the finding
  falsePositivePattern?: RegExp;
}

// ─── Security Rules ─────────────────────────────────────────────────────────

const SECURITY_RULES: SecurityRule[] = [
  // ── Critical ──────────────────────────────────────────────────────────────
  {
    id: "hardcoded-secret",
    severity: "critical",
    cwe: "CWE-798",
    title: "Hardcoded Secret or API Key",
    category: "Secrets",
    description:
      "API keys, passwords, or tokens are hardcoded in the source code. These can be extracted by anyone with access to the code and used to compromise your systems.",
    fix: "Move secrets to environment variables (process.env.API_KEY) or a secrets manager. Never commit credentials to source control.",
    pattern:
      /(?:api[_-]?key|apikey|secret[_-]?key|password|passwd|token|auth[_-]?token|access[_-]?token|private[_-]?key|client[_-]?secret)\s*[:=]\s*['"`](?!process\.env|import\.meta\.env|<|{|\$\{|%%|{{)[A-Za-z0-9_\-/.+=]{8,}/i,
    lineMatch: true,
  },
  {
    id: "hardcoded-aws-key",
    severity: "critical",
    cwe: "CWE-798",
    title: "AWS Access Key ID Detected",
    category: "Secrets",
    description:
      "An AWS access key ID pattern was found hardcoded in the source code. AWS keys grant access to cloud infrastructure and can lead to full account compromise.",
    fix: "Use AWS IAM roles, environment variables, or the AWS SDK credential provider chain. Never hardcode AWS keys.",
    pattern: /['"`]AKIA[0-9A-Z]{16}['"`]/,
    lineMatch: true,
  },
  {
    id: "eval-usage",
    severity: "critical",
    cwe: "CWE-95",
    title: "Use of eval() or Function Constructor",
    category: "Injection",
    description:
      "eval() and new Function() execute arbitrary code at runtime. If any part of the input is user-controlled, this enables remote code execution (RCE).",
    fix: "Replace eval() with JSON.parse() for data, a proper expression parser for math, or refactor to avoid dynamic code execution entirely.",
    pattern: /\b(?:eval|new\s+Function)\s*\(/,
    lineMatch: true,
    falsePositivePattern: /\/\/.*\b(?:eval|new\s+Function)\s*\(/,
  },
  {
    id: "sql-injection",
    severity: "critical",
    cwe: "CWE-89",
    title: "Potential SQL Injection",
    category: "Injection",
    description:
      "SQL query built using string concatenation or template literals with variables. If any variable contains user input, this enables SQL injection attacks.",
    fix: "Use parameterized queries (prepared statements) with placeholders ($1, ?, :param). For ORMs, use the query builder's built-in sanitization.",
    pattern:
      /(?:query|exec|execute|raw|prepare)\s*\(\s*(?:`[^`]*\$\{|['"][^'"]*['"]\s*\+\s*(?!['"]))/,
    lineMatch: true,
  },
  {
    id: "command-injection",
    severity: "critical",
    cwe: "CWE-78",
    title: "Potential Command Injection",
    category: "Injection",
    description:
      "Shell commands built with string concatenation or template literals. If user input reaches the command string, an attacker can execute arbitrary OS commands.",
    fix: "Use execFile() or spawn() with an args array instead of exec(). Never pass user input through a shell. Use a library like shell-quote for escaping if a shell is unavoidable.",
    pattern:
      /\b(?:exec|execSync|spawn|spawnSync|system)\s*\(\s*(?:`[^`]*\$\{|['"][^'"]*['"]\s*\+)/,
    lineMatch: true,
  },

  // ── High ──────────────────────────────────────────────────────────────────
  {
    id: "xss-innerhtml",
    severity: "high",
    cwe: "CWE-79",
    title: "XSS via innerHTML or outerHTML",
    category: "XSS",
    description:
      "Setting innerHTML or outerHTML with dynamic content enables cross-site scripting (XSS). An attacker can inject script tags or event handlers to steal cookies, session tokens, or perform actions as the user.",
    fix: "Use textContent for plain text, or a sanitization library (DOMPurify) if HTML is needed. In React, avoid dangerouslySetInnerHTML.",
    pattern: /\.(?:innerHTML|outerHTML)\s*[=+](?!=)/,
    lineMatch: true,
  },
  {
    id: "xss-dangerously",
    severity: "high",
    cwe: "CWE-79",
    title: "XSS via dangerouslySetInnerHTML",
    category: "XSS",
    description:
      "dangerouslySetInnerHTML renders raw HTML in React components. If the HTML source includes any user-controlled input, this creates an XSS vulnerability.",
    fix: "Use DOMPurify.sanitize() on the HTML before passing it, or render content as text with JSX expressions. Only use dangerouslySetInnerHTML with trusted, server-generated HTML.",
    pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html\s*:/,
    lineMatch: true,
  },
  {
    id: "ssrf-fetch",
    severity: "high",
    cwe: "CWE-918",
    title: "Potential SSRF — User-Controlled URL in Request",
    category: "SSRF",
    description:
      "A URL constructed from a variable is passed to fetch(), axios, or an HTTP client. If the URL is user-controlled, an attacker can make your server request internal services, cloud metadata endpoints (169.254.169.254), or other internal resources.",
    fix: "Validate and allowlist destination URLs. Block requests to internal IP ranges (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x). Use a URL parser to verify the hostname against an allowlist.",
    pattern:
      /\b(?:fetch|axios\.(?:get|post|put|patch|delete)|got|request|http\.(?:get|request)|urllib\.request)\s*\(\s*(?:[a-zA-Z_$][\w$.]*(?:\[|\.)|`[^`]*\$\{)/,
    lineMatch: true,
  },
  {
    id: "path-traversal",
    severity: "high",
    cwe: "CWE-22",
    title: "Potential Path Traversal",
    category: "Path Traversal",
    description:
      "A file path constructed from a variable is passed to a filesystem function. If the path includes user input, an attacker can read or write arbitrary files using ../ sequences.",
    fix: "Use path.resolve() and verify the resulting path starts with the expected base directory. Reject paths containing '..' segments. Use a chroot or containerized filesystem.",
    pattern:
      /\b(?:readFile|readFileSync|writeFile|writeFileSync|createReadStream|createWriteStream|unlink|unlinkSync|readdir|readdirSync|stat|statSync|access|accessSync|open|openSync|appendFile|appendFileSync)\s*\(\s*(?:[a-zA-Z_$][\w$.]*(?:\[|\.)|`[^`]*\$\{|['"][^'"]*['"]\s*\+)/,
    lineMatch: true,
  },
  {
    id: "prototype-pollution",
    severity: "high",
    cwe: "CWE-1321",
    title: "Potential Prototype Pollution",
    category: "Injection",
    description:
      "Dynamic property assignment using bracket notation with user-controlled keys can modify Object.prototype, affecting all objects in the application. This can bypass authentication, cause denial of service, or enable RCE.",
    fix: "Use Object.create(null) for lookup maps, validate keys against an allowlist, use Map instead of plain objects, or freeze prototypes with Object.freeze(Object.prototype).",
    pattern:
      /\w+\s*\[\s*(?:[a-zA-Z_$][\w$.]*)\s*\]\s*\[\s*(?:[a-zA-Z_$][\w$.]*)\s*\]\s*=/,
    lineMatch: true,
  },
  {
    id: "insecure-random",
    severity: "high",
    cwe: "CWE-330",
    title: "Insecure Randomness for Security Context",
    category: "Cryptography",
    description:
      "Math.random() is not cryptographically secure. Using it to generate tokens, keys, passwords, or session IDs makes them predictable and brute-forceable.",
    fix: "Use crypto.getRandomValues() (browser) or crypto.randomBytes() / crypto.randomUUID() (Node.js) for security-sensitive random values.",
    pattern:
      /Math\.random\s*\(\s*\)/,
    lineMatch: true,
  },
  {
    id: "nosql-injection",
    severity: "high",
    cwe: "CWE-943",
    title: "Potential NoSQL Injection",
    category: "Injection",
    description:
      "MongoDB query operators ($gt, $ne, $regex, etc.) in user-controlled input can modify query logic, bypassing authentication or extracting data. This happens when request body objects are passed directly to MongoDB queries.",
    fix: "Validate and sanitize input types before passing to queries. Use mongo-sanitize or explicitly cast values. Never pass raw req.body to find() or update().",
    pattern:
      /\.(?:find|findOne|updateOne|updateMany|deleteOne|deleteMany|aggregate|countDocuments)\s*\(\s*(?:req\.body|req\.query|req\.params|request\.body)/,
    lineMatch: true,
  },

  // ── Medium ────────────────────────────────────────────────────────────────
  {
    id: "insecure-cookie",
    severity: "medium",
    cwe: "CWE-614",
    title: "Cookie Without Secure or HttpOnly Flag",
    category: "Session",
    description:
      "Cookies set without the Secure flag can be transmitted over HTTP (not HTTPS). Without HttpOnly, cookies are accessible to JavaScript, enabling XSS-based session theft.",
    fix: "Set cookies with {secure: true, httpOnly: true, sameSite: 'strict'} flags. Use a session library that sets these by default.",
    pattern:
      /(?:set-cookie|setCookie|cookie\s*=|res\.cookie)\s*\([^)]*(?:secure\s*:\s*false|httpOnly\s*:\s*false)/i,
    lineMatch: true,
  },
  {
    id: "cors-wildcard",
    severity: "medium",
    cwe: "CWE-942",
    title: "Permissive CORS Configuration",
    category: "Configuration",
    description:
      "Access-Control-Allow-Origin set to '*' or reflecting the Origin header allows any website to make authenticated requests to your API, potentially leaking data.",
    fix: "Specify an explicit allowlist of trusted origins. Never use '*' with credentials. Validate the Origin header against your allowlist.",
    pattern:
      /(?:Access-Control-Allow-Origin|allowedOrigins?|cors.*origin)\s*[:=]\s*['"`]\*['"`]/i,
    lineMatch: true,
  },
  {
    id: "hardcoded-ip",
    severity: "medium",
    cwe: "CWE-798",
    title: "Hardcoded IP Address or Internal URL",
    category: "Configuration",
    description:
      "Hardcoded IP addresses or internal URLs in source code can expose internal infrastructure details and make configuration changes difficult.",
    fix: "Move URLs and IPs to environment variables or a configuration file. Use service discovery for internal services.",
    pattern:
      /['"`]https?:\/\/(?:10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.|127\.0\.0\.1|localhost:\d{4,5})\//,
    lineMatch: true,
  },
  {
    id: "insecure-hash",
    severity: "medium",
    cwe: "CWE-328",
    title: "Weak Hashing Algorithm (MD5 or SHA-1)",
    category: "Cryptography",
    description:
      "MD5 and SHA-1 have known collision attacks and should not be used for security purposes (passwords, signatures, integrity of sensitive data).",
    fix: "Use SHA-256 or SHA-512 for integrity checks. Use bcrypt, scrypt, or Argon2 for password hashing. Never use MD5/SHA-1 for security.",
    pattern:
      /\b(?:createHash|crypto\.(?:subtle\.)?digest)\s*\(\s*['"`](?:md5|sha-?1)['"`]/i,
    lineMatch: true,
  },
  {
    id: "jwt-no-verify",
    severity: "medium",
    cwe: "CWE-345",
    title: "JWT Decoded Without Signature Verification",
    category: "Authentication",
    description:
      "JWT token is decoded without verifying the signature. An attacker can forge tokens with arbitrary claims, bypassing authentication entirely.",
    fix: "Always use jwt.verify() instead of jwt.decode(). Verify the signature, expiration (exp), issuer (iss), and audience (aud) claims.",
    pattern: /jwt\.decode\s*\(/,
    lineMatch: true,
    falsePositivePattern: /jwt\.verify\s*\(/,
  },
  {
    id: "unvalidated-redirect",
    severity: "medium",
    cwe: "CWE-601",
    title: "Potential Open Redirect",
    category: "Redirect",
    description:
      "Redirecting to a URL from user input (query parameter, form field) can send users to malicious sites that mimic your login page, enabling phishing attacks.",
    fix: "Validate redirect URLs against an allowlist of trusted destinations. Only allow relative paths or specific domains. Never redirect to an arbitrary user-supplied URL.",
    pattern:
      /(?:res\.redirect|location\.href|window\.location|navigate)\s*(?:\(|=)\s*(?:req\.query|req\.params|searchParams|params)/,
    lineMatch: true,
  },
  {
    id: "missing-rate-limit",
    severity: "medium",
    cwe: "CWE-770",
    title: "Authentication Endpoint Without Rate Limiting",
    category: "Authentication",
    description:
      "Login, registration, or password reset endpoints without rate limiting are vulnerable to brute force attacks and credential stuffing.",
    fix: "Add rate limiting middleware (express-rate-limit, @nestjs/throttler) to authentication endpoints. Implement account lockout after repeated failures.",
    pattern:
      /(?:\/login|\/signin|\/auth|\/register|\/signup|\/forgot-password|\/reset-password)['"`]\s*,\s*(?:async\s+)?(?:\(|function)/,
    lineMatch: true,
  },
  {
    id: "document-write",
    severity: "medium",
    cwe: "CWE-79",
    title: "Use of document.write()",
    category: "XSS",
    description:
      "document.write() can inject arbitrary HTML into the page. If any part of the argument is user-controlled, this enables XSS.",
    fix: "Use DOM APIs like createElement(), textContent, or a framework's rendering system instead of document.write().",
    pattern: /document\.write(?:ln)?\s*\(/,
    lineMatch: true,
  },

  // ── Low ───────────────────────────────────────────────────────────────────
  {
    id: "console-log-sensitive",
    severity: "low",
    cwe: "CWE-532",
    title: "Potential Sensitive Data in Console Log",
    category: "Information Exposure",
    description:
      "Logging variables named password, token, secret, key, or credential can expose sensitive data in browser consoles, server logs, or log aggregation services.",
    fix: "Remove console.log statements containing sensitive data before deploying. Use a logger with log levels and redaction for production.",
    pattern:
      /console\.(?:log|info|debug|warn|error)\s*\([^)]*(?:password|token|secret|key|credential|apiKey|auth)/i,
    lineMatch: true,
  },
  {
    id: "todo-security",
    severity: "low",
    cwe: "CWE-546",
    title: "Security-Related TODO or FIXME Comment",
    category: "Code Quality",
    description:
      "A TODO or FIXME comment references a security concern that has not been addressed. These are common in AI-generated code that acknowledges but defers security fixes.",
    fix: "Address the security concern described in the comment before deploying. AI-generated code often adds TODOs for security items it cannot implement inline.",
    pattern:
      /\/\/\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*(?:security|auth|sanitiz|validat|escap|inject|xss|csrf|cors|encrypt|hash|password|token|secret|vulnerable|unsafe)/i,
    lineMatch: true,
  },
  {
    id: "disable-eslint-security",
    severity: "low",
    cwe: "CWE-710",
    title: "Disabled Security Lint Rule",
    category: "Code Quality",
    description:
      "An eslint-disable comment suppresses a security-related rule. This may hide real vulnerabilities that the linter would otherwise catch.",
    fix: "Fix the underlying security issue instead of disabling the rule. If the disable is justified, add a comment explaining why.",
    pattern:
      /\/[/*]\s*eslint-disable(?:-next-line)?\s+.*(?:security|no-eval|no-implied-eval|no-script-url|detect-)/,
    lineMatch: true,
  },
  {
    id: "http-link",
    severity: "low",
    cwe: "CWE-319",
    title: "HTTP URL Instead of HTTPS",
    category: "Configuration",
    description:
      "An HTTP (not HTTPS) URL is used for what appears to be an API endpoint or external resource. Data transmitted over HTTP is unencrypted and can be intercepted.",
    fix: "Use HTTPS for all external API calls, CDN resources, and third-party services. HTTP should only be used for local development.",
    pattern:
      /['"`]http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0|10\.|172\.|192\.168)/,
    lineMatch: true,
  },
];

// ─── Sample Code ────────────────────────────────────────────────────────────

const SAMPLES: { name: string; code: string }[] = [
  {
    name: "Vulnerable API Handler",
    code: `import express from 'express';
import { exec } from 'child_process';
import jwt from 'jsonwebtoken';

const app = express();
const API_KEY = "sk_live_EXAMPLE_KEY_REPLACE_ME_1234";
const DB_PASSWORD = "admin123!";

// Login endpoint — no rate limiting
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // SQL injection — string concatenation in query
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  const user = await db.query(query);

  if (user) {
    // Insecure random token generation
    const token = Math.random().toString(36).substring(2);
    res.cookie('session', token); // Missing secure/httpOnly flags
    res.json({ token });
  }
});

// Command injection — user input in exec()
app.get('/ping', (req, res) => {
  exec(\`ping -c 4 \${req.query.host}\`, (err, stdout) => {
    res.send(stdout);
  });
});

// XSS — innerHTML with user data
app.get('/profile', (req, res) => {
  const html = \`<div>\${req.query.name}</div>\`;
  document.getElementById('name').innerHTML = html;
});

// Open redirect
app.get('/redirect', (req, res) => {
  res.redirect(req.query.url);
});

// JWT decoded without verification
app.get('/me', (req, res) => {
  const decoded = jwt.decode(req.headers.authorization);
  res.json(decoded);
});

// TODO: add CSRF protection before launch
console.log("Server started with token:", API_KEY);`,
  },
  {
    name: "Insecure React Component",
    code: `import React, { useEffect, useState } from 'react';

const API_SECRET = "ghp_EXAMPLE_TOKEN_REPLACE_ME_12345678";

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // SSRF — user-controlled URL
    fetch(\`http://api.example.com/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  // XSS via dangerouslySetInnerHTML
  return (
    <div>
      <h1>{user?.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: user?.bio }} />
      <script>{document.write(user?.script)}</script>
    </div>
  );
}

// Prototype pollution
function mergeConfig(target, source) {
  for (const key in source) {
    target[key][source[key]] = source[key];
  }
}

// Weak hash for password
const crypto = require('crypto');
const hash = crypto.createHash('md5').update(password).digest('hex');

// eslint-disable-next-line security/detect-object-injection
const value = obj[userInput];`,
  },
  {
    name: "Clean Secure Code",
    code: `import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const app = express();

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts',
});

app.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Parameterized query — safe from SQL injection
  const user = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    // Cryptographically secure token
    const sessionId = randomUUID();
    res.cookie('session', sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600000,
    });

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  }
});

// Safe — verify JWT before trusting claims
app.get('/me', (req, res) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    res.json(decoded);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});`,
  },
  {
    name: "AI-Generated CRUD (Common Issues)",
    code: `// Generated by AI assistant — review before deploying

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DB_URI = "mongodb://admin:password123@prod-db.company.com:27017/myapp";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: 'user' },
});

// NoSQL injection — passing req.body directly to find()
app.get('/users', async (req, res) => {
  const users = await User.find(req.body);
  res.json(users);
});

// Mass assignment — user can set role: 'admin'
app.post('/register', async (req, res) => {
  const user = new User(req.body);
  // TODO: validate input and sanitize before saving
  await user.save();
  res.json(user);
});

// FIXME: security — need to add authentication middleware
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Path traversal — user input in file path
const fs = require('fs');
app.get('/files/:name', (req, res) => {
  fs.readFileSync('./uploads/' + req.params.name);
});

// CORS wildcard with credentials
app.use(cors({ origin: '*', credentials: true }));

// Logging secrets
console.log("Connected with password:", DB_URI);`,
  },
];

// ─── Scan Engine ────────────────────────────────────────────────────────────

function scanCode(code: string): ScanResult {
  const lines = code.split("\n");
  const findings: Finding[] = [];
  let nextId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const rule of SECURITY_RULES) {
      if (!rule.lineMatch) continue;

      if (rule.pattern.test(line)) {
        // Check false positive filter
        if (rule.falsePositivePattern && rule.falsePositivePattern.test(line)) {
          continue;
        }

        // Avoid duplicate findings of same rule on same line
        if (
          findings.some((f) => f.id.startsWith(rule.id) && f.line === lineNum)
        ) {
          continue;
        }

        findings.push({
          id: `${rule.id}-${nextId++}`,
          severity: rule.severity,
          cwe: rule.cwe,
          title: rule.title,
          description: rule.description,
          line: lineNum,
          snippet: line.trim(),
          fix: rule.fix,
          category: rule.category,
        });
      }
    }
  }

  // Sort by severity, then line number
  const severityOrder: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  findings.sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] ||
      a.line - b.line,
  );

  const stats = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    total: findings.length,
    linesScanned: lines.length,
  };

  let grade = "A";
  if (stats.critical > 0) grade = "F";
  else if (stats.high >= 3) grade = "D";
  else if (stats.high > 0) grade = "C";
  else if (stats.medium >= 3) grade = "C";
  else if (stats.medium > 0) grade = "B";
  else if (stats.low > 2) grade = "B";

  return { findings, stats, grade };
}

// ─── Severity Styles ────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<
  Severity,
  { bg: string; text: string; border: string; dot: string }
> = {
  critical: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  medium: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    dot: "bg-yellow-500",
  },
  low: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
  },
};

const GRADE_STYLES: Record<string, string> = {
  A: "text-emerald-600 dark:text-emerald-400",
  B: "text-lime-600 dark:text-lime-400",
  C: "text-yellow-600 dark:text-yellow-400",
  D: "text-orange-600 dark:text-orange-400",
  F: "text-red-600 dark:text-red-400",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function CodeSecurityScannerTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedFindings, setExpandedFindings] = useState<Set<string>>(
    new Set(),
  );

  const { trackAction } = useToolAnalytics("code-security-scanner");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit("code-security-scanner");

  const handleScan = useCallback(() => {
    if (!input.trim() || isLimited) return;
    recordUsage();
    trackAction("scan");
    const scanResult = scanCode(input);
    setResult(scanResult);
    // Auto-expand critical and high findings
    const autoExpand = new Set<string>();
    for (const f of scanResult.findings) {
      if (f.severity === "critical" || f.severity === "high") {
        autoExpand.add(f.id);
      }
    }
    setExpandedFindings(autoExpand);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleScan, { ctrl: true });

  const toggleFinding = useCallback((id: string) => {
    setExpandedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredFindings = useMemo(() => {
    if (!result) return [];
    return result.findings.filter((f) => {
      if (severityFilter !== "all" && f.severity !== severityFilter)
        return false;
      if (categoryFilter !== "all" && f.category !== categoryFilter)
        return false;
      return true;
    });
  }, [result, severityFilter, categoryFilter]);

  const categories = useMemo(() => {
    if (!result) return [];
    const cats = new Set(result.findings.map((f) => f.category));
    return Array.from(cats).sort();
  }, [result]);

  const handleSample = useCallback(
    (sample: (typeof SAMPLES)[0]) => {
      setInput(sample.code);
      setResult(null);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
    setSeverityFilter("all");
    setCategoryFilter("all");
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI Code Security Scanner
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Paste JavaScript or TypeScript code and scan for common security
          vulnerabilities. Detects hardcoded secrets, injection flaws, XSS,
          SSRF, prototype pollution, and more.{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            100% client-side — your code never leaves your browser.
          </span>
        </p>
      </div>

      <RateLimitBanner isLimited={isLimited} remaining={remaining} dailyLimit={dailyLimit} />

      {/* Sample buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.name}
            onClick={() => handleSample(s)}
            className="rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JavaScript or TypeScript code here..."
          rows={14}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={handleScan}
          disabled={!input.trim() || isLimited}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Scan for Vulnerabilities
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter to scan
        </span>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary card */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Scan Results
              </h2>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Security Grade
                </div>
                <div
                  className={`text-4xl font-black ${GRADE_STYLES[result.grade] || ""}`}
                >
                  {result.grade}
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.stats.critical}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">
                  Critical
                </div>
              </div>
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 p-3 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {result.stats.high}
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  High
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {result.stats.medium}
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  Medium
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.stats.low}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Low
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {result.stats.linesScanned}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Lines
                </div>
              </div>
            </div>

            {/* No issues message */}
            {result.stats.total === 0 && (
              <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 text-center">
                <div className="text-emerald-700 dark:text-emerald-300 font-semibold">
                  No vulnerabilities detected
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  This code passed all {SECURITY_RULES.length} security checks.
                  Note: this scanner uses pattern matching and may not catch all
                  vulnerabilities. Always perform manual code review for
                  security-critical applications.
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          {result.stats.total > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Filter:
              </span>
              <div className="flex gap-1.5">
                {(
                  ["all", "critical", "high", "medium", "low"] as const
                ).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      severityFilter === sev
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                    {sev !== "all" &&
                      ` (${result.stats[sev]})`}
                  </button>
                ))}
              </div>
              {categories.length > 1 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300"
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                {filteredFindings.length} of {result.stats.total} findings
              </span>
            </div>
          )}

          {/* Findings list */}
          {filteredFindings.length > 0 && (
            <div className="space-y-3">
              {filteredFindings.map((finding) => {
                const style = SEVERITY_STYLES[finding.severity];
                const isExpanded = expandedFindings.has(finding.id);

                return (
                  <div
                    key={finding.id}
                    className={`rounded-lg border ${style.border} overflow-hidden`}
                  >
                    {/* Header — always visible */}
                    <button
                      onClick={() => toggleFinding(finding.id)}
                      className={`w-full flex items-start gap-3 p-4 text-left ${style.bg} hover:opacity-90 transition-opacity`}
                    >
                      <span
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-semibold ${style.text}`}
                          >
                            {finding.title}
                          </span>
                          <span className="rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] font-mono text-gray-600 dark:text-gray-400">
                            {finding.cwe}
                          </span>
                          <span className="rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] text-gray-600 dark:text-gray-400">
                            {finding.category}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Line {finding.line}
                          </span>
                        </div>
                        <code className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {finding.snippet}
                        </code>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500 flex-shrink-0 text-sm">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Details — expanded */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-white dark:bg-gray-900">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            What&apos;s wrong
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {finding.description}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            How to fix
                          </div>
                          <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                            {finding.fix}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Code (Line {finding.line})
                          </div>
                          <pre className="rounded-md bg-gray-100 dark:bg-gray-800 p-3 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                            {finding.snippet}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CWE Reference */}
          {result.stats.total > 0 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                CWE References
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(result.findings.map((f) => f.cwe)))
                  .sort()
                  .map((cwe) => (
                    <a
                      key={cwe}
                      href={`https://cwe.mitre.org/data/definitions/${cwe.replace("CWE-", "")}.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      {cwe} ↗
                    </a>
                  ))}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                This scanner checks for {SECURITY_RULES.length} vulnerability
                patterns using regex-based static analysis. It catches common
                issues but is not a substitute for a full SAST tool (Semgrep,
                CodeQL, Snyk) or manual security review.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
