import type { Metadata } from "next";
import SvgToJsxTool from "./SvgToJsxTool";

export const metadata: Metadata = {
  title: "SVG to JSX/React Component Converter",
  description:
    "Convert SVG markup to JSX or a full React component instantly — transforms attributes to camelCase, adds viewBox, wraps in a component function, and more. Free online tool — no signup required.",
  keywords: [
    "svg to jsx",
    "svg to react",
    "svg to jsx converter",
    "svg to react component",
    "convert svg to jsx",
    "svg jsx converter",
    "react svg component",
    "svg to tsx",
    "svg icon react",
    "svg to component",
  ],
  alternates: {
    canonical: "/tools/svg-to-jsx",
  },
  openGraph: {
    title: "SVG to JSX/React Component Converter - DevBolt",
    description:
      "Convert SVG to JSX or a React component instantly — camelCase attributes, viewBox handling, component wrapping. Free, client-side, no signup.",
    url: "/tools/svg-to-jsx",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SVG to JSX/React Component Converter",
  url: "https://devbolt.dev/tools/svg-to-jsx",
  description:
    "Convert SVG markup to JSX or a full React component — transforms attributes to camelCase, handles viewBox, wraps in component function, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function SvgToJsxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SvgToJsxTool />
    </>
  );
}
