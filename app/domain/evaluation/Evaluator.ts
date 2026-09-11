import {
  EvaluationInput,
  EvaluationResult,
  EVALUATION_RUBRIC,
  TOTAL_MAX_SCORE,
} from "./types";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export interface Evaluator {
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}

export class StubEvaluator implements Evaluator {
  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    return {
      overallScore: 48,
      feedback: `Stub Evaluation for "${input.problemTitle}".\nRubric scored out of ${TOTAL_MAX_SCORE}. AI evaluation logic to be implemented.`,
      status: "COMPLETED",
      criteriaScores: EVALUATION_RUBRIC.map((c) => ({
        criterionId: c.id,
        score: 8,
        feedback: `${c.name} meets baseline criteria.`,
      })),
    };
  }
}

/**
 * AI-based evaluator.
 *
 * Uses an LLM to evaluate an LLD submission against our rubric.
 * The evaluator follows the same interface as other evaluators,
 * which means we can replace the AI evaluator with a rule-based
 * or human evaluator later without changing the rest of the application.
 */
export class AIEvaluator implements Evaluator {
  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    // Send only the information the AI actually needs for evaluation.
    // Keeping the rubric here makes the evaluation consistent across problems.
    const rubric = EVALUATION_RUBRIC.map((criterion) => ({
      id: criterion.id,
      name: criterion.name,
      maxScore: criterion.maxScore,
      description: criterion.description,
    }));

    // Ask the LLM to evaluate the learner's design.
    const response = await openai.chat.completions.create({
      // Keep the model configurable through .env so we can change
      // models without modifying application code.
      model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free",

      messages: [
        {
          role: "system",
          content: `
          You are an expert software engineer evaluating a learner's Low-Level Design (LLD) solution.

          There is NO single correct answer in LLD. Multiple designs can be valid.

          Evaluate the learner's submission against the given problem requirements and rubric.
          Do not penalize a solution simply because it differs from a reference design.

          For every criterion:
          - Give a score from 0 to 10.
          - Explain the score using evidence from the learner's submission.
          - Give useful, actionable feedback.

          Be fair. Do not invent details that are not present in the submission.

          Rubric:
          ${JSON.stringify(rubric, null, 2)}

          Return ONLY valid JSON in this exact shape:
          {
            "overallScore": number,
            "criteriaScores": [
              {
                "criterionId": "requirements",
                "score": number,
                "feedback": "string"
              }
            ],
            "feedback": "string"
          }

          The overallScore must equal the sum of all criterion scores.`.trim(),
        },
        {
          role: "user",
          content: `
          Problem:
          Title: ${input.problemTitle}

          Description:
          ${input.problemDescription}

          Requirements:
          ${input.problemRequirements}

          Learner Submission:

          Requirements understood:
          ${input.requirements}

          Classes + responsibilities:
          ${input.classes}

          Design / relationships:
          ${input.design}

          Design decisions / explanation:
          ${input.decisions}

          Trade-offs / assumptions:
          ${input.tradeoffs}`.trim(),
        },
      ],

      // Ask the model to return JSON because our application needs
      // predictable data that can be stored and displayed.
      response_format: { type: "json_object" },
    });

    // Extract the model's response.
    const content = response.choices[0]?.message?.content;

    // Don't continue if the AI failed to return anything.
    if (!content) {
      throw new Error("AI evaluator returned an empty response");
    }

    // Convert the JSON returned by the AI into our application's
    // EvaluationResult structure.
    const result = JSON.parse(content) as EvaluationResult;

    // The API call succeeded, so mark the evaluation as completed.
    return {
      ...result,
      status: "COMPLETED",
    };
  }
}
