import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "Security Headers Generator",
    "Generate HTTP security headers for Nginx, Apache, Vercel, Netlify, and Cloudflare with security scoring.",
    "Security",
  );
}
