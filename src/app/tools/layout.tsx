import dynamic from "next/dynamic";
import ToolBreadcrumbSchema from "@/components/ToolBreadcrumbSchema";
import RecentToolTracker from "@/components/RecentToolTracker";
import PrivacyBadge from "@/components/PrivacyBadge";

// Lazy-load client components to code-split their large data imports
// (tool-demos.ts ~107KB, quick-answers.ts ~48KB, tool-faqs.ts ~225KB,
//  tool-insights.ts ~32KB, tools.ts ~30KB)
const QuickAnswer = dynamic(() => import("@/components/QuickAnswer"));
const ToolDemo = dynamic(() => import("@/components/ToolDemo"));
const ToolInsights = dynamic(() => import("@/components/ToolInsights"));
const ToolFAQ = dynamic(() => import("@/components/ToolFAQ"));
const RelatedTools = dynamic(() => import("@/components/RelatedTools"));

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
