import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submissionId = parseInt(id, 10);

    if (isNaN(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        attempt: {
          include: {
            problem: true,
          },
        },
        evaluation: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: submission.id,
      attemptId: submission.attemptId,
      requirements: submission.requirements,
      classes: submission.classes,
      design: submission.design,
      decisions: submission.decisions,
      tradeoffs: submission.tradeoffs,
      createdAt: submission.createdAt,
      problem: submission.attempt.problem,
      evaluation: submission.evaluation,
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
