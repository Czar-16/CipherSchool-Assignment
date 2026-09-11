# DesignArena — System Design

## Architecture
The platform is designed as a Next.js App Router monolith with PostgreSQL and Prisma 7 ORM.

### Key Reliability Principle
> **SAVE SUBMISSION FIRST → THEN EVALUATE**

Submissions are persisted immediately in PostgreSQL with an initial evaluation record set to `EVALUATING`. If downstream evaluation fails or times out, the learner's work remains safely saved and recoverable.

## Database Schema Model
- `Problem`: LLD scenario details and requirements.
- `Attempt`: Links a user attempt session to a specific problem.
- `Submission`: Stores the 5 structured sections submitted by the learner.
- `Evaluation`: Tracks processing status (`EVALUATING`, `COMPLETED`, `FAILED`), score, and feedback.

## Evaluator Component Design
Located at `app/domain/evaluation/`:
- `types.ts`: Domain models and rubric specification.
- `validator.ts`: Deterministic input validation checks.
- `Evaluator.ts`: Strategy interface `Evaluator` allowing interchangeable implementations (`AIEvaluator`, `RuleBasedEvaluator`, `HumanEvaluator`).

## TODO / Architecture Roadmap
- [ ] Implement `AIEvaluator` using LLM API integration.
- [ ] Add background job worker or async event queue for non-blocking evaluation processing.
