import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    ".env to Docker/K8s Converter",
    "Convert .env files to Docker Compose, Kubernetes ConfigMap, and Secret YAML.",
    "ENV",
  );
}
