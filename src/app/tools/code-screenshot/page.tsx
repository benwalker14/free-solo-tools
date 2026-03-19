import type { Metadata } from "next";
import CodeScreenshotTool from "./CodeScreenshotTool";

export const metadata: Metadata = {
  title: "Code Screenshot Generator — Beautiful Code Images",
  description:
    "Create beautiful screenshots of your code with 8 themes, 13 languages, customizable backgrounds, and window chrome. Free Carbon/Ray.so alternative — no signup, fully client-side.",
  keywords: [
    "code screenshot",
    "code screenshot generator",
    "code to image",
    "code image generator",
    "carbon alternative",
    "ray.so alternative",
    "code snippet image",
    "beautiful code screenshot",
    "syntax highlighting image",
    "code screenshot tool",
    "share code as image",
    "code to png",
  ],
  alternates: {
    canonical: "/tools/code-screenshot",
  },
  openGraph: {
    title: "Code Screenshot Generator - DevBolt",
    description:
      "Create beautiful screenshots of your code with themes, syntax highlighting, and customizable backgrounds.",
    url: "/tools/code-screenshot",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Code Screenshot Generator",
  url: "https://devbolt.dev/tools/code-screenshot",
  description:
    "Create beautiful screenshots of your code with 8 themes, 13 languages, customizable backgrounds, and window chrome. Free Carbon/Ray.so alternative.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CodeScreenshotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeScreenshotTool />
    </>
  );
}
