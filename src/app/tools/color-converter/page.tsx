import type { Metadata } from "next";
import ColorConverterTool from "./ColorConverterTool";

export const metadata: Metadata = {
  title: "Color Converter (HEX, RGB, HSL) - FreeSolo Tools",
  description:
    "Convert colors between HEX, RGB, and HSL formats. Free online color tool.",
};

export default function ColorConverterPage() {
  return <ColorConverterTool />;
}
