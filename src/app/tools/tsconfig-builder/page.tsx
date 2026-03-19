import type { Metadata } from "next";
import TsconfigBuilderTool from "./TsconfigBuilderTool";

export const metadata: Metadata = {
  title: "tsconfig.json Visual Builder",
  description:
    "Build your TypeScript tsconfig.json visually with explanations for every compiler option. Start from framework presets (Next.js, Vite, Node.js) or customize from scratch. Free online tsconfig generator — 100% client-side.",
  keywords: [
    "tsconfig builder",
    "tsconfig generator",
    "tsconfig.json builder",
    "typescript config builder",
    "tsconfig visual editor",
    "tsconfig online",
    "generate tsconfig",
    "tsconfig.json generator",
    "typescript configuration tool",
    "tsconfig presets",
    "tsconfig next.js",
    "tsconfig strict mode",
  ],
  alternates: {
    canonical: "/tools/tsconfig-builder",
  },
  openGraph: {
    title: "tsconfig.json Visual Builder - DevBolt",
    description:
      "Build TypeScript tsconfig.json visually with framework presets and explanations. 100% client-side.",
    url: "/tools/tsconfig-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "tsconfig.json Visual Builder",
  url: "https://devbolt.dev/tools/tsconfig-builder",
  description:
    "Build your TypeScript tsconfig.json configuration visually with framework presets, explanations for every option, and one-click download.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function TsconfigBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TsconfigBuilderTool />
    </>
  );
}
