import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "JWT Builder & Generator",
    "Build and sign JSON Web Tokens with HMAC, RSA, and ECDSA algorithms. Visual payload editor.",
    "JWT"
  );
}
