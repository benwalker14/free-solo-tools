import type { Metadata } from "next";
import GitignoreGeneratorTool from "./GitignoreGeneratorTool";

export const metadata: Metadata = {
  title: ".gitignore Generator",
  description:
    "Generate .gitignore files from 50+ templates for Node.js, Python, Java, Go, Rust, React, Next.js, and more. Combine templates, add custom rules, and download instantly. Free online tool — no signup required.",
  keywords: [
    "gitignore generator",
    "gitignore template",
    "git ignore file",
    "gitignore creator",
    "gitignore builder",
    "gitignore node",
    "gitignore python",
    "gitignore java",
    "gitignore react",
    "generate gitignore",
  ],
  alternates: {
    canonical: "/tools/gitignore-generator",
  },
  openGraph: {
    title: ".gitignore Generator - DevBolt",
    description:
      "Generate .gitignore files from 50+ templates. Combine templates and download instantly.",
    url: "/tools/gitignore-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: ".gitignore Generator",
  url: "https://devbolt.dev/tools/gitignore-generator",
  description:
    "Generate .gitignore files from 50+ templates for Node.js, Python, Java, Go, Rust, React, Next.js, and more. Combine templates, add custom rules, and download instantly.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function GitignoreGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GitignoreGeneratorTool />
    </>
  );
}
