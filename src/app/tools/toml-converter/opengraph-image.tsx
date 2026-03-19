import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "TOML ↔ JSON/YAML Converter",
    "Convert between TOML, JSON, and YAML formats instantly for Rust, Python, and config files.",
    "TML",
  );
}
