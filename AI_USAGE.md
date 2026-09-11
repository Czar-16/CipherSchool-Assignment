# DesignArena — AI Usage Log

## Overview

AI tools were used during the development of DesignArena for implementation assistance, architecture decisions, evaluation design, and prompt engineering.

AI-generated suggestions were reviewed and adapted rather than being accepted blindly. Final implementation decisions were made based on the assignment requirements, simplicity, extensibility, and reliability.

## AI-Assisted Decisions

### 1. Evaluation Architecture

- **AI suggested:** Use an `Evaluator` interface so different evaluation strategies can be plugged in.
- **Accepted:** Yes.
- **Implementation:** The system defines an `Evaluator` interface with implementations such as `AIEvaluator` and `StubEvaluator`.
- **Why:** LLD solutions do not have one correct answer, and the platform may later support rule-based or human evaluation without changing the rest of the application.

### 2. Rubric-Based AI Evaluation

- **AI suggested:** Evaluate submissions using multiple rubric criteria instead of comparing them against one reference solution.
- **Accepted:** Yes.
- **Implementation:** The evaluator scores six criteria:
  - Requirement Understanding
  - Class Responsibilities
  - Encapsulation & Abstraction
  - Coupling & Cohesion
  - Extensibility
  - Edge Cases & Testability

- **Why:** Multiple LLD designs can be valid. A rubric provides more useful and explainable feedback than checking whether the learner's design matches a single expected solution.

### 3. Separating Deterministic Validation from AI Judgment

- **AI suggested:** Perform basic submission validation deterministically and use the LLM only for qualitative design evaluation.
- **Accepted:** Yes.
- **Implementation:** `validateSubmissionInput()` checks that all required submission sections are present before the AI evaluator is called.
- **Why:** Basic validation does not require an LLM. Keeping it deterministic reduces unnecessary AI usage and makes predictable checks reliable.

### 4. Structured AI Output

- **AI suggested:** Ask the LLM to return structured JSON containing the overall score, individual criterion scores, and feedback.
- **Accepted:** Yes.
- **Implementation:** The OpenRouter request uses JSON output and the result is stored as structured JSON in the evaluation record.
- **Why:** The frontend needs predictable data to display rubric-level feedback instead of parsing free-form text.

### 5. Handling Evaluation Failures

- **AI suggested:** Save the submission before starting evaluation and explicitly represent evaluation states such as `EVALUATING`, `COMPLETED`, and `FAILED`.
- **Accepted:** Yes.
- **Implementation:** A submission and its initial evaluation record are created before the AI evaluation runs. AI failures update the evaluation status to `FAILED` while keeping the submission.
- **Why:** A temporary AI/provider failure should not cause the learner's submitted work to be lost or leave the evaluation permanently stuck.

## AI-Assisted Implementation

AI coding assistance was also used for repetitive implementation work, including:

- Next.js API route scaffolding
- Prisma CRUD operations
- Basic UI components and pages
- Initial unit tests
- TypeScript interfaces and boilerplate

These changes were reviewed and tested manually.

## Human Ownership

The final implementation, architecture choices, rubric, product flow, database model, and evaluation behavior were reviewed and decided as part of the assignment development process.

AI suggestions were treated as implementation and design assistance rather than authoritative decisions.
