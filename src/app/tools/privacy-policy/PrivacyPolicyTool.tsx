"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// --- Types ---

interface PolicyConfig {
  siteName: string;
  siteUrl: string;
  companyName: string;
  contactEmail: string;
  effectiveDate: string;
  // Data collection
  collectsPersonalInfo: boolean;
  collectsUsageData: boolean;
  collectsLocationData: boolean;
  collectsPaymentInfo: boolean;
  usesCookies: boolean;
  usesAnalytics: boolean;
  // Third-party services
  thirdPartyAnalytics: string;
  thirdPartyPayment: string;
  thirdPartyAds: boolean;
  thirdPartySocialLogin: boolean;
  // Compliance
  gdpr: boolean;
  ccpa: boolean;
  coppa: boolean;
  // Additional
  dataRetention: string;
  allowsAccountDeletion: boolean;
  hasNewsletterSignup: boolean;
}

const DEFAULTS: PolicyConfig = {
  siteName: "",
  siteUrl: "",
  companyName: "",
  contactEmail: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  collectsPersonalInfo: true,
  collectsUsageData: true,
  collectsLocationData: false,
  collectsPaymentInfo: false,
  usesCookies: true,
  usesAnalytics: true,
  thirdPartyAnalytics: "Google Analytics",
  thirdPartyPayment: "",
  thirdPartyAds: false,
  thirdPartySocialLogin: false,
  gdpr: true,
  ccpa: true,
  coppa: false,
  dataRetention: "24 months",
  allowsAccountDeletion: true,
  hasNewsletterSignup: false,
};

const ANALYTICS_OPTIONS = [
  "Google Analytics",
  "Plausible",
  "Fathom",
  "Matomo",
  "Mixpanel",
  "Vercel Analytics",
  "PostHog",
  "None",
];

const PAYMENT_OPTIONS = [
  "",
  "Stripe",
  "PayPal",
  "Square",
  "Braintree",
  "Paddle",
  "Lemon Squeezy",
];

const RETENTION_OPTIONS = [
  "6 months",
  "12 months",
  "24 months",
  "36 months",
  "Until account deletion",
  "As required by law",
];

// --- Policy generator ---

