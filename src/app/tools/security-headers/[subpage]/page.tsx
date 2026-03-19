import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSubpage, toolSubpages } from "@/data/tool-subpages";
import SubpageLayout from "@/components/SubpageLayout";
import SecurityHeadersTool from "../SecurityHeadersTool";

const TOOL_SLUG = "security-headers";

export async function generateStaticParams() {
  return (toolSubpages[TOOL_SLUG] || []).map((sp) => ({ subpage: sp.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subpage: string }>;
}): Promise<Metadata> {
  const { subpage } = await params;
  const data = getSubpage(TOOL_SLUG, subpage);
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: `/tools/${TOOL_SLUG}/${data.slug}` },
    openGraph: {
      title: `${data.metaTitle} - DevBolt`,
      description: data.metaDescription,
      url: `/tools/${TOOL_SLUG}/${data.slug}`,
    },
  };
}

export default async function SubpagePage({
  params,
}: {
  params: Promise<{ subpage: string }>;
}) {
  const { subpage } = await params;
  const data = getSubpage(TOOL_SLUG, subpage);
  if (!data) notFound();
  return (
    <SubpageLayout data={data}>
      <SecurityHeadersTool />
    </SubpageLayout>
  );
}
