import type { Metadata } from "next";
import Base64Tool from "./Base64Tool";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder",
  description:
    "Encode and decode Base64 strings online with full Unicode support. Fast, private, and free — runs entirely in your browser.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 online",
    "encode Base64",
    "decode Base64",
  ],
  alternates: {
    canonical: "/tools/base64",
  },
  openGraph: {
    title: "Base64 Encoder & Decoder - FreeSolo Tools",
    description:
      "Encode and decode Base64 strings online. Free, fast, and private.",
    url: "/tools/base64",
  },
};

export default function Base64Page() {
  return <Base64Tool />;
}
