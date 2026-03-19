import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Kubernetes YAML Validator",
    "Validate K8s manifests for errors, security issues, and best practices",
    "K8s",
  );
}
