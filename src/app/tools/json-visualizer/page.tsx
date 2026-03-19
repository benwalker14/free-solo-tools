import type { Metadata } from "next";
import JsonVisualizerTool from "./JsonVisualizerTool";

export const metadata: Metadata = {
  title: "JSON Visualizer & Tree Viewer — Interactive JSON Explorer",
  description:
    "Visualize JSON data as an interactive tree with collapsible nodes, search, path display, and copy. Free online JSON viewer — no signup, 100% client-side.",
  keywords: [
    "json viewer",
    "json visualizer",
    "json tree viewer",
    "json explorer",
    "interactive json viewer",
    "json tree",
    "json viewer online",
    "json visualizer online",
    "json structure viewer",
    "json node viewer",
  ],
  alternates: {
    canonical: "/tools/json-visualizer",
  },
  openGraph: {
    title: "JSON Visualizer & Tree Viewer - DevBolt",
    description:
      "Visualize JSON as an interactive tree — collapsible nodes, search, path display, copy values. Free, client-side, no signup.",
    url: "/tools/json-visualizer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "JSON Visualizer & Tree Viewer",
  url: "https://devbolt.dev/tools/json-visualizer",
  description:
    "Visualize JSON data as an interactive, collapsible tree with search, path display, and copy. Free online tool.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function JsonVisualizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonVisualizerTool />
    </>
  );
}
