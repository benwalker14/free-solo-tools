"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GitEntry {
  command: string;
  description: string;
  example: string;
  dangerous?: boolean;
  buildUrl?: string;
}

interface GitCategory {
  id: string;
  label: string;
  icon: string;
  entries: GitEntry[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const categories: GitCategory[] = [
  {
    id: "setup",
    label: "Setup & Config",
    icon: "\u2699\ufe0f",
    entries: [
      {
        command: "git init",
        description: "Initialize a new Git repository in the current directory",
        example: "$ git init\nInitialized empty Git repository in /project/.git/",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git clone <url>",
        description: "Clone a remote repository to your local machine",
        example: "$ git clone https://github.com/user/repo.git\nCloning into 'repo'...",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: 'git config user.name "<name>"',
        description: "Set your name for commits in this repository",
        example: '$ git config user.name "Jane Doe"',
      },
      {
        command: 'git config user.email "<email>"',
        description: "Set your email for commits in this repository",
        example: '$ git config user.email "jane@example.com"',
      },
      {
        command: "git config --list",
        description: "List all Git configuration settings",
        example: "$ git config --list\nuser.name=Jane Doe\nuser.email=jane@example.com\ncore.editor=vim",
      },
      {
        command: 'git config --global core.editor "<editor>"',
        description: "Set the default text editor for Git globally",
        example: '$ git config --global core.editor "code --wait"',
      },
      {
        command: 'git config --global init.defaultBranch <name>',
        description: "Set the default branch name for new repositories",
        example: "$ git config --global init.defaultBranch main",
      },
      {
        command: "git remote add <name> <url>",
        description: "Add a new remote repository connection",
        example: "$ git remote add origin https://github.com/user/repo.git",
        buildUrl: "/tools/git-command-builder",
      },
    ],
  },
  {
    id: "staging",
    label: "Staging & Commits",
    icon: "\ud83d\udce6",
    entries: [
      {
        command: "git status",
        description: "Show the working tree status \u2014 staged, unstaged, and untracked files",
        example: "$ git status\nOn branch main\nChanges not staged for commit:\n  modified:   src/index.ts",
      },
      {
        command: "git add <file>",
        description: "Stage a specific file for the next commit",
        example: "$ git add src/index.ts",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git add -A",
        description: "Stage all changes (new, modified, and deleted files)",
        example: "$ git add -A\n# Stages everything in the entire working tree",
      },
      {
        command: "git add -p",
        description: "Interactively stage hunks of changes \u2014 review each change before staging",
        example: "$ git add -p\nStage this hunk [y,n,q,a,d,s,e,?]? y",
      },
      {
        command: 'git commit -m "<message>"',
        description: "Create a commit with a message describing the changes",
        example: '$ git commit -m "feat: add user authentication"\n[main a1b2c3d] feat: add user authentication',
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git commit --amend",
        description: "Modify the most recent commit (message or content)",
        example: "$ git commit --amend\n# Opens editor to modify the last commit message",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git diff",
        description: "Show unstaged changes between working directory and index",
        example: "$ git diff\n-const x = 1;\n+const x = 2;",
      },
      {
        command: "git diff --staged",
        description: "Show changes staged for the next commit",
        example: "$ git diff --staged\n# Shows only changes that have been git add'd",
      },
      {
        command: "git reset HEAD <file>",
        description: "Unstage a file while keeping changes in the working directory",
        example: "$ git reset HEAD src/index.ts\nUnstaged changes after reset:\nM  src/index.ts",
      },
      {
        command: "git rm --cached <file>",
        description: "Remove a file from staging/tracking without deleting it from disk",
        example: "$ git rm --cached .env\nrm '.env'\n# File stays on disk but is untracked",
      },
    ],
  },
  {
    id: "branching",
    label: "Branching",
    icon: "\ud83c\udf3f",
    entries: [
      {
        command: "git branch",
        description: "List all local branches; the current branch is highlighted with *",
        example: "$ git branch\n* main\n  feature/login\n  bugfix/header",
      },
      {
        command: "git branch <name>",
        description: "Create a new branch (does not switch to it)",
        example: "$ git branch feature/auth\n# Branch created but still on current branch",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git branch -d <name>",
        description: "Delete a branch that has been fully merged",
        example: "$ git branch -d feature/auth\nDeleted branch feature/auth (was a1b2c3d).",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git branch -D <name>",
        description: "Force-delete a branch regardless of merge status",
        example: "$ git branch -D experiment\nDeleted branch experiment (was e4f5g6h).",
        dangerous: true,
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git checkout <branch>",
        description: "Switch to an existing branch (legacy command)",
        example: "$ git checkout main\nSwitched to branch 'main'",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git checkout -b <name>",
        description: "Create a new branch and switch to it immediately",
        example: "$ git checkout -b feature/auth\nSwitched to a new branch 'feature/auth'",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git switch <branch>",
        description: "Switch to an existing branch (modern replacement for checkout)",
        example: "$ git switch main\nSwitched to branch 'main'",
      },
      {
        command: "git switch -c <name>",
        description: "Create a new branch and switch to it (modern syntax)",
        example: "$ git switch -c feature/auth\nSwitched to a new branch 'feature/auth'",
      },
    ],
  },
  {
    id: "merging",
    label: "Merging & Rebasing",
    icon: "\ud83d\udd00",
    entries: [
      {
        command: "git merge <branch>",
        description: "Merge the specified branch into the current branch",
        example: "$ git merge feature/auth\nMerge made by the 'ort' strategy.\n 2 files changed, 45 insertions(+)",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git merge --no-ff <branch>",
        description: "Merge with a merge commit even if fast-forward is possible",
        example: "$ git merge --no-ff feature/auth\nMerge made by the 'ort' strategy.",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git merge --abort",
        description: "Abort a merge in progress and restore the pre-merge state",
        example: "$ git merge --abort\n# Working directory restored to state before merge",
      },
      {
        command: "git rebase <branch>",
        description: "Replay current branch commits on top of the specified branch",
        example: "$ git rebase main\nSuccessfully rebased and updated refs/heads/feature.",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git rebase --onto <new> <old> <branch>",
        description: "Rebase a range of commits onto a new base",
        example: "$ git rebase --onto main server client\n# Replays client commits (since server) onto main",
      },
      {
        command: "git rebase --abort",
        description: "Abort a rebase in progress and restore the original state",
        example: "$ git rebase --abort\n# Returns to the state before rebase started",
      },
      {
        command: "git cherry-pick <commit>",
        description: "Apply a specific commit from another branch to the current branch",
        example: "$ git cherry-pick a1b2c3d\n[main d4e5f6g] feat: add login\n 1 file changed, 12 insertions(+)",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git cherry-pick --no-commit <commit>",
        description: "Apply a commit's changes without creating a new commit",
        example: "$ git cherry-pick --no-commit a1b2c3d\n# Changes applied to working directory, not committed",
      },
    ],
  },
  {
    id: "remote",
    label: "Remote",
    icon: "\u2601\ufe0f",
    entries: [
      {
        command: "git remote -v",
        description: "List all remote connections with their URLs",
        example: "$ git remote -v\norigin  https://github.com/user/repo.git (fetch)\norigin  https://github.com/user/repo.git (push)",
      },
      {
        command: "git fetch",
        description: "Download objects and refs from the default remote without merging",
        example: "$ git fetch\nremote: Enumerating objects: 5, done.\nFrom https://github.com/user/repo",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git fetch --all",
        description: "Fetch from all configured remote repositories",
        example: "$ git fetch --all\nFetching origin\nFetching upstream",
      },
      {
        command: "git pull",
        description: "Fetch from remote and merge into the current branch",
        example: "$ git pull\nUpdating a1b2c3d..d4e5f6g\nFast-forward\n 2 files changed, 10 insertions(+)",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git pull --rebase",
        description: "Fetch and rebase (instead of merge) the current branch on top of remote",
        example: "$ git pull --rebase\nSuccessfully rebased and updated refs/heads/main.",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git push",
        description: "Upload local commits to the default remote branch",
        example: "$ git push\nTo https://github.com/user/repo.git\n   a1b2c3d..d4e5f6g  main -> main",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git push -u origin <branch>",
        description: "Push a branch and set the upstream tracking reference",
        example: "$ git push -u origin feature/auth\nBranch 'feature/auth' set up to track 'origin/feature/auth'.",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git push --force-with-lease",
        description: "Force-push only if the remote branch matches your local expectation",
        example: "$ git push --force-with-lease\n# Safer than --force: fails if someone else pushed",
        dangerous: true,
        buildUrl: "/tools/git-command-builder",
      },
    ],
  },
  {
    id: "stash",
    label: "Stash",
    icon: "\ud83d\udccb",
    entries: [
      {
        command: "git stash",
        description: "Temporarily save uncommitted changes and clean the working directory",
        example: "$ git stash\nSaved working directory and index state WIP on main: a1b2c3d",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: 'git stash save "<message>"',
        description: "Stash changes with a descriptive message for easy identification",
        example: '$ git stash save "WIP: auth refactor"\nSaved working directory and index state On main: WIP: auth refactor',
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git stash list",
        description: "List all stashed change sets",
        example: "$ git stash list\nstash@{0}: WIP on main: a1b2c3d\nstash@{1}: On main: WIP: auth refactor",
      },
      {
        command: "git stash pop",
        description: "Apply the most recent stash and remove it from the stash list",
        example: "$ git stash pop\nOn branch main\nChanges not staged for commit:\n  modified:   src/index.ts\nDropped refs/stash@{0}",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git stash apply",
        description: "Apply the most recent stash but keep it in the stash list",
        example: "$ git stash apply\n# Changes restored, stash entry preserved",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git stash drop",
        description: "Remove the most recent stash entry without applying it",
        example: "$ git stash drop\nDropped refs/stash@{0} (a1b2c3d4e5f6g7h8)",
      },
    ],
  },
  {
    id: "inspection",
    label: "Inspection & Comparison",
    icon: "\ud83d\udd0d",
    entries: [
      {
        command: "git log",
        description: "Show the commit history for the current branch",
        example: "$ git log\ncommit a1b2c3d (HEAD -> main)\nAuthor: Jane Doe\nDate:   Mon Mar 19\n\n    feat: add auth",
      },
      {
        command: "git log --oneline --graph",
        description: "Compact commit history with ASCII branch graph",
        example: "$ git log --oneline --graph\n* d4e5f6g (HEAD -> main) merge feature\n|\\  \n| * a1b2c3d feat: add login\n|/  \n* 7h8i9j0 initial commit",
      },
      {
        command: "git log -p",
        description: "Show commit history with the full diff for each commit",
        example: "$ git log -p\ncommit a1b2c3d\n--- a/index.ts\n+++ b/index.ts\n+const auth = true;",
      },
      {
        command: "git show <commit>",
        description: "Display details and diff of a specific commit",
        example: "$ git show a1b2c3d\ncommit a1b2c3d\nAuthor: Jane Doe\n\n    feat: add auth\n\ndiff --git ...",
      },
      {
        command: "git diff <branch1>..<branch2>",
        description: "Show differences between two branches",
        example: "$ git diff main..feature/auth\n-old code\n+new code",
      },
      {
        command: "git blame <file>",
        description: "Show who last modified each line of a file and when",
        example: "$ git blame src/index.ts\na1b2c3d (Jane 2026-03-19 10:30) const app = express();",
      },
      {
        command: "git reflog",
        description: "Show a log of all reference updates (branches, HEAD moves, resets)",
        example: "$ git reflog\na1b2c3d HEAD@{0}: commit: feat: add auth\n7h8i9j0 HEAD@{1}: checkout: moving to main",
      },
      {
        command: "git shortlog -sn",
        description: "Summarize commits by author, sorted by number of contributions",
        example: "$ git shortlog -sn\n    42  Jane Doe\n    28  John Smith\n     7  Bot",
      },
    ],
  },
  {
    id: "undo",
    label: "Undo & Recovery",
    icon: "\u21a9\ufe0f",
    entries: [
      {
        command: "git reset --soft HEAD~1",
        description: "Undo the last commit but keep all changes staged",
        example: "$ git reset --soft HEAD~1\n# Commit undone, changes remain in staging area",
      },
      {
        command: "git reset --mixed HEAD~1",
        description: "Undo the last commit and unstage changes (default reset mode)",
        example: "$ git reset --mixed HEAD~1\nUnstaged changes after reset:\nM  src/index.ts",
      },
      {
        command: "git reset --hard HEAD~1",
        description: "Undo the last commit and discard all changes permanently",
        example: "$ git reset --hard HEAD~1\nHEAD is now at 7h8i9j0 previous commit",
        dangerous: true,
      },
      {
        command: "git revert <commit>",
        description: "Create a new commit that undoes the specified commit's changes",
        example: "$ git revert a1b2c3d\n[main e5f6g7h] Revert \"feat: add auth\"",
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git checkout -- <file>",
        description: "Discard changes in a file, restoring it to the last committed state",
        example: "$ git checkout -- src/index.ts\n# File restored to last committed version",
        dangerous: true,
      },
      {
        command: "git restore <file>",
        description: "Discard working directory changes (modern replacement for checkout --)",
        example: "$ git restore src/index.ts\n# File restored to last committed version",
        dangerous: true,
      },
      {
        command: "git clean -fd",
        description: "Remove all untracked files and directories from the working tree",
        example: "$ git clean -fd\nRemoving build/\nRemoving temp.log",
        dangerous: true,
      },
      {
        command: "git reflog + git reset --hard <hash>",
        description: "Recover a lost commit by finding it in reflog and resetting to it",
        example: "$ git reflog\na1b2c3d HEAD@{3}: commit: lost work\n$ git reset --hard a1b2c3d\nHEAD is now at a1b2c3d lost work",
        dangerous: true,
      },
    ],
  },
  {
    id: "tags",
    label: "Tags",
    icon: "\ud83c\udff7\ufe0f",
    entries: [
      {
        command: "git tag",
        description: "List all tags in the repository",
        example: "$ git tag\nv1.0.0\nv1.1.0\nv2.0.0",
      },
      {
        command: 'git tag -a <name> -m "<message>"',
        description: "Create an annotated tag with a message at the current commit",
        example: '$ git tag -a v1.0.0 -m "Release 1.0.0"\n# Annotated tag created with metadata',
        buildUrl: "/tools/git-command-builder",
      },
      {
        command: "git push --tags",
        description: "Push all local tags to the remote repository",
        example: "$ git push --tags\n * [new tag]  v1.0.0 -> v1.0.0",
      },
      {
        command: "git tag -d <name>",
        description: "Delete a tag locally",
        example: "$ git tag -d v1.0.0\nDeleted tag 'v1.0.0' (was a1b2c3d)",
      },
      {
        command: "git push --delete origin <tag>",
        description: "Delete a tag from the remote repository",
        example: "$ git push --delete origin v1.0.0\nTo https://github.com/user/repo.git\n - [deleted]  v1.0.0",
        dangerous: true,
      },
    ],
  },
  {
    id: "submodules",
    label: "Submodules",
    icon: "\ud83d\udce6",
    entries: [
      {
        command: "git submodule add <url> <path>",
        description: "Add a Git repository as a submodule at the specified path",
        example: "$ git submodule add https://github.com/lib/utils.git vendor/utils\nCloning into 'vendor/utils'...",
      },
      {
        command: "git submodule init",
        description: "Initialize submodule configuration from .gitmodules after cloning",
        example: "$ git submodule init\nSubmodule 'vendor/utils' registered for path 'vendor/utils'",
      },
      {
        command: "git submodule update",
        description: "Fetch and checkout the committed submodule versions",
        example: "$ git submodule update\nCloning into 'vendor/utils'...\nSubmodule path 'vendor/utils': checked out 'a1b2c3d'",
      },
      {
        command: "git submodule update --remote",
        description: "Update submodules to the latest commit on their tracked remote branch",
        example: "$ git submodule update --remote\nSubmodule path 'vendor/utils': checked out 'd4e5f6g'",
      },
    ],
  },
];

const ALL_CATEGORY_ID = "all";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GitCheatSheet() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_ID);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Total entry count
  const totalCount = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.entries.length, 0),
    [],
  );

  // Filtered entries
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return categories
      .filter((cat) => activeCategory === ALL_CATEGORY_ID || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        entries: cat.entries.filter(
          (e) =>
            !q ||
            e.command.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.example.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.entries.length > 0);
  }, [search, activeCategory]);

  const filteredCount = useMemo(
    () => filtered.reduce((sum, cat) => sum + cat.entries.length, 0),
    [filtered],
  );

  // Copy to clipboard
  const handleCopy = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = command;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(null), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/cheatsheets" className="hover:text-orange-600 dark:hover:text-orange-400">
            Cheat Sheets
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Git</span>
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Git Cheat Sheet
        </h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Interactive reference for {totalCount} Git commands organized by category. Search, copy,
          and click &ldquo;Build&rdquo; to construct commands visually in the{" "}
          <Link
            href="/tools/git-command-builder"
            className="font-medium text-orange-600 underline decoration-orange-300 underline-offset-2 hover:text-orange-700 dark:text-orange-400 dark:decoration-orange-700 dark:hover:text-orange-300"
          >
            Git Command Builder
          </Link>
          .
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search commands, descriptions, or examples..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-base text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-orange-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveCategory(ALL_CATEGORY_ID)}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === ALL_CATEGORY_ID
              ? "bg-orange-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          All ({totalCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {cat.icon} {cat.label} ({cat.entries.length})
          </button>
        ))}
      </div>

      {/* Match count */}
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{filteredCount}</span> of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> commands
        {search && (
          <>
            {" "}
            matching &ldquo;
            <span className="font-medium text-orange-600 dark:text-orange-400">{search}</span>
            &rdquo;
          </>
        )}
      </p>

      {/* Categories & Entries */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-8 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-lg font-medium text-gray-900 dark:text-white">No commands found</p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filtered.map((cat) => (
            <section key={cat.id}>
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                {cat.icon} {cat.label}
              </h2>
              <div className="space-y-3">
                {cat.entries.map((entry, idx) => (
                  <div
                    key={`${cat.id}-${idx}`}
                    className="group rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 sm:p-5"
                  >
                    {/* Top row: command + badges + actions */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono text-orange-600 dark:bg-gray-800 dark:text-orange-400 sm:text-base">
                          {entry.command}
                        </code>
                        {entry.dangerous && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-400">
                            Destructive
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(entry.command)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                          title="Copy command"
                        >
                          {copiedCommand === entry.command ? (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </span>
                          )}
                        </button>
                        {entry.buildUrl && (
                          <Link
                            href={entry.buildUrl}
                            className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-900/40"
                          >
                            Build
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {entry.description}
                    </p>

                    {/* Example */}
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-950 px-4 py-3 text-xs leading-relaxed text-gray-300 sm:text-sm">
                      <code>{entry.example}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Related Tools */}
      <section className="mt-16 border-t border-gray-200 pt-12 dark:border-gray-800">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Related Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/tools/git-command-builder",
              title: "Git Command Builder",
              description: "Build Git commands visually with an interactive form-based interface",
            },
            {
              href: "/tools/git-diff-viewer",
              title: "Git Diff Viewer",
              description: "View diffs with syntax highlighting and side-by-side comparison",
            },
            {
              href: "/tools/diff-checker",
              title: "Diff Checker",
              description: "Compare any two text files and see differences highlighted",
            },
            {
              href: "/tools/gitignore-generator",
              title: ".gitignore Generator",
              description: "Generate .gitignore files for any language, framework, or IDE",
            },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-orange-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-orange-700"
            >
              <h3 className="mb-1 font-semibold text-gray-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
