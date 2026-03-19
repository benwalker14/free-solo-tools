import type { Metadata } from "next";
import ChmodCalculatorTool from "./ChmodCalculatorTool";

export const metadata: Metadata = {
  title: "Chmod Calculator",
  description:
    "Calculate Unix file permissions with an interactive chmod calculator. Toggle read, write, and execute for owner, group, and others. Free online tool — no signup required.",
  keywords: [
    "chmod calculator",
    "unix permissions",
    "file permissions",
    "chmod command",
    "linux permissions",
    "octal permissions",
    "rwx permissions",
    "chmod 755",
    "chmod 644",
    "permission calculator",
  ],
  alternates: {
    canonical: "/tools/chmod-calculator",
  },
  openGraph: {
    title: "Chmod Calculator - DevBolt",
    description:
      "Calculate Unix file permissions with an interactive chmod calculator.",
    url: "/tools/chmod-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Chmod Calculator",
  url: "https://devbolt.dev/tools/chmod-calculator",
  description:
    "Calculate Unix file permissions interactively. Toggle read, write, and execute for owner, group, and others with instant octal and symbolic output.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function ChmodCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChmodCalculatorTool />
    </>
  );
}
