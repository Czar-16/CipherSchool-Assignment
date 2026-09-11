import { EvaluationInput, EvaluationResult, EVALUATION_RUBRIC, TOTAL_MAX_SCORE } from "./types";

/**
 * Strategy interface for evaluation implementations.
 * Can be implemented by AIEvaluator, RuleBasedEvaluator, HumanEvaluator, etc.
 */
export interface Evaluator {
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}

/**
 * Placeholder / Stub Evaluator.
 * Keeps submission in EVALUATING or completes with dummy output for testing domain wiring.
 */
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
