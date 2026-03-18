import type { Metadata } from "next";
import ColorConverterTool from "./ColorConverterTool";

export const metadata: Metadata = {
  title: "Color Converter (HEX, RGB, HSL)",
  description:
    "Convert colors between HEX, RGB, and HSL formats instantly. Live color preview included. Free online color converter — no signup required.",
  keywords: [
    "color converter",
    "HEX to RGB",
    "RGB to HSL",
    "color picker online",
    "HEX to HSL",
  ],
  alternates: {
    canonical: "/tools/color-converter",
  },
  openGraph: {
    title: "Color Converter (HEX, RGB, HSL) - FreeSolo Tools",
    description:
      "Convert colors between HEX, RGB, and HSL formats. Free online tool.",
    url: "/tools/color-converter",
  },
};

export default function ColorConverterPage() {
  return <ColorConverterTool />;
}
