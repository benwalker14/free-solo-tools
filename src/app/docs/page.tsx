import type { Metadata } from "next";
import ApiDocsPage from "./ApiDocsPage";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "DevBolt Pro REST API documentation. Access JSON formatting, Base64, hashing, UUID generation, and more via simple HTTP endpoints.",
  openGraph: {
    title: "API Docs | DevBolt",
    description:
      "REST API for developer tools — JSON, Base64, hashing, UUIDs, and more.",
    url: "https://devbolt.dev/docs",
  },
  keywords: [
    "developer API",
    "JSON API",
    "Base64 API",
    "hash API",
    "UUID API",
    "developer tools API",
    "REST API",
    "DevBolt API",
  ],
};

export default function Page() {
  return <ApiDocsPage />;
}
