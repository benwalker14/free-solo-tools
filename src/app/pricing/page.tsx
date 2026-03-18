import type { Metadata } from "next";
import PricingPage from "./PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "DevBolt pricing. Free tier with 25 daily operations per tool. Pro for $4.99/mo — unlimited access, no ads, batch processing, and API access.",
  openGraph: {
    title: "Pricing | DevBolt",
    description:
      "Free tier for everyday use. Pro for unlimited access at $4.99/mo.",
    url: "https://devbolt.dev/pricing",
  },
};

export default function Page() {
  return <PricingPage />;
}
