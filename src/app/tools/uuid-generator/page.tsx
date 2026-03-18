import type { Metadata } from "next";
import UuidGeneratorTool from "./UuidGeneratorTool";

export const metadata: Metadata = {
  title: "UUID Generator - FreeSolo Tools",
  description:
    "Generate random UUID v4 identifiers. Bulk generation supported.",
};

export default function UuidGeneratorPage() {
  return <UuidGeneratorTool />;
}
