import type { Metadata } from "next";
import GitCommandBuilderTool from "./GitCommandBuilderTool";

export const metadata: Metadata = {
  title: "Git Command Builder & Cheat Sheet",
  description:
    "Build git commands visually with an interactive builder, or browse a searchable cheat sheet of 80+ commands. Covers branching, merging, rebasing, stashing, tags, and more. Free online tool — no signup required.",
  keywords: [
    "git command builder",
    "git cheat sheet",
    "git commands",
    "git reference",
    "git tutorial",
    "git branch",
    "git merge",
    "git rebase",
    "git stash",
    "git push",
    "git pull",
    "git reset",
    "git cherry-pick",
  ],
  alternates: {
    canonical: "/tools/git-command-builder",
  },
  openGraph: {
    title: "Git Command Builder & Cheat Sheet - DevBolt",
    description:
      "Build git commands visually or browse 80+ commands in a searchable cheat sheet. Free, client-side, no signup.",
    url: "/tools/git-command-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Git Command Builder & Cheat Sheet",
  url: "https://devbolt.dev/tools/git-command-builder",
  description:
    "Build git commands visually with an interactive builder, or browse a searchable cheat sheet of 80+ commands covering branching, merging, rebasing, stashing, tags, and more.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function GitCommandBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GitCommandBuilderTool />
    </>
  );
}
