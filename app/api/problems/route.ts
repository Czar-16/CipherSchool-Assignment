import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(problems);
}
