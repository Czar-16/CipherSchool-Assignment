import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { AIEvaluator } from "../../domain/evaluation/Evaluator";
import { validateSubmissionInput } from "../../domain/evaluation/validator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, requirements, classes, design, decisions, tradeoffs } =
      body;

    const parsedProblemId =
      typeof problemId === "number" ? problemId : parseInt(problemId, 10);

    if (isNaN(parsedProblemId)) {
      return NextResponse.json(
        { error: "Valid problemId is required" },
        { status: 400 },
      );
    }

    if (
      !requirements ||
      typeof requirements !== "string" ||
      requirements.trim() === "" ||
      !classes ||
      typeof classes !== "string" ||
      classes.trim() === "" ||
      !design ||
      typeof design !== "string" ||
      design.trim() === "" ||
      !decisions ||
      typeof decisions !== "string" ||
      decisions.trim() === "" ||
      !tradeoffs ||
      typeof tradeoffs !== "string" ||
      tradeoffs.trim() === ""
    ) {
      return NextResponse.json(
        {
          error:
            "All five submission fields are required and must not be empty",
        },
        { status: 400 },
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: parsedProblemId },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
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

    //-----------------------------------------------------------------------------
    // Run deterministic validation before sending the submission to the AI.
    const validation = validateSubmissionInput({
      requirements: result.requirements,
      classes: result.classes,
      design: result.design,
      decisions: result.decisions,
      tradeoffs: result.tradeoffs,
    });

    if (!validation.valid) {
      await prisma.evaluation.update({
        where: { submissionId: result.id },
        data: {
          status: "FAILED",
          feedback: JSON.stringify({
            errors: validation.errors,
          }),
        },
      });

      return NextResponse.json(
        { error: "Submission validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    let evaluationResult;

    try {
      // Create the AI evaluator.
      const evaluator = new AIEvaluator();

      // Run the qualitative LLD evaluation.
      evaluationResult = await evaluator.evaluate({
        submissionId: result.id,
        problemId: result.problem.id,
        problemTitle: result.problem.title,
        problemDescription: result.problem.description,
        problemRequirements: result.problem.requirements,
        requirements: result.requirements,
        classes: result.classes,
        design: result.design,
        decisions: result.decisions,
        tradeoffs: result.tradeoffs,
      });
    } catch (error) {
      console.error("AI evaluation failed:", error);

      // Make sure the evaluation does not remain stuck at EVALUATING.
      await prisma.evaluation.update({
        where: {
          submissionId: result.id,
        },
        data: {
          status: "FAILED",
          feedback: JSON.stringify({
            error: "AI evaluation failed. Please try submitting again.",
          }),
        },
      });

      return NextResponse.json(
        {
          error: "Submission was saved, but AI evaluation failed.",
          submissionId: result.id,
        },
        { status: 500 },
      );
    }

    // Save the AI evaluation result to the database.
    const updatedEvaluation = await prisma.evaluation.update({
      where: {
        submissionId: result.id,
      },
      data: {
        status: evaluationResult.status,
        overallScore: evaluationResult.overallScore,
        feedback: JSON.stringify({
          feedback: evaluationResult.feedback,
          criteriaScores: evaluationResult.criteriaScores,
        }),
      },
    });

    return NextResponse.json(
      {
        ...result,
        evaluation: updatedEvaluation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Submit
//   ↓
// Save Submission
//   ↓
// Create Evaluation = EVALUATING
//   ↓
//    AI works ─────────→ COMPLETED
//   │
//    AI fails ─────────→ FAILED
