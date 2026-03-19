"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CommandParam {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

interface GitCommand {
  id: string;
  label: string;
  description: string;
  template: (params: Record<string, string>) => string;
  params: CommandParam[];
  category: string;
  dangerous?: boolean;
}

interface CheatSheetEntry {
  command: string;
  description: string;
  example?: string;
}

interface CheatSheetSection {
  title: string;
  icon: string;
  entries: CheatSheetEntry[];
}

// ---------------------------------------------------------------------------
// Tab type
// ---------------------------------------------------------------------------

type Tab = "builder" | "cheatsheet";

// ---------------------------------------------------------------------------
// Command Builder Data
// ---------------------------------------------------------------------------

const GIT_COMMANDS: GitCommand[] = [
  // --- Setup & Config ---
  {
    id: "init",
    label: "Initialize Repository",
    description: "Create a new Git repository",
    template: (p) =>
      `git init${p.directory ? ` ${p.directory}` : ""}`,
    params: [
      { name: "directory", label: "Directory (optional)", placeholder: "my-project" },
    ],
    category: "Setup",
  },
  {
    id: "clone",
    label: "Clone Repository",
    description: "Clone a remote repository",
    template: (p) =>
      `git clone${p.depth ? ` --depth ${p.depth}` : ""}${p.branch ? ` --branch ${p.branch}` : ""} ${p.url || "<url>"}${p.directory ? ` ${p.directory}` : ""}`,
    params: [
      { name: "url", label: "Repository URL", placeholder: "https://github.com/user/repo.git", required: true },
      { name: "directory", label: "Target directory (optional)", placeholder: "my-repo" },
      { name: "branch", label: "Branch (optional)", placeholder: "main" },
      { name: "depth", label: "Shallow depth (optional)", placeholder: "1" },
    ],
    category: "Setup",
  },
  {
    id: "config-user",
    label: "Set User Name & Email",
    description: "Configure your Git identity",
    template: (p) => {
      const scope = p.scope === "global" ? " --global" : "";
      const lines: string[] = [];
      if (p.name) lines.push(`git config${scope} user.name "${p.name}"`);
      if (p.email) lines.push(`git config${scope} user.email "${p.email}"`);
      return lines.length ? lines.join("\n") : `git config${scope} user.name "<name>"`;
    },
    params: [
      { name: "name", label: "Name", placeholder: "John Doe" },
      { name: "email", label: "Email", placeholder: "john@example.com" },
      {
        name: "scope",
        label: "Scope",
        placeholder: "",
        type: "select",
        options: [
          { value: "global", label: "Global (all repos)" },
          { value: "local", label: "Local (this repo)" },
        ],
        defaultValue: "global",
      },
    ],
    category: "Setup",
  },
  {
    id: "remote-add",
    label: "Add Remote",
    description: "Add a new remote repository",
    template: (p) =>
      `git remote add ${p.name || "origin"} ${p.url || "<url>"}`,
    params: [
      { name: "name", label: "Remote name", placeholder: "origin", defaultValue: "origin" },
      { name: "url", label: "Remote URL", placeholder: "https://github.com/user/repo.git", required: true },
    ],
    category: "Setup",
  },
  // --- Staging & Committing ---
  {
    id: "add",
    label: "Stage Files",
    description: "Add files to the staging area",
    template: (p) => {
      if (p.mode === "all") return "git add -A";
      if (p.mode === "patch") return "git add -p";
      return `git add ${p.files || "."}`;
    },
    params: [
      {
        name: "mode",
        label: "Mode",
        placeholder: "",
        type: "select",
        options: [
          { value: "files", label: "Specific files" },
          { value: "all", label: "All changes (-A)" },
          { value: "patch", label: "Interactive patch (-p)" },
        ],
        defaultValue: "files",
      },
      { name: "files", label: "File paths (space-separated)", placeholder: "src/index.ts README.md" },
    ],
    category: "Staging",
  },
  {
    id: "commit",
    label: "Commit Changes",
    description: "Record changes to the repository",
    template: (p) => {
      let cmd = "git commit";
      if (p.amend === "yes") cmd += " --amend";
      if (p.message) cmd += ` -m "${p.message}"`;
      if (p.noedit === "yes" && p.amend === "yes") cmd += " --no-edit";
      return cmd;
    },
    params: [
      { name: "message", label: "Commit message", placeholder: "feat: add user authentication", required: true },
      {
        name: "amend",
        label: "Amend last commit?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No — new commit" },
          { value: "yes", label: "Yes — amend previous" },
        ],
        defaultValue: "no",
      },
      {
        name: "noedit",
        label: "Keep original message? (amend only)",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "Edit message" },
          { value: "yes", label: "Keep message (--no-edit)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Staging",
  },
  {
    id: "stash",
    label: "Stash Changes",
    description: "Temporarily save uncommitted changes",
    template: (p) => {
      if (p.action === "save") return `git stash push${p.message ? ` -m "${p.message}"` : ""}${p.include === "untracked" ? " --include-untracked" : ""}`;
      if (p.action === "pop") return "git stash pop";
      if (p.action === "apply") return `git stash apply${p.index ? ` stash@{${p.index}}` : ""}`;
      if (p.action === "list") return "git stash list";
      if (p.action === "drop") return `git stash drop${p.index ? ` stash@{${p.index}}` : ""}`;
      return "git stash";
    },
    params: [
      {
        name: "action",
        label: "Action",
        placeholder: "",
        type: "select",
        options: [
          { value: "save", label: "Save (push)" },
          { value: "pop", label: "Pop (apply + drop)" },
          { value: "apply", label: "Apply (keep in stash)" },
          { value: "list", label: "List stashes" },
          { value: "drop", label: "Drop stash" },
        ],
        defaultValue: "save",
      },
      { name: "message", label: "Stash message (save only)", placeholder: "WIP: feature login" },
      {
        name: "include",
        label: "Include untracked? (save only)",
        placeholder: "",
        type: "select",
        options: [
          { value: "tracked", label: "Tracked only" },
          { value: "untracked", label: "Include untracked (-u)" },
        ],
        defaultValue: "tracked",
      },
      { name: "index", label: "Stash index (apply/drop)", placeholder: "0" },
    ],
    category: "Staging",
  },
  // --- Branching ---
  {
    id: "branch-create",
    label: "Create Branch",
    description: "Create and optionally switch to a new branch",
    template: (p) => {
      const name = p.name || "<branch-name>";
      if (p.switch === "yes") return `git checkout -b ${name}${p.from ? ` ${p.from}` : ""}`;
      return `git branch ${name}${p.from ? ` ${p.from}` : ""}`;
    },
    params: [
      { name: "name", label: "Branch name", placeholder: "feature/user-auth", required: true },
      {
        name: "switch",
        label: "Switch to branch?",
        placeholder: "",
        type: "select",
        options: [
          { value: "yes", label: "Yes (checkout -b)" },
          { value: "no", label: "No (just create)" },
        ],
        defaultValue: "yes",
      },
      { name: "from", label: "Base branch/commit (optional)", placeholder: "main" },
    ],
    category: "Branching",
  },
  {
    id: "branch-delete",
    label: "Delete Branch",
    description: "Remove a local or remote branch",
    template: (p) => {
      const name = p.name || "<branch-name>";
      if (p.scope === "remote") return `git push ${p.remote || "origin"} --delete ${name}`;
      if (p.force === "yes") return `git branch -D ${name}`;
      return `git branch -d ${name}`;
    },
    params: [
      { name: "name", label: "Branch name", placeholder: "feature/old-feature", required: true },
      {
        name: "scope",
        label: "Local or remote?",
        placeholder: "",
        type: "select",
        options: [
          { value: "local", label: "Local" },
          { value: "remote", label: "Remote" },
        ],
        defaultValue: "local",
      },
      {
        name: "force",
        label: "Force delete? (local only)",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No (safe -d)" },
          { value: "yes", label: "Yes (force -D)" },
        ],
        defaultValue: "no",
      },
      { name: "remote", label: "Remote name (remote only)", placeholder: "origin", defaultValue: "origin" },
    ],
    category: "Branching",
    dangerous: true,
  },
  {
    id: "checkout",
    label: "Switch Branch",
    description: "Switch to an existing branch or commit",
    template: (p) =>
      `git checkout ${p.target || "<branch>"}`,
    params: [
      { name: "target", label: "Branch or commit", placeholder: "main", required: true },
    ],
    category: "Branching",
  },
  // --- Merging & Rebasing ---
  {
    id: "merge",
    label: "Merge Branch",
    description: "Merge another branch into the current branch",
    template: (p) => {
      let cmd = "git merge";
      if (p.strategy === "no-ff") cmd += " --no-ff";
      if (p.strategy === "squash") cmd += " --squash";
      if (p.strategy === "ff-only") cmd += " --ff-only";
      cmd += ` ${p.branch || "<branch>"}`;
      return cmd;
    },
    params: [
      { name: "branch", label: "Branch to merge", placeholder: "feature/user-auth", required: true },
      {
        name: "strategy",
        label: "Merge strategy",
        placeholder: "",
        type: "select",
        options: [
          { value: "default", label: "Default (fast-forward if possible)" },
          { value: "no-ff", label: "No fast-forward (always create merge commit)" },
          { value: "squash", label: "Squash (combine all commits)" },
          { value: "ff-only", label: "Fast-forward only (fail if not possible)" },
        ],
        defaultValue: "default",
      },
    ],
    category: "Merging",
  },
  {
    id: "rebase",
    label: "Rebase",
    description: "Reapply commits on top of another base",
    template: (p) => {
      let cmd = "git rebase";
      if (p.interactive === "yes") cmd += " -i";
      cmd += ` ${p.onto || "<branch>"}`;
      return cmd;
    },
    params: [
      { name: "onto", label: "Rebase onto", placeholder: "main", required: true },
      {
        name: "interactive",
        label: "Interactive rebase?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes (-i)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Merging",
  },
  {
    id: "cherry-pick",
    label: "Cherry-pick",
    description: "Apply specific commits from another branch",
    template: (p) => {
      let cmd = "git cherry-pick";
      if (p.noedit === "yes") cmd += " --no-edit";
      cmd += ` ${p.commit || "<commit-hash>"}`;
      return cmd;
    },
    params: [
      { name: "commit", label: "Commit hash(es)", placeholder: "abc1234", required: true },
      {
        name: "noedit",
        label: "Keep original message?",
        placeholder: "",
        type: "select",
        options: [
          { value: "yes", label: "Yes (--no-edit)" },
          { value: "no", label: "No (edit message)" },
        ],
        defaultValue: "yes",
      },
    ],
    category: "Merging",
  },
  // --- Remote ---
  {
    id: "push",
    label: "Push",
    description: "Upload local commits to a remote",
    template: (p) => {
      let cmd = "git push";
      if (p.setUpstream === "yes") cmd += " -u";
      if (p.force === "force") cmd += " --force";
      if (p.force === "force-with-lease") cmd += " --force-with-lease";
      cmd += ` ${p.remote || "origin"}`;
      if (p.branch) cmd += ` ${p.branch}`;
      return cmd;
    },
    params: [
      { name: "remote", label: "Remote", placeholder: "origin", defaultValue: "origin" },
      { name: "branch", label: "Branch", placeholder: "main" },
      {
        name: "setUpstream",
        label: "Set upstream (-u)?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes (-u)" },
        ],
        defaultValue: "no",
      },
      {
        name: "force",
        label: "Force push?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "force-with-lease", label: "Force with lease (safer)" },
          { value: "force", label: "Force (dangerous)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Remote",
  },
  {
    id: "pull",
    label: "Pull",
    description: "Fetch and merge remote changes",
    template: (p) => {
      let cmd = "git pull";
      if (p.rebase === "yes") cmd += " --rebase";
      cmd += ` ${p.remote || "origin"}`;
      if (p.branch) cmd += ` ${p.branch}`;
      return cmd;
    },
    params: [
      { name: "remote", label: "Remote", placeholder: "origin", defaultValue: "origin" },
      { name: "branch", label: "Branch", placeholder: "main" },
      {
        name: "rebase",
        label: "Rebase instead of merge?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No (merge)" },
          { value: "yes", label: "Yes (--rebase)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Remote",
  },
  {
    id: "fetch",
    label: "Fetch",
    description: "Download remote changes without merging",
    template: (p) => {
      let cmd = "git fetch";
      if (p.prune === "yes") cmd += " --prune";
      if (p.all === "yes") cmd += " --all";
      else cmd += ` ${p.remote || "origin"}`;
      return cmd;
    },
    params: [
      { name: "remote", label: "Remote", placeholder: "origin", defaultValue: "origin" },
      {
        name: "all",
        label: "All remotes?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes (--all)" },
        ],
        defaultValue: "no",
      },
      {
        name: "prune",
        label: "Prune deleted branches?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes (--prune)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Remote",
  },
  // --- Inspection ---
  {
    id: "log",
    label: "View Log",
    description: "Show commit history",
    template: (p) => {
      let cmd = "git log";
      if (p.format === "oneline") cmd += " --oneline";
      if (p.format === "graph") cmd += " --oneline --graph --all";
      if (p.format === "short") cmd += " --pretty=format:\"%h %s (%an, %ar)\"";
      if (p.count) cmd += ` -n ${p.count}`;
      if (p.author) cmd += ` --author="${p.author}"`;
      if (p.file) cmd += ` -- ${p.file}`;
      return cmd;
    },
    params: [
      {
        name: "format",
        label: "Format",
        placeholder: "",
        type: "select",
        options: [
          { value: "default", label: "Default (full)" },
          { value: "oneline", label: "One line" },
          { value: "graph", label: "Graph (visual branches)" },
          { value: "short", label: "Short (hash, message, author)" },
        ],
        defaultValue: "oneline",
      },
      { name: "count", label: "Number of commits", placeholder: "10" },
      { name: "author", label: "Filter by author", placeholder: "John" },
      { name: "file", label: "Filter by file path", placeholder: "src/index.ts" },
    ],
    category: "Inspection",
  },
  {
    id: "diff",
    label: "Show Diff",
    description: "Show changes between commits, branches, or working tree",
    template: (p) => {
      let cmd = "git diff";
      if (p.staged === "yes") cmd += " --staged";
      if (p.stat === "yes") cmd += " --stat";
      if (p.target) cmd += ` ${p.target}`;
      if (p.file) cmd += ` -- ${p.file}`;
      return cmd;
    },
    params: [
      {
        name: "staged",
        label: "Staged changes?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "Unstaged (working tree)" },
          { value: "yes", label: "Staged (--staged)" },
        ],
        defaultValue: "no",
      },
      { name: "target", label: "Compare to (branch/commit)", placeholder: "main" },
      { name: "file", label: "Specific file", placeholder: "src/index.ts" },
      {
        name: "stat",
        label: "Summary only?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "Full diff" },
          { value: "yes", label: "Stats only (--stat)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Inspection",
  },
  {
    id: "status",
    label: "Show Status",
    description: "Show the working tree status",
    template: (p) => {
      let cmd = "git status";
      if (p.short === "yes") cmd += " -s";
      return cmd;
    },
    params: [
      {
        name: "short",
        label: "Short format?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No (verbose)" },
          { value: "yes", label: "Yes (-s)" },
        ],
        defaultValue: "no",
      },
    ],
    category: "Inspection",
  },
  {
    id: "blame",
    label: "Blame",
    description: "Show who last modified each line of a file",
    template: (p) => {
      let cmd = "git blame";
      if (p.lines) cmd += ` -L ${p.lines}`;
      cmd += ` ${p.file || "<file>"}`;
      return cmd;
    },
    params: [
      { name: "file", label: "File path", placeholder: "src/index.ts", required: true },
      { name: "lines", label: "Line range (optional)", placeholder: "10,20" },
    ],
    category: "Inspection",
  },
  // --- Undo & Fix ---
  {
    id: "reset",
    label: "Reset",
    description: "Undo commits or unstage files",
    template: (p) => {
      if (p.mode === "unstage") return `git reset HEAD ${p.file || "<file>"}`;
      let cmd = "git reset";
      if (p.mode === "soft") cmd += " --soft";
      if (p.mode === "mixed") cmd += " --mixed";
      if (p.mode === "hard") cmd += " --hard";
      cmd += ` ${p.target || "HEAD~1"}`;
      return cmd;
    },
    params: [
      {
        name: "mode",
        label: "Reset mode",
        placeholder: "",
        type: "select",
        options: [
          { value: "unstage", label: "Unstage file(s)" },
          { value: "soft", label: "Soft (keep changes staged)" },
          { value: "mixed", label: "Mixed (keep changes unstaged)" },
          { value: "hard", label: "Hard (discard all changes)" },
        ],
        defaultValue: "soft",
      },
      { name: "target", label: "Target (commit/HEAD~N)", placeholder: "HEAD~1" },
      { name: "file", label: "File (unstage only)", placeholder: "src/index.ts" },
    ],
    category: "Undo",
    dangerous: true,
  },
  {
    id: "revert",
    label: "Revert Commit",
    description: "Create a new commit that undoes a previous commit",
    template: (p) => {
      let cmd = "git revert";
      if (p.noedit === "yes") cmd += " --no-edit";
      cmd += ` ${p.commit || "<commit-hash>"}`;
      return cmd;
    },
    params: [
      { name: "commit", label: "Commit to revert", placeholder: "abc1234", required: true },
      {
        name: "noedit",
        label: "Skip editor?",
        placeholder: "",
        type: "select",
        options: [
          { value: "yes", label: "Yes (--no-edit)" },
          { value: "no", label: "No (edit message)" },
        ],
        defaultValue: "yes",
      },
    ],
    category: "Undo",
  },
  {
    id: "restore",
    label: "Restore File",
    description: "Discard changes in a file or restore from a commit",
    template: (p) => {
      let cmd = "git restore";
      if (p.staged === "yes") cmd += " --staged";
      if (p.source) cmd += ` --source=${p.source}`;
      cmd += ` ${p.file || "<file>"}`;
      return cmd;
    },
    params: [
      { name: "file", label: "File path", placeholder: "src/index.ts", required: true },
      {
        name: "staged",
        label: "Unstage (restore --staged)?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No (discard working tree changes)" },
          { value: "yes", label: "Yes (unstage)" },
        ],
        defaultValue: "no",
      },
      { name: "source", label: "Source commit (optional)", placeholder: "HEAD~1" },
    ],
    category: "Undo",
  },
  // --- Tags ---
  {
    id: "tag",
    label: "Create Tag",
    description: "Mark a specific commit with a tag",
    template: (p) => {
      const name = p.name || "<tag-name>";
      if (p.type === "annotated") return `git tag -a ${name} -m "${p.message || "Release " + name}"${p.commit ? ` ${p.commit}` : ""}`;
      return `git tag ${name}${p.commit ? ` ${p.commit}` : ""}`;
    },
    params: [
      { name: "name", label: "Tag name", placeholder: "v1.0.0", required: true },
      {
        name: "type",
        label: "Tag type",
        placeholder: "",
        type: "select",
        options: [
          { value: "annotated", label: "Annotated (recommended)" },
          { value: "lightweight", label: "Lightweight" },
        ],
        defaultValue: "annotated",
      },
      { name: "message", label: "Message (annotated only)", placeholder: "Release v1.0.0" },
      { name: "commit", label: "Commit (optional, defaults to HEAD)", placeholder: "abc1234" },
    ],
    category: "Tags",
  },
  {
    id: "tag-push",
    label: "Push Tags",
    description: "Push tags to a remote repository",
    template: (p) => {
      if (p.all === "yes") return `git push ${p.remote || "origin"} --tags`;
      return `git push ${p.remote || "origin"} ${p.name || "<tag-name>"}`;
    },
    params: [
      { name: "remote", label: "Remote", placeholder: "origin", defaultValue: "origin" },
      {
        name: "all",
        label: "Push all tags?",
        placeholder: "",
        type: "select",
        options: [
          { value: "no", label: "No (specific tag)" },
          { value: "yes", label: "Yes (--tags)" },
        ],
        defaultValue: "no",
      },
      { name: "name", label: "Tag name (specific)", placeholder: "v1.0.0" },
    ],
    category: "Tags",
  },
];

const BUILDER_CATEGORIES = [...new Set(GIT_COMMANDS.map((c) => c.category))];

// ---------------------------------------------------------------------------
// Cheat Sheet Data
// ---------------------------------------------------------------------------

const CHEAT_SHEET: CheatSheetSection[] = [
  {
    title: "Setup & Configuration",
    icon: "⚙",
    entries: [
      { command: "git init", description: "Initialize a new repository" },
      { command: "git clone <url>", description: "Clone a remote repository" },
      { command: 'git config --global user.name "Name"', description: "Set your name globally" },
      { command: 'git config --global user.email "email"', description: "Set your email globally" },
      { command: "git config --list", description: "List all configuration settings" },
      { command: "git remote -v", description: "Show remote repositories" },
      { command: "git remote add origin <url>", description: "Add a new remote" },
    ],
  },
  {
    title: "Staging & Committing",
    icon: "📦",
    entries: [
      { command: "git status", description: "Show working tree status" },
      { command: "git add <file>", description: "Stage specific file(s)" },
      { command: "git add -A", description: "Stage all changes" },
      { command: "git add -p", description: "Interactively stage hunks" },
      { command: 'git commit -m "message"', description: "Commit staged changes" },
      { command: "git commit --amend", description: "Amend the last commit" },
      { command: "git reset HEAD <file>", description: "Unstage a file" },
    ],
  },
  {
    title: "Branching",
    icon: "🌿",
    entries: [
      { command: "git branch", description: "List local branches" },
      { command: "git branch -a", description: "List all branches (local + remote)" },
      { command: "git branch <name>", description: "Create a new branch" },
      { command: "git checkout <branch>", description: "Switch to a branch" },
      { command: "git checkout -b <name>", description: "Create and switch to a new branch" },
      { command: "git switch <branch>", description: "Switch branches (modern)" },
      { command: "git switch -c <name>", description: "Create and switch (modern)" },
      { command: "git branch -d <name>", description: "Delete a merged branch" },
      { command: "git branch -D <name>", description: "Force-delete a branch" },
      { command: "git branch -m <old> <new>", description: "Rename a branch" },
    ],
  },
  {
    title: "Merging & Rebasing",
    icon: "🔀",
    entries: [
      { command: "git merge <branch>", description: "Merge a branch into current" },
      { command: "git merge --no-ff <branch>", description: "Merge with a merge commit" },
      { command: "git merge --squash <branch>", description: "Squash merge (combine commits)" },
      { command: "git rebase <branch>", description: "Rebase onto a branch" },
      { command: "git rebase -i HEAD~3", description: "Interactive rebase last 3 commits" },
      { command: "git rebase --abort", description: "Abort a rebase in progress" },
      { command: "git cherry-pick <hash>", description: "Apply a specific commit" },
    ],
  },
  {
    title: "Remote Operations",
    icon: "☁",
    entries: [
      { command: "git fetch origin", description: "Download remote changes" },
      { command: "git fetch --all --prune", description: "Fetch all remotes, prune deleted" },
      { command: "git pull origin main", description: "Fetch and merge remote branch" },
      { command: "git pull --rebase", description: "Pull with rebase instead of merge" },
      { command: "git push origin main", description: "Push commits to remote" },
      { command: "git push -u origin <branch>", description: "Push and set upstream" },
      { command: "git push --force-with-lease", description: "Force push (safer)" },
      { command: "git push origin --delete <branch>", description: "Delete remote branch" },
    ],
  },
  {
    title: "Stashing",
    icon: "📋",
    entries: [
      { command: "git stash", description: "Stash uncommitted changes" },
      { command: 'git stash push -m "message"', description: "Stash with a description" },
      { command: "git stash --include-untracked", description: "Stash including new files" },
      { command: "git stash list", description: "List all stashes" },
      { command: "git stash pop", description: "Apply and remove latest stash" },
      { command: "git stash apply stash@{0}", description: "Apply a specific stash" },
      { command: "git stash drop stash@{0}", description: "Delete a specific stash" },
    ],
  },
  {
    title: "Inspection & History",
    icon: "🔍",
    entries: [
      { command: "git log --oneline", description: "Compact commit history" },
      { command: "git log --graph --all --oneline", description: "Visual branch graph" },
      { command: "git log -p <file>", description: "Show changes for a file over time" },
      { command: 'git log --author="Name"', description: "Filter commits by author" },
      { command: "git diff", description: "Show unstaged changes" },
      { command: "git diff --staged", description: "Show staged changes" },
      { command: "git diff main..feature", description: "Compare two branches" },
      { command: "git show <hash>", description: "Show a specific commit" },
      { command: "git blame <file>", description: "See who changed each line" },
      { command: "git reflog", description: "Show history of HEAD changes" },
    ],
  },
  {
    title: "Undo & Fix",
    icon: "↩",
    entries: [
      { command: "git restore <file>", description: "Discard working tree changes" },
      { command: "git restore --staged <file>", description: "Unstage a file" },
      { command: "git reset --soft HEAD~1", description: "Undo commit, keep changes staged" },
      { command: "git reset --mixed HEAD~1", description: "Undo commit, keep changes unstaged" },
      { command: "git reset --hard HEAD~1", description: "Undo commit, discard changes" },
      { command: "git revert <hash>", description: "Create a commit that undoes a commit" },
      { command: "git clean -fd", description: "Remove untracked files and dirs" },
    ],
  },
  {
    title: "Tags",
    icon: "🏷",
    entries: [
      { command: "git tag", description: "List all tags" },
      { command: 'git tag -a v1.0 -m "msg"', description: "Create an annotated tag" },
      { command: "git tag v1.0", description: "Create a lightweight tag" },
      { command: "git push origin v1.0", description: "Push a specific tag" },
      { command: "git push origin --tags", description: "Push all tags" },
      { command: "git tag -d v1.0", description: "Delete a local tag" },
    ],
  },
  {
    title: "Submodules",
    icon: "📎",
    entries: [
      { command: "git submodule add <url>", description: "Add a submodule" },
      { command: "git submodule update --init", description: "Initialize submodules after clone" },
      { command: "git submodule update --remote", description: "Update submodules to latest" },
      { command: "git clone --recurse-submodules <url>", description: "Clone with submodules" },
    ],
  },
  {
    title: "Advanced / Useful Aliases",
    icon: "🚀",
    entries: [
      { command: "git bisect start", description: "Binary search for a bug" },
      { command: "git shortlog -sn", description: "Commit count by author" },
      { command: "git log --all --oneline --graph --decorate", description: "Pretty branch history" },
      { command: "git clean -n", description: "Dry run of clean (see what would be removed)" },
      { command: "git worktree add <path> <branch>", description: "Work on multiple branches at once" },
      { command: "git archive --format=zip HEAD > archive.zip", description: "Export repo as zip" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GitCommandBuilderTool() {
  const { trackFirstInteraction, trackAction } = useToolAnalytics("git-command-builder");

  const [tab, setTab] = useState<Tab>("builder");

  // Builder state
  const [selectedCategory, setSelectedCategory] = useState<string>(BUILDER_CATEGORIES[0]);
  const [selectedCommandId, setSelectedCommandId] = useState<string>(GIT_COMMANDS[0].id);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Cheat sheet state
  const [cheatSearch, setCheatSearch] = useState("");

  const selectedCommand = useMemo(
    () => GIT_COMMANDS.find((c) => c.id === selectedCommandId) || GIT_COMMANDS[0],
    [selectedCommandId]
  );

  const categoryCommands = useMemo(
    () => GIT_COMMANDS.filter((c) => c.category === selectedCategory),
    [selectedCategory]
  );

  // Build the generated command
  const generatedCommand = useMemo(() => {
    const merged: Record<string, string> = {};
    for (const p of selectedCommand.params) {
      merged[p.name] = paramValues[p.name] || p.defaultValue || "";
    }
    return selectedCommand.template(merged);
  }, [selectedCommand, paramValues]);

  // Filtered cheat sheet
  const filteredCheatSheet = useMemo(() => {
    if (!cheatSearch.trim()) return CHEAT_SHEET;
    const q = cheatSearch.toLowerCase();
    return CHEAT_SHEET.map((section) => ({
      ...section,
      entries: section.entries.filter(
        (e) =>
          e.command.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      ),
    })).filter((s) => s.entries.length > 0);
  }, [cheatSearch]);

  const handleSelectCommand = useCallback(
    (id: string) => {
      trackFirstInteraction();
      setSelectedCommandId(id);
      setParamValues({});
      setCopied(false);
    },
    [trackFirstInteraction]
  );

  const handleCategoryChange = useCallback(
    (cat: string) => {
      setSelectedCategory(cat);
      const first = GIT_COMMANDS.find((c) => c.category === cat);
      if (first) {
        setSelectedCommandId(first.id);
        setParamValues({});
        setCopied(false);
      }
    },
    []
  );

  const handleParamChange = useCallback(
    (name: string, value: string) => {
      trackFirstInteraction();
      setParamValues((prev) => ({ ...prev, [name]: value }));
      setCopied(false);
    },
    [trackFirstInteraction]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCommand);
    setCopied(true);
    trackAction("copy");
    setTimeout(() => setCopied(false), 2000);
  }, [generatedCommand, trackAction]);

  const handleCopyCheat = useCallback(
    (cmd: string) => {
      navigator.clipboard.writeText(cmd);
      trackAction("copy_cheat");
    },
    [trackAction]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100">
            Git
          </span>
          <span className="text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded font-medium">
            Command Builder
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl mx-auto">
          Build git commands visually or browse the cheat sheet. Select an
          operation, fill in parameters, and copy the result.
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
          <Link
            href="/tools"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Tools
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">
            Git Command Builder
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 max-w-xs mx-auto">
        <button
          onClick={() => setTab("builder")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "builder"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setTab("cheatsheet")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "cheatsheet"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Cheat Sheet
        </button>
      </div>

      {/* ===================== BUILDER TAB ===================== */}
      {tab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar — categories + commands */}
          <div className="lg:col-span-4 space-y-4">
            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {BUILDER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Commands in selected category */}
            <div className="space-y-1.5">
              {categoryCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelectCommand(cmd.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors border ${
                    selectedCommandId === cmd.id
                      ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        selectedCommandId === cmd.id
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {cmd.label}
                    </span>
                    {cmd.dangerous && (
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                        CAUTION
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {cmd.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right side — parameters + output */}
          <div className="lg:col-span-8 space-y-4">
            {/* Parameters */}
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {selectedCommand.label}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedCommand.description}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCommand.params.map((p) => (
                  <div key={p.name} className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {p.label}
                      {p.required && (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    {p.type === "select" ? (
                      <select
                        value={paramValues[p.name] || p.defaultValue || ""}
                        onChange={(e) =>
                          handleParamChange(p.name, e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        {p.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={paramValues[p.name] || ""}
                        onChange={(e) =>
                          handleParamChange(p.name, e.target.value)
                        }
                        placeholder={p.placeholder}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Generated command output */}
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-medium">
                  Generated Command
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 text-sm text-green-400 font-mono whitespace-pre-wrap break-all overflow-x-auto">
                {generatedCommand}
              </pre>
            </div>

            {/* Danger warning for dangerous commands */}
            {selectedCommand.dangerous && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
                <p className="text-xs text-red-700 dark:text-red-400">
                  <strong>Warning:</strong> This command can cause data loss.
                  Make sure you understand what it does before running it.
                </p>
              </div>
            )}

            {/* Quick tips */}
            <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quick Tips
              </h4>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>
                  Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">git switch</code> instead of{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">git checkout</code> for switching branches (Git 2.23+)
                </li>
                <li>
                  Prefer{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">--force-with-lease</code> over{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">--force</code> to avoid overwriting others&apos; work
                </li>
                <li>
                  Use{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">git reflog</code> to recover lost commits
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHEAT SHEET TAB ================= */}
      {tab === "cheatsheet" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="max-w-lg mx-auto">
            <input
              type="text"
              value={cheatSearch}
              onChange={(e) => {
                setCheatSearch(e.target.value);
                trackFirstInteraction();
              }}
              placeholder="Search commands... (e.g., rebase, stash, merge)"
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {filteredCheatSheet.length === 0 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
              No commands found matching &ldquo;{cheatSearch}&rdquo;
            </p>
          )}

          {/* Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCheatSheet.map((section) => (
              <div
                key={section.title}
                className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {section.entries.map((entry, i) => (
                    <div
                      key={i}
                      className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <code className="text-xs font-mono text-blue-700 dark:text-blue-400 break-all">
                            {entry.command}
                          </code>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {entry.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyCheat(entry.command)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
                          title="Copy command"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
