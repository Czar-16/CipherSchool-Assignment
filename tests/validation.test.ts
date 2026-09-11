import assert from "node:assert";
import { test } from "node:test";
import { validateSubmissionInput } from "../app/domain/evaluation/validator";

test("missing submission fields are rejected", () => {
  const result = validateSubmissionInput({
    requirements: "Parsed requirements",
    classes: "", // missing
    design: "Design pattern details",
    decisions: "SRP & OCP choices",
    tradeoffs: "In-memory lock trade-off",
  });

  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.errors.length, 1);
  assert.match(result.errors[0], /Classes \+ responsibilities/);
});

test("all five submission fields present passes validation", () => {
  const result = validateSubmissionInput({
    requirements: "Parsed requirements",
    classes: "ParkingLot, Spot, Ticket",
    design: "Spot -> ParkingFloor composition",
    decisions: "Strategy pattern for pricing",
    tradeoffs: "Single-node concurrency assumption",
  });

  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
});
