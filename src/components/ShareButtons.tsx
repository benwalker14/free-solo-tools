"use client";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Reddit",
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.949 13.949c.04.209.06.421.06.637 0 3.262-3.8 5.914-8.484 5.914S1.04 17.848 1.04 14.586c0-.194.014-.387.043-.576a2.018 2.018 0 01-.834-1.63c0-1.103.9-2.003 2.003-2.003.55 0 1.044.222 1.403.582 1.38-.953 3.268-1.563 5.378-1.641l1.076-5.074a.342.342 0 01.407-.272l3.548.748a1.47 1.47 0 011.372-.955 1.468 1.468 0 010 2.937 1.47 1.47 0 01-1.459-1.302l-3.2-.675-.97 4.573c2.066.098 3.91.71 5.264 1.649a2 2 0 011.398-.578c1.103 0 2.003.9 2.003 2.003 0 .65-.314 1.23-.804 1.596zM9.526 12.039c-1.103 0-2.003.9-2.003 2.003a2.004 2.004 0 002.003 2.003c1.103 0 2.003-.9 2.003-2.003s-.9-2.003-2.003-2.003zm4.948 0c-1.103 0-2.003.9-2.003 2.003s.9 2.003 2.003 2.003 2.003-.9 2.003-2.003-.9-2.003-2.003-2.003zm-1.09 5.335a.342.342 0 01-.483 0c-.64-.64-1.755-.934-2.901-.934s-2.262.294-2.901.934a.342.342 0 01-.484-.484c.773-.773 2.079-1.133 3.385-1.133s2.612.36 3.385 1.133a.342.342 0 010 .484z" />
        </svg>
      ),
    },
    {
      name: "Hacker News",
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0v24h24V0H0zm13.09 13.37L16.9 6h1.81l-4.82 9.02V21h-1.78v-5.98L7.29 6h1.81l3.99 7.37z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
          title={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
