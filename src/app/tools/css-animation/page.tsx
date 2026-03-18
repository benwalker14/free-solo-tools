import type { Metadata } from "next";
import CSSAnimationTool from "./CSSAnimationTool";

export const metadata: Metadata = {
  title: "CSS Animation Generator",
  description:
    "Build CSS keyframe animations visually. Configure duration, timing, direction, and fill mode. Add keyframes with transform, opacity, and skew controls. Copy production-ready @keyframes CSS. Free online tool — no signup required.",
  keywords: [
    "CSS animation generator",
    "CSS keyframes generator",
    "CSS animation tool",
    "keyframe animation maker",
    "CSS animation builder",
    "CSS transform animation",
    "CSS transition generator",
    "animation timing function",
    "CSS motion design",
  ],
  alternates: {
    canonical: "/tools/css-animation",
  },
  openGraph: {
    title: "CSS Animation Generator - DevBolt",
    description:
      "Build CSS keyframe animations visually with presets, live preview, and copy-ready @keyframes CSS.",
    url: "/tools/css-animation",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CSS Animation Generator",
  url: "https://devbolt.dev/tools/css-animation",
  description:
    "Build CSS keyframe animations visually. Configure duration, timing, direction, and fill mode. Add keyframes with transform, opacity, and skew controls. Copy production-ready CSS.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CSSAnimationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CSSAnimationTool />
    </>
  );
}
