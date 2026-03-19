import type { Metadata } from "next";
import CodeSecurityScannerTool from "./CodeSecurityScannerTool";

export const metadata: Metadata = {
  title:
    "AI Code Security Scanner — Find Vulnerabilities in AI-Generated Code",
  description:
    "Scan JavaScript and TypeScript code for security vulnerabilities. Detects hardcoded secrets, SQL injection, XSS, SSRF, command injection, prototype pollution, and more. Free, client-side — your code never leaves your browser.",
  keywords: [
    "code security scanner",
    "ai code security",
    "vibe coding security",
    "javascript security scanner",
    "typescript security scanner",
    "find vulnerabilities in code",
    "code vulnerability scanner",
    "sast tool online",
    "xss scanner",
    "sql injection scanner",
    "hardcoded secrets scanner",
    "ai generated code review",
    "code security audit",
  ],
  alternates: {
    canonical: "/tools/code-security-scanner",
  },
  openGraph: {
    title: "AI Code Security Scanner - DevBolt",
    description:
      "Scan code for security vulnerabilities — secrets, injection, XSS, SSRF, and more. Free, client-side, no signup.",
    url: "/tools/code-security-scanner",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Code Security Scanner",
  url: "https://devbolt.dev/tools/code-security-scanner",
  description:
    "Scan JavaScript and TypeScript code for security vulnerabilities including hardcoded secrets, SQL injection, XSS, SSRF, command injection, prototype pollution, and insecure patterns.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: {
    "@type": "Organization",
    name: "DevBolt",
    url: "https://devbolt.dev",
  },
};

export default function CodeSecurityScannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeSecurityScannerTool />
    </>
  );
}