function generatePolicy(c: PolicyConfig): string {
  const name = c.siteName || "[Your Website]";
  const company = c.companyName || name;
  const url = c.siteUrl || "[your-website-url]";
  const email = c.contactEmail || "[your-email@example.com]";
  const date = c.effectiveDate || "[Date]";

  const sections: string[] = [];

  // Title
  sections.push(`Privacy Policy for ${name}`);
  sections.push(`${"=".repeat(40)}`);
  sections.push(`Effective Date: ${date}\n`);

  // Introduction
  sections.push(`1. Introduction`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(
    `${company} ("we", "us", or "our") operates ${url} (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully. By using the Service, you agree to the collection and use of information in accordance with this policy.\n`
  );

  // Information We Collect
  sections.push(`2. Information We Collect`);
  sections.push(`${"─".repeat(40)}`);

  if (c.collectsPersonalInfo) {
    sections.push(`Personal Information:`);
    sections.push(
      `We may collect personally identifiable information that you voluntarily provide when using our Service, including but not limited to:`
    );
    sections.push(`  - Name and email address`);
    if (c.hasNewsletterSignup) {
      sections.push(
        `  - Email address provided for newsletter subscriptions`
      );
    }
    if (c.collectsPaymentInfo) {
      sections.push(
        `  - Billing address and payment information (processed securely by our payment provider)`
      );
    }
    sections.push("");
  }

  if (c.collectsUsageData) {
    sections.push(`Usage Data:`);
    sections.push(
      `We automatically collect certain information when you access our Service, including:`
    );
    sections.push(`  - IP address and browser type`);
    sections.push(`  - Pages visited and time spent on pages`);
    sections.push(`  - Referring website addresses`);
    sections.push(`  - Device type and operating system`);
    sections.push("");
  }

  if (c.collectsLocationData) {
    sections.push(`Location Data:`);
    sections.push(
      `We may collect approximate location information based on your IP address. We do not collect precise GPS location without your explicit consent.\n`
    );
  }

  // Cookies
  if (c.usesCookies) {
    sections.push(`3. Cookies and Tracking Technologies`);
    sections.push(`${"─".repeat(40)}`);
    sections.push(
      `We use cookies and similar tracking technologies to monitor activity on our Service and store certain information. Cookies are small data files placed on your device.\n`
    );
    sections.push(`Types of cookies we use:`);
    sections.push(
      `  - Essential Cookies: Required for the Service to function properly.`
    );
    if (c.usesAnalytics) {
      sections.push(
        `  - Analytics Cookies: Help us understand how visitors interact with our Service.`
      );
    }
    if (c.thirdPartyAds) {
      sections.push(
        `  - Advertising Cookies: Used to deliver relevant advertisements.`
      );
    }
    sections.push(
      `\nYou can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some parts of the Service may not function properly without cookies.\n`
    );
  }

  // How We Use Information
  const useSection = c.usesCookies ? 4 : 3;
  sections.push(`${useSection}. How We Use Your Information`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(`We use the collected information for the following purposes:`);
  sections.push(`  - To provide, operate, and maintain our Service`);
  sections.push(`  - To improve, personalize, and expand our Service`);
  sections.push(
    `  - To understand and analyze how you use our Service`
  );
  sections.push(
    `  - To communicate with you, including for customer service and support`
  );
  if (c.hasNewsletterSignup) {
    sections.push(
      `  - To send you newsletters and marketing communications (with your consent)`
    );
  }
  if (c.collectsPaymentInfo) {
    sections.push(`  - To process transactions and send related information`);
  }
  sections.push(
    `  - To detect, prevent, and address technical issues and security threats`
  );
  sections.push("");

  // Third-Party Services
  const thirdSection = useSection + 1;
  sections.push(`${thirdSection}. Third-Party Services`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(
    `We may employ third-party companies and services to facilitate our Service. These third parties have access to your information only to perform specific tasks on our behalf and are obligated not to disclose or use it for other purposes.\n`
  );

  if (c.usesAnalytics && c.thirdPartyAnalytics !== "None") {
    sections.push(`Analytics:`);
    sections.push(
      `We use ${c.thirdPartyAnalytics} to monitor and analyze the use of our Service. ${c.thirdPartyAnalytics} collects data about website traffic and usage patterns. For more information, please review their privacy policy.\n`
    );
  }

  if (c.collectsPaymentInfo && c.thirdPartyPayment) {
    sections.push(`Payment Processing:`);
    sections.push(
      `We use ${c.thirdPartyPayment} for payment processing. We do not store your payment card details. ${c.thirdPartyPayment} adheres to PCI-DSS standards for secure payment handling. For more information, please review their privacy policy.\n`
    );
  }

  if (c.thirdPartySocialLogin) {
    sections.push(`Social Login:`);
    sections.push(
      `We offer the ability to sign in using third-party social media accounts. If you choose to do so, we may receive certain profile information from the social media provider. We only use this information to create and manage your account.\n`
    );
  }

  if (c.thirdPartyAds) {
    sections.push(`Advertising:`);
    sections.push(
      `We may use third-party advertising partners to display ads on our Service. These partners may use cookies and similar technologies to collect information about your browsing activities to provide targeted advertisements.\n`
    );
  }

  // Data Retention
  const retentionSection = thirdSection + 1;
  sections.push(`${retentionSection}. Data Retention`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(
    `We retain your personal information for ${c.dataRetention.toLowerCase()}, or as long as necessary to fulfill the purposes outlined in this policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.\n`
  );

  if (c.allowsAccountDeletion) {
    sections.push(
      `You may request deletion of your account and associated data at any time by contacting us at ${email}.\n`
    );
  }

  // Security
  const securitySection = retentionSection + 1;
  sections.push(`${securitySection}. Data Security`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(
    `The security of your data is important to us. We implement commercially reasonable security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.\n`
  );

  // GDPR
  let nextSection = securitySection + 1;
  if (c.gdpr) {
    sections.push(
      `${nextSection}. Your Rights Under GDPR (European Economic Area)`
    );
    sections.push(`${"─".repeat(40)}`);
    sections.push(
      `If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data.\n`
    );
    sections.push(`You have the right to:`);
    sections.push(
      `  - Access: Request copies of your personal data.`
    );
    sections.push(
      `  - Rectification: Request correction of inaccurate personal data.`
    );
    sections.push(
      `  - Erasure: Request deletion of your personal data under certain conditions.`
    );
    sections.push(
      `  - Restrict Processing: Request restriction of processing your personal data.`
    );
    sections.push(
      `  - Data Portability: Request transfer of your data to another organization.`
    );
    sections.push(
      `  - Object: Object to our processing of your personal data.`
    );
    sections.push(
      `\nTo exercise these rights, please contact us at ${email}. We will respond within 30 days.\n`
    );
    nextSection++;
  }

  // CCPA
  if (c.ccpa) {
    sections.push(
      `${nextSection}. Your Rights Under CCPA (California Residents)`
    );
    sections.push(`${"─".repeat(40)}`);
    sections.push(
      `If you are a California resident, the California Consumer Privacy Act (CCPA) grants you specific rights regarding your personal information.\n`
    );
    sections.push(`You have the right to:`);
    sections.push(
      `  - Know: Request disclosure of the categories and specific pieces of personal information we have collected.`
    );
    sections.push(
      `  - Delete: Request deletion of personal information we have collected from you.`
    );
    sections.push(
      `  - Opt-Out: Opt out of the sale of your personal information. We do not sell personal information.`
    );
    sections.push(
      `  - Non-Discrimination: Not be discriminated against for exercising your CCPA rights.`
    );
    sections.push(
      `\nTo exercise these rights, please contact us at ${email}. We will respond within 45 days.\n`
    );
    nextSection++;
  }

  // COPPA
  if (c.coppa) {
    sections.push(`${nextSection}. Children's Privacy (COPPA)`);
    sections.push(`${"─".repeat(40)}`);
    sections.push(
      `Our Service is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us at ${email}. If we become aware that we have collected personal data from children without verification of parental consent, we will take steps to remove that information from our servers.\n`
    );
    nextSection++;
  }

  // Changes to Policy
  sections.push(`${nextSection}. Changes to This Privacy Policy`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(
    `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this Privacy Policy periodically for any changes.\n`
  );
  nextSection++;

  // Contact
  sections.push(`${nextSection}. Contact Us`);
  sections.push(`${"─".repeat(40)}`);
  sections.push(
    `If you have any questions about this Privacy Policy, please contact us:`
  );
  sections.push(`  - Email: ${email}`);
  if (c.siteUrl) {
    sections.push(`  - Website: ${url}`);
  }
  if (c.companyName) {
    sections.push(`  - Company: ${company}`);
  }
  sections.push("");

  return sections.join("\n");
}

// --- Component ---

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="pt-0.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
            checked
              ? "bg-indigo-600"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              checked ? "translate-x-[18px]" : "translate-x-[3px]"
            }`}
          />
        </button>
      </div>
      <div>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </span>
        )}
      </div>
    </label>
  );
}

const INPUT_CLS =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";

const SELECT_CLS =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100";

export default function PrivacyPolicyTool() {
  const [config, setConfig] = useState<PolicyConfig>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const { trackFirstInteraction } = useToolAnalytics("privacy-policy");

  const set = useCallback(
    <K extends keyof PolicyConfig>(key: K, value: PolicyConfig[K]) => {
      trackFirstInteraction();
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [trackFirstInteraction]
  );

  const output = useMemo(() => generatePolicy(config), [config]);

  const wordCount = useMemo(
    () => output.split(/\s+/).filter(Boolean).length,
    [output]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleDownload = useCallback(() => {
    trackFirstInteraction();
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy-policy.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [output, trackFirstInteraction]);

  const handleReset = useCallback(() => {
    setConfig(DEFAULTS);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Privacy Policy Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate a professional privacy policy for your website or app. Fill in
        your details and customize the sections you need.
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Basic Information
            </h2>
            <div className="space-y-3">
              <Field label="Website / App Name">
                <input
                  type="text"
                  value={config.siteName}
                  onChange={(e) => set("siteName", e.target.value)}
                  placeholder="My Website"
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Website URL">
                <input
                  type="text"
                  value={config.siteUrl}
                  onChange={(e) => set("siteUrl", e.target.value)}
                  placeholder="https://example.com"
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Company / Organization Name (optional)">
                <input
                  type="text"
                  value={config.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  placeholder="Acme Inc."
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Contact Email">
                <input
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="privacy@example.com"
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Effective Date">
                <input
                  type="date"
                  value={config.effectiveDate}
                  onChange={(e) => set("effectiveDate", e.target.value)}
                  className={INPUT_CLS}
                />
              </Field>
            </div>
          </div>

          {/* Data Collection */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Data Collection
            </h2>
            <div className="space-y-3">
              <Toggle
                label="Personal Information"
                description="Name, email, and other identifiable info"
                checked={config.collectsPersonalInfo}
                onChange={(v) => set("collectsPersonalInfo", v)}
              />
              <Toggle
                label="Usage Data"
                description="IP address, browser type, pages visited"
                checked={config.collectsUsageData}
                onChange={(v) => set("collectsUsageData", v)}
              />
              <Toggle
                label="Location Data"
                description="Approximate location from IP address"
                checked={config.collectsLocationData}
                onChange={(v) => set("collectsLocationData", v)}
              />
              <Toggle
                label="Payment Information"
                description="Billing address, payment card details"
                checked={config.collectsPaymentInfo}
                onChange={(v) => set("collectsPaymentInfo", v)}
              />
              <Toggle
                label="Cookies"
                description="Cookie and tracking technology usage"
                checked={config.usesCookies}
                onChange={(v) => set("usesCookies", v)}
              />
              <Toggle
                label="Analytics"
                description="Third-party analytics tracking"
                checked={config.usesAnalytics}
                onChange={(v) => set("usesAnalytics", v)}
              />
              <Toggle
                label="Newsletter Signup"
                description="Email collection for marketing"
                checked={config.hasNewsletterSignup}
                onChange={(v) => set("hasNewsletterSignup", v)}
              />
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Third-Party Services
            </h2>
            <div className="space-y-3">
              <Field label="Analytics Provider">
                <select
                  value={config.thirdPartyAnalytics}
                  onChange={(e) =>
                    set("thirdPartyAnalytics", e.target.value)
                  }
                  className={SELECT_CLS}
                >
                  {ANALYTICS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Payment Processor">
                <select
                  value={config.thirdPartyPayment}
                  onChange={(e) =>
                    set("thirdPartyPayment", e.target.value)
                  }
                  className={SELECT_CLS}
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt || "__none"}>
                      {opt || "None"}
                    </option>
                  ))}
                </select>
              </Field>
              <Toggle
                label="Third-Party Advertising"
                description="Display ads from ad networks"
                checked={config.thirdPartyAds}
                onChange={(v) => set("thirdPartyAds", v)}
              />
              <Toggle
                label="Social Login"
                description="Sign in with Google, GitHub, etc."
                checked={config.thirdPartySocialLogin}
                onChange={(v) => set("thirdPartySocialLogin", v)}
              />
            </div>
          </div>

          {/* Compliance */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Compliance & Rights
            </h2>
            <div className="space-y-3">
              <Toggle
                label="GDPR Compliance"
                description="European data protection rights"
                checked={config.gdpr}
                onChange={(v) => set("gdpr", v)}
              />
              <Toggle
                label="CCPA Compliance"
                description="California consumer privacy rights"
                checked={config.ccpa}
                onChange={(v) => set("ccpa", v)}
              />
              <Toggle
                label="COPPA Compliance"
                description="Children's online privacy protection"
                checked={config.coppa}
                onChange={(v) => set("coppa", v)}
              />
              <Toggle
                label="Account Deletion"
                description="Allow users to request data deletion"
                checked={config.allowsAccountDeletion}
                onChange={(v) => set("allowsAccountDeletion", v)}
              />
              <Field label="Data Retention Period">
                <select
                  value={config.dataRetention}
                  onChange={(e) => set("dataRetention", e.target.value)}
                  className={SELECT_CLS}
                >
                  {RETENTION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Reset to defaults
          </button>
        </div>

        {/* Right: Output */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Generated Privacy Policy
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ~{wordCount} words
            </span>
          </div>

          <div className="relative rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
            <pre className="max-h-[700px] overflow-auto p-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
              {output}
            </pre>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download .txt
            </button>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About This Tool
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            This generator creates a <strong>customizable privacy policy</strong>{" "}
            based on your selections. It covers data collection, cookies,
            third-party services, and compliance sections.
          </li>
          <li>
            Supports <strong>GDPR</strong>, <strong>CCPA</strong>, and{" "}
            <strong>COPPA</strong> compliance sections for websites serving
            users in the EU, California, or children under 13.
          </li>
          <li>
            <strong>Disclaimer:</strong> This tool generates a template for
            informational purposes only. It is not legal advice. Consult a
            qualified attorney to ensure your privacy policy meets all
            applicable legal requirements.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
