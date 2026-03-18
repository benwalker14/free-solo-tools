import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JSON ↔ YAML Converter",
    "Convert between JSON and YAML formats instantly for Kubernetes and CI/CD configs.",
    "YML",
  );
}
