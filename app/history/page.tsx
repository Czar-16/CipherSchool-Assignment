"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AttemptItem {
  id: number;
  createdAt: string;
  problem: {
    id: number;
    title: string;
  };
  submission: {
    id: number;
    requirements: string;
    createdAt: string;
  } | null;
  evaluation: {
    id: number;
    status: string;
    overallScore: number;
  } | null;
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<AttemptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const res = await fetch("/api/attempts");
        if (!res.ok) throw new Error("Failed to load attempts history");
        const data = await res.json();
        setAttempts(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchAttempts();
  }, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            COMPLETED
          </span>
        );
      case "EVALUATING":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse">
            EVALUATING
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950/50 dark:text-red-300">
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
            PENDING
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-zinc-500">Loading submission history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Attempt History
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Review your past submissions, scores, and evaluation feedback.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">
            No attempt history found. Start practicing problems!
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-500 transition-colors"
          >
            Browse Problems
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Attempt #</th>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {attempts.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    #{attempt.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                    {attempt.problem?.title || "Unknown Problem"}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(attempt.evaluation?.status)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    {attempt.evaluation?.status === "COMPLETED"
                      ? `${attempt.evaluation.overallScore} / 60`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {new Date(attempt.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {attempt.submission ? (
                      <Link
                        href={`/submissions/${attempt.submission.id}`}
                        className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        View Submission &rarr;
                      </Link>
                    ) : (
                      <span className="text-xs text-zinc-400">No submission</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
