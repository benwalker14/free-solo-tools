import ToolBreadcrumbSchema from "@/components/ToolBreadcrumbSchema";
import RelatedTools from "@/components/RelatedTools";
import RecentToolTracker from "@/components/RecentToolTracker";
import PrivacyBadge from "@/components/PrivacyBadge";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolBreadcrumbSchema />
      <RecentToolTracker />
      <PrivacyBadge />
      {children}
      <RelatedTools />
    </>
  );
}
