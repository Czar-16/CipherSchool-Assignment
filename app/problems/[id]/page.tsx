"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Problem {
  id: number;
  title: string;
  description: string;
  requirements: string;
}

export default function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    requirements: "",
    classes: "",
    design: "",
    decisions: "",
    tradeoffs: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problems/${resolvedParams.id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Problem not found");
          throw new Error("Failed to load problem");
        }
        const data = await res.json();
        setProblem(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [resolvedParams.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (
      !formData.requirements.trim() ||
      !formData.classes.trim() ||
      !formData.design.trim() ||
      !formData.decisions.trim() ||
      !formData.tradeoffs.trim()
    ) {
      setSubmitError("All five submission sections are required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: Number(resolvedParams.id),
          requirements: formData.requirements,
          classes: formData.classes,
          design: formData.design,
          decisions: formData.decisions,
          tradeoffs: formData.tradeoffs,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit solution");
      }

      const data = await res.json();
      router.push(`/submissions/${data.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while submitting";
      setSubmitError(message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-zinc-500">Loading problem details...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        <h2 className="text-lg font-semibold">Error</h2>
        <p className="mt-1">{error || "Problem not found"}</p>
        <Link href="/" className="mt-4 inline-block font-medium underline">
          &larr; Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Back to Problems
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {problem.title}
        </h1>

        <div className="mt-4 space-y-4 text-zinc-700 dark:text-zinc-300">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm uppercase tracking-wide">
              Description
            </h3>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
              {problem.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm uppercase tracking-wide">
              Requirements
            </h3>
            <div className="mt-1 whitespace-pre-line text-sm leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 font-mono">
              {problem.requirements}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Submit LLD Solution
        </h2>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
            {submitError}
          </div>
        )}

        <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              1. Requirements Understood
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              List functional & non-functional requirements, scope boundaries, and core use-cases.
            </p>
            <textarea
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Identify core requirements, primary actors, and system constraints..."
              className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              2. Classes + Responsibilities
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              Define domain entities, single responsibility principle (SRP) per class, interfaces, and enums.
            </p>
            <textarea
              name="classes"
              rows={5}
              value={formData.classes}
              onChange={handleChange}
              placeholder="e.g. ParkingTicket (id, entryTime, exitTime), ParkingSpot (type, isOccupied)..."
              className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              3. Design / Relationships
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              Explain relationships (inheritance, aggregation, composition), data flows, and design patterns used.
            </p>
            <textarea
              name="design"
              rows={5}
              value={formData.design}
              onChange={handleChange}
              placeholder="Describe inheritance hierarchy, strategy pattern for fee calculation, observer pattern..."
              className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              4. Design Decisions / Explanation
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              Why did you choose specific patterns or abstractions? Justify your architecture choices.
            </p>
            <textarea
              name="decisions"
              rows={4}
              value={formData.decisions}
              onChange={handleChange}
              placeholder="Explain rationale for using Strategy pattern over if-else conditions for pricing..."
              className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              5. Trade-offs / Assumptions
            </label>
            <p className="text-xs text-zinc-500 mb-2">
              What edge cases, concurrency assumptions, memory trade-offs, or scalability limitations exist?
            </p>
            <textarea
              name="tradeoffs"
              rows={4}
              value={formData.tradeoffs}
              onChange={handleChange}
              placeholder="Assumed single-node execution; in-memory locks for spot assignment; trade-offs made..."
              className="w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit LLD Solution"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
