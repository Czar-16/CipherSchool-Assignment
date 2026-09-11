import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const problemId = parseInt(id, 10);

  if (isNaN(problemId)) {
    return NextResponse.json(
      { error: "Invalid problem ID" },
      { status: 400 }
    );
  }

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (!problem) {
    return NextResponse.json(
      { error: "Problem not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(problem);
}
