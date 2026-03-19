import ToolBreadcrumbSchema from "@/components/ToolBreadcrumbSchema";
import RelatedTools from "@/components/RelatedTools";
import RecentToolTracker from "@/components/RecentToolTracker";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolBreadcrumbSchema />
      <RecentToolTracker />
      {children}
      <RelatedTools />
    </>
  );
}
