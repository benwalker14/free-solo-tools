import type { Metadata } from "next";
import GradientGeneratorTool from "./GradientGeneratorTool";

export const metadata: Metadata = {
  title: "CSS Gradient Generator",
  description:
    "Create beautiful CSS linear and radial gradients visually. Adjust colors, stops, angles, and copy the CSS. Free online gradient generator — no signup required.",
  keywords: [
    "CSS gradient generator",
    "linear gradient",
    "radial gradient",
    "CSS background gradient",
    "gradient maker",
    "CSS gradient tool",
  ],
  alternates: {
    canonical: "/tools/gradient-generator",
  },
  openGraph: {
    title: "CSS Gradient Generator - FreeSolo Tools",
    description:
      "Create beautiful CSS gradients visually. Adjust colors, stops, and angles. Free online tool.",
    url: "/tools/gradient-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS Gradient Generator",
  url: "https://free-solo-tools.vercel.app/tools/gradient-generator",
  description:
    "Create beautiful CSS linear and radial gradients visually. Adjust colors, stops, angles, and copy the CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function GradientGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GradientGeneratorTool />
    </>
  );
}
