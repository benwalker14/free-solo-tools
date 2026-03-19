import type { Metadata } from "next";
import HtmlToJsxTool from "./HtmlToJsxTool";

export const metadata: Metadata = {
  title: "HTML to JSX Converter",
  description:
    "Convert HTML to JSX instantly — transforms class to className, for to htmlFor, inline styles to objects, self-closes void elements, and more. Free online tool — no signup required.",
  keywords: [
    "html to jsx",
    "html to jsx converter",
    "html to react",
    "convert html to jsx",
    "html jsx converter",
    "react html converter",
    "html to react component",
    "jsx converter",
    "html to tsx",
    "class to classname",
  ],
  alternates: {
    canonical: "/tools/html-to-jsx",
  },
  openGraph: {
    title: "HTML to JSX Converter - DevBolt",
    description:
      "Convert HTML to JSX instantly — class to className, inline styles to objects, self-closing tags, and more. Free, client-side, no signup.",
    url: "/tools/html-to-jsx",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HTML to JSX Converter",
  url: "https://devbolt.dev/tools/html-to-jsx",
  description:
    "Convert HTML to JSX instantly — transforms class to className, for to htmlFor, inline styles to objects, self-closes void elements, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HtmlToJsxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HtmlToJsxTool />
    </>
  );
}
