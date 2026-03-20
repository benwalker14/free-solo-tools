import ToolBreadcrumbSchema from "@/components/ToolBreadcrumbSchema";
import RelatedTools from "@/components/RelatedTools";
import RecentToolTracker from "@/components/RecentToolTracker";
import PrivacyBadge from "@/components/PrivacyBadge";
import QuickAnswer from "@/components/QuickAnswer";
import ToolDemo from "@/components/ToolDemo";
import ToolInsights from "@/components/ToolInsights";
import ToolFAQ from "@/components/ToolFAQ";

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
      <QuickAnswer />
      <ToolDemo />
      {children}
      <ToolInsights />
      <ToolFAQ />
      <RelatedTools />
    </>
  );
}
