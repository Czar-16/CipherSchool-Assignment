import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-zinc-100">
          <span className="rounded bg-indigo-600 px-2 py-1 text-xs text-white uppercase tracking-wider">LLD</span>
          <span>DesignArena</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            Problems
          </Link>
          <Link
            href="/history"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
