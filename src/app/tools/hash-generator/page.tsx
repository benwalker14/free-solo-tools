import type { Metadata } from "next";
import HashGeneratorTool from "./HashGeneratorTool";

export const metadata: Metadata = {
  title: "Hash Generator (SHA-256, SHA-512) - FreeSolo Tools",
  description:
    "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes online. Uses Web Crypto API.",
};

export default function HashGeneratorPage() {
  return <HashGeneratorTool />;
}
