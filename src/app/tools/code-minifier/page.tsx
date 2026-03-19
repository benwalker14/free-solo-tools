import type { Metadata } from "next";
import CodeMinifierTool from "./CodeMinifierTool";

export const metadata: Metadata = {
  title: "JS/CSS/HTML Minifier & Beautifier",
  description:
    "Minify and beautify JavaScript, CSS, and HTML code instantly. Remove whitespace and comments for production or format code for readability. Free online minifier — no signup required.",
  keywords: [
    "JavaScript minifier",
    "CSS minifier",
    "HTML minifier",
    "JS beautifier",
    "CSS beautifier",
    "HTML beautifier",
    "code minifier",
    "minify JavaScript online",
    "minify CSS online",
    "code formatter",
    "JS pretty print",
    "uglify JavaScript",
  ],
  alternates: {
    canonical: "/tools/code-minifier",
  },
  openGraph: {
    title: "JS/CSS/HTML Minifier & Beautifier - DevBolt",
    description:
      "Minify and beautify JavaScript, CSS, and HTML code instantly. Free online tool.",
    url: "/tools/code-minifier",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JS/CSS/HTML Minifier & Beautifier",
  url: "https://devbolt.dev/tools/code-minifier",
  description:
    "Minify and beautify JavaScript, CSS, and HTML code instantly. Remove whitespace and comments for production or format code for readability.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function CodeMinifierPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeMinifierTool />
    </>
  );
}
