import ToolBreadcrumbSchema from "@/components/ToolBreadcrumbSchema";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolBreadcrumbSchema />
      {children}
    </>
  );
}
