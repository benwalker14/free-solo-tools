import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "AI Code Security Scanner",
    "Scan JavaScript and TypeScript code for vulnerabilities — secrets, injection, XSS, SSRF, and more.",
    "Security",
  );
}
