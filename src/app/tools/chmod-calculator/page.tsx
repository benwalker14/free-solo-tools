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
    title: "Chmod Calculator - FreeSolo Tools",
    description:
      "Calculate Unix file permissions with an interactive chmod calculator.",
    url: "/tools/chmod-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chmod Calculator",
  url: "https://free-solo-tools.vercel.app/tools/chmod-calculator",
  description:
    "Calculate Unix file permissions interactively. Toggle read, write, and execute for owner, group, and others with instant octal and symbolic output.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
