import ToolBreadcrumbSchema from "@/components/ToolBreadcrumbSchema";
import RelatedTools from "@/components/RelatedTools";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolBreadcrumbSchema />
      {children}
      <RelatedTools />
    </>
  );
}
