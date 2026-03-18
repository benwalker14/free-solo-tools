import type { Metadata } from "next";
import Base64Tool from "./Base64Tool";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder - FreeSolo Tools",
  description:
    "Encode and decode Base64 strings online. Free, fast, and private.",
};

export default function Base64Page() {
  return <Base64Tool />;
}
