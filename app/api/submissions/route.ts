import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, requirements, classes, design, decisions, tradeoffs } = body;

    const parsedProblemId = typeof problemId === "number" ? problemId : parseInt(problemId, 10);

    if (isNaN(parsedProblemId)) {
      return NextResponse.json(
        { error: "Valid problemId is required" },
        { status: 400 }
      );
    }

    if (
      !requirements || typeof requirements !== "string" || requirements.trim() === "" ||
      !classes || typeof classes !== "string" || classes.trim() === "" ||
      !design || typeof design !== "string" || design.trim() === "" ||
      !decisions || typeof decisions !== "string" || decisions.trim() === "" ||
      !tradeoffs || typeof tradeoffs !== "string" || tradeoffs.trim() === ""
    ) {
      return NextResponse.json(
        { error: "All five submission fields are required and must not be empty" },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: parsedProblemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.attempt.create({
        data: {
          problemId: parsedProblemId,
        },
      });

      const submission = await tx.submission.create({
        data: {
          attemptId: attempt.id,
          requirements: requirements.trim(),
          classes: classes.trim(),
          design: design.trim(),
          decisions: decisions.trim(),
          tradeoffs: tradeoffs.trim(),
        },
      });

      const evaluation = await tx.evaluation.create({
        data: {
          submissionId: submission.id,
          status: "EVALUATING",
          overallScore: 0,
          feedback: "",
        },
      });

      return {
        ...submission,
        attempt,
        evaluation,
        problem,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to create submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
