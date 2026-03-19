import type { Metadata } from "next";
import GitCheatSheet from "./GitCheatSheet";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "Git Cheat Sheet — Interactive Command Reference",
  description:
    "Complete Git cheat sheet with 75+ commands covering setup, branching, merging, rebasing, stashing, recovery, tags, and submodules. Search, filter by category, copy commands, and build them visually. Free interactive reference — no signup required.",
  keywords: [
    "git cheat sheet",
    "git commands",
    "git reference",
    "git quick reference",
    "git command list",
    "git branch commands",
    "git merge commands",
    "git rebase",
    "git stash",
    "git reset",
    "git push pull",
    "git undo commit",
    "git cheat sheet pdf",
    "git commands with examples",
    "interactive git reference",
  ],
  openGraph: {
    title: "Git Cheat Sheet — Interactive Command Reference | DevBolt",
    description:
      "75+ Git commands organized by category with search, copy, and click-to-build. Covers branching, merging, rebasing, stashing, tags, and recovery.",
    url: `${BASE_URL}/cheatsheets/git`,
    type: "article",
  },
  alternates: {
    canonical: `${BASE_URL}/cheatsheets/git`,
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Git Cheat Sheet — Interactive Command Reference",
  description:
    "Complete Git cheat sheet with 75+ commands covering setup, branching, merging, rebasing, stashing, recovery, tags, and submodules. Search, filter, copy, and build commands visually.",
  datePublished: "2026-03-19",
  publisher: {
    "@type": "Organization",
    name: "DevBolt",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/cheatsheets/git`,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the most common Git commands?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The most common Git commands include: git init (create a repo), git clone (copy a repo), git add (stage changes), git commit (save changes), git push (upload to remote), git pull (download from remote), git branch (manage branches), git checkout/switch (change branches), git merge (combine branches), and git status (check state). These commands cover the core workflow most developers use daily.",
      },
    },
    {
      "@type": "Question",
      name: "How do I undo a git commit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are several ways to undo a Git commit depending on what you need: 1) git reset --soft HEAD~1 undoes the commit but keeps changes staged, 2) git reset --mixed HEAD~1 undoes the commit and unstages changes but keeps them in your working directory, 3) git reset --hard HEAD~1 completely removes the commit and all changes (destructive), 4) git revert HEAD creates a new commit that undoes the previous commit's changes (safe for shared branches). Use --soft or --mixed for local work, and revert for commits already pushed to a shared remote.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between git merge and git rebase?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Git merge and git rebase both integrate changes from one branch into another, but they work differently. Git merge creates a new 'merge commit' that combines the histories of both branches, preserving the complete history. Git rebase replays your commits on top of the target branch, creating a linear history without merge commits. Use merge for shared/public branches to preserve history, and rebase for local/feature branches to keep a clean, linear commit history. Never rebase commits that have been pushed to a shared remote, as it rewrites history and can cause conflicts for other developers.",
      },
    },
    {
      "@type": "Question",
      name: "How do I resolve merge conflicts in Git?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To resolve merge conflicts in Git: 1) Run git status to see which files have conflicts, 2) Open conflicting files and look for conflict markers (<<<<<<< HEAD, =======, >>>>>>> branch-name), 3) Edit the files to keep the changes you want, removing the conflict markers, 4) Stage the resolved files with git add, 5) Complete the merge with git commit. You can also use git mergetool to open a visual merge tool, or git merge --abort to cancel the merge entirely and return to the previous state.",
      },
    },
  ],
};

export default function GitCheatSheetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GitCheatSheet />
    </>
  );
}
