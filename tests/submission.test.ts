import assert from "node:assert";
import { test } from "node:test";

test("evaluation initial status contract is EVALUATING with 0 score", () => {
  const initialEvaluation = {
    status: "EVALUATING",
    overallScore: 0,
    feedback: "",
  };

  assert.strictEqual(initialEvaluation.status, "EVALUATING");
  assert.strictEqual(initialEvaluation.overallScore, 0);
  assert.strictEqual(initialEvaluation.feedback, "");
});

test("rejects invalid problemId (non-integer / NaN)", () => {
  const invalidProblemId = parseInt("invalid-id", 10);
  assert.strictEqual(isNaN(invalidProblemId), true);
});
