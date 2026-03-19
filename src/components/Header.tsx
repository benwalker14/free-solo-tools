import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SearchButton from "./SearchButton";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          Dev
          <span className="text-indigo-600">Bolt</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm font-medium text-gray-600 sm:flex dark:text-gray-400">
          <Link
            href="/"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            Tools
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            API
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/cheatsheets"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            Cheat Sheets
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-gray-900 dark:hover:text-white"
          >
            About
          </Link>
          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
          <SearchButton />
          <ThemeToggle />
        </nav>

        {/* Mobile nav */}
        <MobileMenu />
      </div>
    </header>
  );
}
