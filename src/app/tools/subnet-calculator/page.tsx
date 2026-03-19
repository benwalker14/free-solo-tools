import type { Metadata } from "next";
import SubnetCalculatorTool from "./SubnetCalculatorTool";

export const metadata: Metadata = {
  title: "Subnet Calculator",
  description:
    "Calculate IPv4 subnet details from CIDR notation — network address, broadcast, host range, subnet mask, wildcard mask, and binary breakdown. Free online tool — no signup required.",
  keywords: [
    "subnet calculator",
    "cidr calculator",
    "ip calculator",
    "subnet mask calculator",
    "network calculator",
    "ipv4 subnet",
    "cidr notation",
    "ip address calculator",
    "wildcard mask",
    "network address calculator",
  ],
  alternates: {
    canonical: "/tools/subnet-calculator",
  },
  openGraph: {
    title: "Subnet Calculator - DevBolt",
    description:
      "Calculate IPv4 subnet details from CIDR notation — network, broadcast, host range, and more.",
    url: "/tools/subnet-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Subnet Calculator",
  url: "https://devbolt.dev/tools/subnet-calculator",
  description:
    "Calculate IPv4 subnet details from CIDR notation. Get network address, broadcast address, host range, subnet mask, wildcard mask, and binary breakdown instantly.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function SubnetCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubnetCalculatorTool />
    </>
  );
}
