import { prisma } from "./lib/prisma";
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage() {
  const problems = await prisma.problem.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Low-Level Design Problems
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Select a problem, think through class relationships & design decisions, and submit your structured solution.
        </p>
      </div>

      {problems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">No problems available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {problem.title}
                </h2>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {problem.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href={`/problems/${problem.id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                  Practice Problem
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
