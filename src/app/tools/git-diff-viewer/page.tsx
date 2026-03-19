import type { Metadata } from "next";
import GitDiffViewerTool from "./GitDiffViewerTool";

export const metadata: Metadata = {
  title: "Git Diff Viewer",
  description:
    "Paste unified diff output from git diff and view it with syntax highlighting, line numbers, side-by-side or inline display. Free online diff viewer — no signup required.",
  keywords: [
    "git diff viewer",
    "git diff online",
    "unified diff viewer",
    "diff viewer",
    "view git diff",
    "diff syntax highlighting",
    "side by side diff",
    "git diff renderer",
    "patch viewer",
    "diff output viewer",
  ],
  alternates: {
    canonical: "/tools/git-diff-viewer",
  },
  openGraph: {
    title: "Git Diff Viewer - DevBolt",
    description:
      "Paste unified diff output and view it with syntax highlighting, line numbers, and side-by-side or inline display.",
    url: "/tools/git-diff-viewer",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Git Diff Viewer",
  url: "https://devbolt.dev/tools/git-diff-viewer",
  description:
    "Paste unified diff output from git diff and view it rendered with syntax highlighting, line numbers, and side-by-side or inline display.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function GitDiffViewerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GitDiffViewerTool />
    </>
  );
}
