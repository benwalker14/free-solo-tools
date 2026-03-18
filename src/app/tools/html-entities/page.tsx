import type { Metadata } from "next";
import HtmlEntitiesTool from "./HtmlEntitiesTool";

export const metadata: Metadata = {
  title: "HTML Entity Encoder & Decoder",
  description:
    "Encode and decode HTML entities online. Convert special characters to &amp; &lt; &gt; and back. Supports named, decimal, and hex entities. Fast, private, and free.",
  keywords: [
    "HTML entity encoder",
    "HTML entity decoder",
    "HTML entities",
    "HTML special characters",
    "HTML encode online",
    "HTML decode online",
    "ampersand encoder",
    "character entity reference",
    "HTML escape",
  ],
  alternates: {
    canonical: "/tools/html-entities",
  },
  openGraph: {
    title: "HTML Entity Encoder & Decoder - FreeSolo Tools",
    description:
      "Encode and decode HTML entities online. Convert special characters to named or numeric entities. Free, fast, and private.",
    url: "/tools/html-entities",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "HTML Entity Encoder & Decoder",
  url: "https://free-solo-tools.vercel.app/tools/html-entities",
  description:
    "Encode and decode HTML entities online. Convert special characters to named or numeric HTML entities and back. Supports named, decimal, and hex entity formats.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HtmlEntitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HtmlEntitiesTool />
    </>
  );
}
