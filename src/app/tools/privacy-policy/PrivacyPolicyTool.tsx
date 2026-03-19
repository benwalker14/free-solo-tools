"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

interface PolicyFields {
  companyName: string;
  websiteUrl: string;
  contactEmail: string;
  effectiveDate: string;
  collectsPersonalInfo: boolean;
  collectsUsageData: boolean;
  usesCookies: boolean;
  usesAnalytics: boolean;
  analyticsProvider: string;
  usesAds: boolean;
  adsProvider: string;
  allowsUserAccounts: boolean;
  collectsPaymentInfo: boolean;
  paymentProcessor: string;
  sharesWithThirdParties: boolean;
  thirdPartyDescription: string;
  hasNewsletters: boolean;
  hasChildrenPolicy: boolean;
  dataRetentionPeriod: string;
  includesGdpr: boolean;
  includesCcpa: boolean;
  governingLaw: string;
}

const DEFAULTS: PolicyFields = {
  companyName: "",
  websiteUrl: "",
  contactEmail: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  collectsPersonalInfo: true,
  collectsUsageData: true,
  usesCookies: true,
  usesAnalytics: true,
  analyticsProvider: "Google Analytics",
  usesAds: false,
  adsProvider: "",
  allowsUserAccounts: false,
  collectsPaymentInfo: false,
  paymentProcessor: "Stripe",
  sharesWithThirdParties: false,
  thirdPartyDescription: "",
  hasNewsletters: false,
  hasChildrenPolicy: true,
  dataRetentionPeriod: "as long as necessary",
  includesGdpr: true,
  includesCcpa: true,
  governingLaw: "",
};

const ANALYTICS_PROVIDERS = [
  "Google Analytics",
  "Plausible",
  "Fathom",
  "Matomo",
  "Vercel Analytics",
  "PostHog",
  "Mixpanel",
  "Other",
];

const PAYMENT_PROCESSORS = [
  "Stripe",
  "PayPal",
  "Square",
  "Braintree",
  "Paddle",
  "Lemon Squeezy",
  "Other",
];

const RETENTION_PERIODS = [
  "as long as necessary",
  "30 days",
  "90 days",
  "1 year",
  "2 years",
  "5 years",
];

