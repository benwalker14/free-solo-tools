import { generateOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return generateOgImage(
    "ESLint to Biome Converter",
    "Convert .eslintrc to biome.json with 100+ rule mappings.",
    "BIO"
  );
}
