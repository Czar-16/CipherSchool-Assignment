import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const attempts = await prisma.attempt.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        problem: true,
        submission: {
          include: {
            evaluation: true,
          },
        },
      },
    });

    const result = attempts.map((attempt) => ({
      id: attempt.id,
      createdAt: attempt.createdAt,
      problem: attempt.problem,
      submission: attempt.submission
        ? {
            id: attempt.submission.id,
            requirements: attempt.submission.requirements,
            classes: attempt.submission.classes,
            design: attempt.submission.design,
            decisions: attempt.submission.decisions,
            tradeoffs: attempt.submission.tradeoffs,
            createdAt: attempt.submission.createdAt,
          }
        : null,
      evaluation: attempt.submission?.evaluation || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
