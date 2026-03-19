import type { Metadata } from "next";
import SubnetCalculatorTool from "./SubnetCalculatorTool";

export const metadata: Metadata = {
  title: "IP / CIDR Toolkit",
  description:
    "Subnet calculator, VLSM divider, IP range to CIDR converter, and IP address classifier — all in one free online toolkit. No signup required.",
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
    "vlsm calculator",
    "vlsm subnet",
    "variable length subnet mask",
    "ip range to cidr",
    "cidr aggregation",
    "ip address info",
    "ip address lookup",
    "ip classifier",
  ],
  alternates: {
    canonical: "/tools/subnet-calculator",
  },
  openGraph: {
    title: "IP / CIDR Toolkit - DevBolt",
    description:
      "Subnet calculator, VLSM divider, IP range to CIDR converter, and IP address classifier — all in one toolkit.",
    url: "/tools/subnet-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IP / CIDR Toolkit",
  url: "https://devbolt.dev/tools/subnet-calculator",
  description:
    "Subnet calculator, VLSM subnet divider, IP range to CIDR converter, and IP address classifier. Get network address, broadcast address, host range, subnet mask, wildcard mask, and more instantly.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
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
