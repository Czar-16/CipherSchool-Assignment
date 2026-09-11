"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Problem {
  id: number;
  title: string;
  description: string;
  requirements: string;
}

interface Evaluation {
  id: number;
  status: "EVALUATING" | "COMPLETED" | "FAILED" | string;
  overallScore: number;
  feedback: string;
  updatedAt: string;
}

interface SubmissionData {
  id: number;
  attemptId: number;
  requirements: string;
  classes: string;
  design: string;
  decisions: string;
  tradeoffs: string;
  createdAt: string;
  problem: Problem;
  evaluation: Evaluation | null;
}

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const submissionId = resolvedParams.id;

  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadSubmission() {
      try {
        const res = await fetch(`/api/submissions/${submissionId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Submission not found");
          throw new Error("Failed to load submission");
        }
        const data: SubmissionData = await res.json();
        if (!ignore) {
          setSubmission(data);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "An error occurred";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSubmission();

    return () => {
      ignore = true;
    };
  }, [submissionId]);

  // Poll if evaluation status is EVALUATING
  useEffect(() => {
    if (submission?.evaluation?.status !== "EVALUATING") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/submissions/${submissionId}`);
        if (res.ok) {
          const data: SubmissionData = await res.json();
          setSubmission(data);
        }
      } catch {
        // Silently ignore polling network glitches
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [submission?.evaluation?.status, submissionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-zinc-500">Loading submission details...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        <h2 className="text-lg font-semibold">Error</h2>
        <p className="mt-1">{error || "Submission not found"}</p>
        <Link href="/" className="mt-4 inline-block font-medium underline">
          &larr; Back to Problems
        </Link>
      </div>
    );
  }

  const { problem, evaluation } = submission;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link
          href="/history"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Back to History
        </Link>

        {problem && (
          <Link
            href={`/problems/${problem.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-500 transition-colors"
          >
            Try Again
          </Link>
        )}
      </div>

      {/* Header Info */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Submission #{submission.id}
            </span>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              {problem?.title || "Problem"}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Submitted on {new Date(submission.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Evaluation Status Banner */}
      <div className="rounded-xl border p-6 bg-white dark:bg-zinc-900 shadow-xs border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Evaluation Result
        </h2>

        {evaluation?.status === "EVALUATING" && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
            <svg
              className="animate-spin h-5 w-5 text-amber-600 dark:text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div>
              <p className="font-semibold text-sm">Evaluating your submission...</p>
              <p className="text-xs mt-0.5 opacity-90">
                Your submission has been safely saved. Evaluation is in progress.
              </p>
            </div>
          </div>
        )}

        {evaluation?.status === "COMPLETED" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-4 dark:bg-emerald-950/20 dark:border-emerald-900/50">
              <span className="font-semibold text-emerald-900 dark:text-emerald-300">
                Overall Score
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {evaluation.overallScore} / 60
              </span>
            </div>

            {evaluation.feedback && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-2">
                  Feedback
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {evaluation.feedback}
                </p>
              </div>
            )}
          </div>
        )}

        {evaluation?.status === "FAILED" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
            <p className="font-semibold text-sm">Evaluation Failed</p>
            <p className="text-xs mt-1">
              {evaluation.feedback || "An error occurred during evaluation. Your submission has been saved safely."}
            </p>
          </div>
        )}
      </div>

      {/* Submitted Details */}
      <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Your Submitted Answer
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              1. Requirements Understood
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line bg-zinc-50 p-3 rounded-lg border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
              {submission.requirements}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              2. Classes + Responsibilities
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line bg-zinc-50 p-3 rounded-lg border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 font-mono">
              {submission.classes}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              3. Design / Relationships
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line bg-zinc-50 p-3 rounded-lg border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
              {submission.design}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              4. Design Decisions / Explanation
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line bg-zinc-50 p-3 rounded-lg border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
              {submission.decisions}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              5. Trade-offs / Assumptions
            </h3>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line bg-zinc-50 p-3 rounded-lg border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
              {submission.tradeoffs}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
