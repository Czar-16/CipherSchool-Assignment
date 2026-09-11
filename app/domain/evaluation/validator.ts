export interface SubmissionFieldsInput {
  requirements?: string;
  classes?: string;
  design?: string;
  decisions?: string;
  tradeoffs?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSubmissionInput(
  input: SubmissionFieldsInput,
): ValidationResult {
  const errors: string[] = [];

  if (
    !input.requirements ||
    typeof input.requirements !== "string" ||
    input.requirements.trim().length === 0
  ) {
    errors.push("Requirements understood section is required.");
  }

  if (
    !input.classes ||
    typeof input.classes !== "string" ||
    input.classes.trim().length === 0
  ) {
    errors.push("Classes + responsibilities section is required.");
  }

  if (
    !input.design ||
    typeof input.design !== "string" ||
    input.design.trim().length === 0
  ) {
    errors.push("Design / relationships section is required.");
  }

  if (
    !input.decisions ||
    typeof input.decisions !== "string" ||
    input.decisions.trim().length === 0
  ) {
    errors.push("Design decisions / explanation section is required.");
  }

  if (
    !input.tradeoffs ||
    typeof input.tradeoffs !== "string" ||
    input.tradeoffs.trim().length === 0
  ) {
    errors.push("Trade-offs / assumptions section is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
