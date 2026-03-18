import type { Metadata } from "next";
import JwtDecoderTool from "./JwtDecoderTool";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration status. Free online JWT tool — no signup required.",
  keywords: [
    "JWT decoder",
    "JWT parser",
    "JSON Web Token",
    "decode JWT online",
    "JWT debugger",
  ],
  alternates: {
    canonical: "/tools/jwt-decoder",
  },
  openGraph: {
    title: "JWT Decoder - FreeSolo Tools",
    description:
      "Decode and inspect JSON Web Tokens instantly. View header, payload, and expiration.",
    url: "/tools/jwt-decoder",
  },
};

export default function JwtDecoderPage() {
  return <JwtDecoderTool />;
}