function formatDate(dateStr: string): string {
  if (!dateStr) return "[Date]";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function generatePolicy(f: PolicyFields): string {
  const name = f.companyName || "[Company Name]";
  const url = f.websiteUrl || "[Website URL]";
  const email = f.contactEmail || "[contact@example.com]";
  const date = formatDate(f.effectiveDate);

  const sections: string[] = [];

  sections.push(`PRIVACY POLICY

Last updated: ${date}

${name} ("we," "us," or "our") operates ${url} (the "Website"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Website.

Please read this Privacy Policy carefully. By using the Website, you agree to the collection and use of information in accordance with this policy.`);

  const infoTypes: string[] = [];
  if (f.collectsPersonalInfo) {
    infoTypes.push(`Personal Information
When you use our Website, we may ask you to provide certain personally identifiable information, including but not limited to:
- Name
- Email address
- Phone number
- Mailing address`);
  }
  if (f.allowsUserAccounts) {
    infoTypes.push(`Account Information
When you create an account, we collect your username, email address, and password. We store this information to provide you with access to your account and associated features.`);
  }
  if (f.collectsPaymentInfo) {
    infoTypes.push(`Payment Information
When you make a purchase, your payment information is processed by ${f.paymentProcessor || "[Payment Processor]"}. We do not store your full credit card number or payment details on our servers. Please refer to ${f.paymentProcessor || "[Payment Processor]"}'s privacy policy for more information on how your payment data is handled.`);
  }
  if (f.collectsUsageData) {
    infoTypes.push(`Usage Data
We automatically collect certain information when you visit the Website, including:
- Your IP address
- Browser type and version
- Pages you visit and time spent on those pages
- The date and time of your visit
- Unique device identifiers
- Referring website addresses`);
  }

  if (infoTypes.length > 0) {
    sections.push(`INFORMATION WE COLLECT

${infoTypes.join("\n\n")}`);
  }

  if (f.usesCookies) {
    sections.push(`COOKIES AND TRACKING TECHNOLOGIES

We use cookies and similar tracking technologies to track activity on our Website and store certain information. Cookies are small data files placed on your device.

Types of cookies we use:
- Essential Cookies: Required for the Website to function properly.
- Analytics Cookies: Help us understand how visitors interact with the Website.
- Preference Cookies: Remember your settings and preferences.${f.usesAds ? "\n- Advertising Cookies: Used to deliver relevant advertisements." : ""}

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of the Website may not function properly.`);
  }

  if (f.usesAnalytics) {
    sections.push(`ANALYTICS

We use ${f.analyticsProvider || "[Analytics Provider]"} to monitor and analyze the use of our Website. This service may collect information about your use of the Website, including your IP address, browser type, and pages visited. This data helps us improve the Website and understand user behavior.

For more information on the privacy practices of ${f.analyticsProvider || "[Analytics Provider]"}, please visit their privacy policy.`);
  }

  if (f.usesAds) {
    sections.push(`ADVERTISING

We may use third-party advertising companies${f.adsProvider ? ` such as ${f.adsProvider}` : ""} to serve ads when you visit the Website. These companies may use cookies and similar technologies to collect information about your visits to this and other websites in order to provide relevant advertisements.`);
  }

  sections.push(`HOW WE USE YOUR INFORMATION

We may use the information we collect for various purposes, including to:
- Provide, operate, and maintain the Website
- Improve, personalize, and expand the Website
- Understand and analyze how you use the Website
- Develop new products, services, features, and functionality${f.allowsUserAccounts ? "\n- Manage your account and provide customer support" : ""}${f.collectsPaymentInfo ? "\n- Process transactions and send related information" : ""}${f.hasNewsletters ? "\n- Send you newsletters and marketing communications (with your consent)" : ""}
- Find and prevent fraud
- Comply with legal obligations`);

  if (f.sharesWithThirdParties) {
    sections.push(`SHARING YOUR INFORMATION

We may share your information with third parties in the following situations:
${f.thirdPartyDescription || "- With service providers who assist us in operating the Website\n- With business partners for joint marketing initiatives\n- When required by law or to protect our rights"}

We do not sell your personal information to third parties.`);
  } else {
    sections.push(`SHARING YOUR INFORMATION

We do not sell, trade, or rent your personal information to third parties. We may share generic aggregated demographic information not linked to any personal identification with our business partners and trusted affiliates for the purposes outlined above.`);
  }

  if (f.hasNewsletters) {
    sections.push(`EMAIL COMMUNICATIONS

If you subscribe to our newsletter or marketing emails, you may opt out at any time by clicking the "unsubscribe" link at the bottom of any email or by contacting us at ${email}. Please note that we may still send you transactional or administrative emails related to your account.`);
  }

  sections.push(`DATA SECURITY

We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee the absolute security of your data.`);

  sections.push(`DATA RETENTION

We will retain your personal information only for ${f.dataRetentionPeriod} to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. When your information is no longer needed, we will securely delete or anonymize it.`);

  if (f.includesGdpr) {
    sections.push(`YOUR RIGHTS UNDER GDPR (EUROPEAN USERS)

If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). These include the right to:
- Access the personal data we hold about you
- Rectify inaccurate personal data
- Request erasure of your personal data
- Object to processing of your personal data
- Request restriction of processing your personal data
- Request transfer of your personal data (data portability)
- Withdraw consent at any time

To exercise any of these rights, please contact us at ${email}. We will respond to your request within 30 days.`);
  }

  if (f.includesCcpa) {
    sections.push(`YOUR RIGHTS UNDER CCPA (CALIFORNIA USERS)

If you are a California resident, the California Consumer Privacy Act (CCPA) grants you the following rights:
- The right to know what personal information is collected, used, shared, or sold
- The right to delete personal information held by businesses
- The right to opt out of the sale of personal information
- The right to non-discrimination for exercising your CCPA rights

To exercise any of these rights, please contact us at ${email}. We will respond to your request within 45 days.`);
  }

  if (f.hasChildrenPolicy) {
    sections.push(`CHILDREN'S PRIVACY

Our Website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal data from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.`);
  }

  sections.push(`THIRD-PARTY LINKS

Our Website may contain links to third-party websites and services that are not operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.`);

  sections.push(`CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.`);

  if (f.governingLaw) {
    sections.push(`GOVERNING LAW

This Privacy Policy shall be governed by and construed in accordance with the laws of ${f.governingLaw}, without regard to its conflict of law provisions.`);
  }

  sections.push(`CONTACT US

If you have any questions about this Privacy Policy, please contact us:
- By email: ${email}${f.websiteUrl ? `\n- By visiting: ${url}` : ""}`);

  return sections.join("\n\n---\n\n");
}

export default function PrivacyPolicyTool() {
  const [fields, setFields] = useState<PolicyFields>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<"text" | "html" | "markdown">("text");
  const { trackAction } = useToolAnalytics("privacy-policy");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit(
    "privacy-policy"
  );

  const rawPolicy = useMemo(() => generatePolicy(fields), [fields]);

  const formattedOutput = useMemo(() => {
    if (format === "text") return rawPolicy;
    if (format === "markdown") return textToMarkdown(rawPolicy);
    return textToHtml(rawPolicy, fields);
  }, [rawPolicy, format, fields]);

  const handleCopy = async () => {
    recordUsage();
    if (isLimited) return;
    trackAction("copy");
    await navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    recordUsage();
    if (isLimited) return;
    trackAction("download");
    const ext = format === "html" ? "html" : format === "markdown" ? "md" : "txt";
    const mime = format === "html" ? "text/html" : "text/plain";
    const blob = new Blob([formattedOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privacy-policy.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useKeyboardShortcut("Enter", handleCopy);

  const update = <K extends keyof PolicyFields>(
    key: K,
    value: PolicyFields[K]
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setFields(DEFAULTS);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          ← Back to Tools
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2">
        Privacy Policy Generator
      </h1>
      <p className="text-slate-400 mb-6">
        Generate a customized privacy policy for your website or app. Fill in
        your details and toggle the sections you need.
      </p>

      <RateLimitBanner
        isLimited={isLimited}
        remaining={remaining}
        dailyLimit={dailyLimit}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Field
                label="Company / Website Name"
                value={fields.companyName}
                onChange={(v) => update("companyName", v)}
                placeholder="Acme Inc."
              />
              <Field
                label="Website URL"
                value={fields.websiteUrl}
                onChange={(v) => update("websiteUrl", v)}
                placeholder="https://example.com"
                type="url"
              />
              <Field
                label="Contact Email"
                value={fields.contactEmail}
                onChange={(v) => update("contactEmail", v)}
                placeholder="privacy@example.com"
                type="email"
              />
              <Field
                label="Effective Date"
                value={fields.effectiveDate}
                onChange={(v) => update("effectiveDate", v)}
                type="date"
              />
              <Field
                label="Governing Law (jurisdiction)"
                value={fields.governingLaw}
                onChange={(v) => update("governingLaw", v)}
                placeholder="State of California, United States"
              />
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Data Collection
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Collects personal information (name, email, etc.)"
                checked={fields.collectsPersonalInfo}
                onChange={(v) => update("collectsPersonalInfo", v)}
              />
              <Toggle
                label="Collects usage data (IP, browser, pages visited)"
                checked={fields.collectsUsageData}
                onChange={(v) => update("collectsUsageData", v)}
              />
              <Toggle
                label="Allows user accounts / registration"
                checked={fields.allowsUserAccounts}
                onChange={(v) => update("allowsUserAccounts", v)}
              />
              <Toggle
                label="Collects payment information"
                checked={fields.collectsPaymentInfo}
                onChange={(v) => update("collectsPaymentInfo", v)}
              />
              {fields.collectsPaymentInfo && (
                <SelectField
                  label="Payment Processor"
                  value={fields.paymentProcessor}
                  onChange={(v) => update("paymentProcessor", v)}
                  options={PAYMENT_PROCESSORS}
                />
              )}
              <SelectField
                label="Data Retention Period"
                value={fields.dataRetentionPeriod}
                onChange={(v) => update("dataRetentionPeriod", v)}
                options={RETENTION_PERIODS}
              />
            </div>
          </div>

          {/* Cookies & Tracking */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Cookies & Tracking
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Uses cookies"
                checked={fields.usesCookies}
                onChange={(v) => update("usesCookies", v)}
              />
              <Toggle
                label="Uses analytics"
                checked={fields.usesAnalytics}
                onChange={(v) => update("usesAnalytics", v)}
              />
              {fields.usesAnalytics && (
                <SelectField
                  label="Analytics Provider"
                  value={fields.analyticsProvider}
                  onChange={(v) => update("analyticsProvider", v)}
                  options={ANALYTICS_PROVIDERS}
                />
              )}
              <Toggle
                label="Displays advertisements"
                checked={fields.usesAds}
                onChange={(v) => update("usesAds", v)}
              />
              {fields.usesAds && (
                <Field
                  label="Ad Provider"
                  value={fields.adsProvider}
                  onChange={(v) => update("adsProvider", v)}
                  placeholder="Google AdSense, Carbon Ads, etc."
                />
              )}
            </div>
          </div>

          {/* Communication & Sharing */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Communication & Sharing
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Sends newsletters / marketing emails"
                checked={fields.hasNewsletters}
                onChange={(v) => update("hasNewsletters", v)}
              />
              <Toggle
                label="Shares data with third parties"
                checked={fields.sharesWithThirdParties}
                onChange={(v) => update("sharesWithThirdParties", v)}
              />
              {fields.sharesWithThirdParties && (
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1 block">
                    Third-party sharing details
                  </label>
                  <textarea
                    value={fields.thirdPartyDescription}
                    onChange={(e) =>
                      update("thirdPartyDescription", e.target.value)
                    }
                    placeholder="Describe who you share data with and why..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Compliance */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Compliance
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Include GDPR rights section (EU users)"
                checked={fields.includesGdpr}
                onChange={(v) => update("includesGdpr", v)}
              />
              <Toggle
                label="Include CCPA rights section (California users)"
                checked={fields.includesCcpa}
                onChange={(v) => update("includesCcpa", v)}
              />
              <Toggle
                label="Include children's privacy clause (COPPA)"
                checked={fields.hasChildrenPolicy}
                onChange={(v) => update("hasChildrenPolicy", v)}
              />
            </div>
          </div>

          <button
            onClick={reset}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset all fields
          </button>
        </div>

        {/* Right — Output */}
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">
                Generated Policy
              </h2>
              <div className="flex bg-slate-900 rounded-lg p-0.5">
                {(["text", "markdown", "html"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      format === f
                        ? "bg-slate-700 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f === "text"
                      ? "Text"
                      : f === "markdown"
                        ? "MD"
                        : "HTML"}
                  </button>
                ))}
              </div>
            </div>

            <pre className="bg-slate-900 border border-slate-600 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap break-words font-mono max-h-[600px] overflow-y-auto">
              {formattedOutput}
            </pre>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-slate-500">
                <span className="text-slate-600">Ctrl+Enter to copy</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isLimited}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={handleCopy}
                  disabled={isLimited}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
            <h3 className="text-amber-400 text-sm font-semibold mb-1">
              Disclaimer
            </h3>
            <p className="text-amber-200/70 text-sm">
              This tool generates a privacy policy template for informational
              purposes only. It does not constitute legal advice. You should
              consult with a qualified attorney to ensure your privacy policy
              complies with applicable laws and regulations.
            </p>
          </div>

          {/* Quick Reference */}
          <details className="bg-slate-800 border border-slate-700 rounded-lg">
            <summary className="px-5 py-3 cursor-pointer text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Quick reference — when do you need a privacy policy?
            </summary>
            <div className="px-5 pb-4 text-sm text-slate-400 space-y-3">
              <div>
                <h3 className="text-slate-200 font-medium mb-1">GDPR (EU)</h3>
                <p>
                  Required if you collect data from EU residents. Must explain
                  what data you collect, why, and how users can exercise their
                  rights.
                </p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">
                  CCPA (California)
                </h3>
                <p>
                  Required for businesses serving California residents with
                  annual revenue over $25M, data on 100K+ consumers, or 50%+
                  revenue from selling data.
                </p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">
                  Google Analytics / AdSense
                </h3>
                <p>
                  Google requires a privacy policy if you use Analytics, AdSense,
                  or any Google API that collects user data.
                </p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">
                  App Stores
                </h3>
                <p>
                  Both Apple App Store and Google Play Store require a privacy
                  policy for all published apps.
                </p>
              </div>
              <div>
                <h3 className="text-slate-200 font-medium mb-1">COPPA</h3>
                <p>
                  The Children&apos;s Online Privacy Protection Act requires a privacy
                  policy if your site is directed at children under 13.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

/* ─── Format converters ─── */

function textToMarkdown(text: string): string {
  return text
    .split("\n\n---\n\n")
    .map((section) => {
      const lines = section.split("\n");
      const firstLine = lines[0];
      if (firstLine === firstLine.toUpperCase() && /^[A-Z]/.test(firstLine)) {
        if (firstLine === "PRIVACY POLICY") {
          return `# Privacy Policy\n\n${lines.slice(1).join("\n")}`;
        }
        const heading = firstLine
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        return `## ${heading}\n\n${lines.slice(1).join("\n")}`;
      }
      return section;
    })
    .join("\n\n");
}

function textToHtml(text: string, fields: PolicyFields): string {
  const name = fields.companyName || "[Company Name]";
  const sections = text.split("\n\n---\n\n");
  const htmlSections = sections.map((section) => {
    const lines = section.split("\n");
    const firstLine = lines[0];
    if (firstLine === firstLine.toUpperCase() && /^[A-Z]/.test(firstLine)) {
      const tag = firstLine === "PRIVACY POLICY" ? "h1" : "h2";
      const heading = firstLine
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      const body = lines
        .slice(1)
        .join("\n")
        .trim()
        .split("\n\n")
        .map((para) => {
          if (para.startsWith("- ")) {
            const items = para
              .split("\n")
              .map((li) => `  <li>${esc(li.replace(/^- /, ""))}</li>`)
              .join("\n");
            return `<ul>\n${items}\n</ul>`;
          }
          return `<p>${esc(para)}</p>`;
        })
        .join("\n");
      return `<${tag}>${esc(heading)}</${tag}>\n${body}`;
    }
    return section
      .split("\n\n")
      .map((p) => `<p>${esc(p)}</p>`)
      .join("\n");
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - ${esc(name)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #333; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.4rem; margin-top: 2rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
  </style>
</head>
<body>
${htmlSections.join("\n\n")}
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ─── Sub-components ─── */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300 mb-1 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300 mb-1 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-blue-600 transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}
