"use client";

import { usePathname } from "next/navigation";
import { tools } from "@/data/tools";

export default function ToolBreadcrumbSchema() {
  const pathname = usePathname();

  // Only render on tool pages (not the /tools index if it existed)
  if (!pathname || !pathname.startsWith("/tools/")) return null;

  const segments = pathname.split("/").filter(Boolean);
  // segments: ["tools", "json-formatter"] or ["tools", "json-formatter", "subpage"]

  const toolSlug = segments[1];
  if (!toolSlug) return null;

  const tool = tools.find((t) => t.href === `/tools/${toolSlug}`);
  const toolName = tool?.title ?? toolSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const items: { name: string; url: string }[] = [
    { name: "DevBolt", url: "https://devbolt.dev" },
    { name: "Tools", url: "https://devbolt.dev" },
    { name: toolName, url: `https://devbolt.dev/tools/${toolSlug}` },
  ];

  // If on a subpage, add the subpage breadcrumb
  if (segments.length >= 3) {
    const subSlug = segments[2];
    const subName = subSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({
      name: subName,
      url: `https://devbolt.dev${pathname}`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}
