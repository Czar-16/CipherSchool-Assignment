# DesignArena — Design Note

## 1. Overview

DesignArena is a small LLD practice platform where learners can practice object-oriented design problems, submit their solutions, receive structured AI-powered feedback, review previous attempts, and try again.

The system is intentionally implemented as a simple monolith because the assignment focuses on LLD/domain design rather than distributed systems.

### Technology Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma 7
- OpenRouter for LLM-based evaluation
- Vitest for tests
- Tailwind CSS

---

## 2. MVP

The MVP supports the complete learner journey:

1. Choose an LLD problem
2. Read the problem and requirements
3. Create a design
4. Submit the design
5. Validate the submission
6. Evaluate the design using an AI evaluator
7. View rubric-based feedback
8. View previous submissions
9. Try the problem again

The initial problem set contains:

- Parking Lot
- Library Management System
- Movie Ticket Booking

The MVP intentionally keeps the submission format simple and text-based.

---

## 3. User Flow

    Problems
       |
       v
    Choose Problem
       |
       v
    Think / Design
       |
       v
    Submit Solution
       |
       v
    Deterministic Validation
       |
       +---- Invalid ----> Show Validation Errors
       |
       v
    Create Submission + Evaluation
       |
       v
    AI Evaluation
       |
       +---- Failed ----> Preserve Submission + Mark Evaluation FAILED
       |
       v
    Completed
       |
       v
    Rubric Feedback
       |
       v
    History
       |
       v
    Try Again

A learner's work is saved before the AI evaluation is performed. This prevents an evaluation failure from causing the submitted solution to disappear.

---

## 4. Submission Model

A learner submits five sections.

### 4.1 Requirements Understood

The learner explains the important functional requirements and constraints they identified from the problem.

### 4.2 Classes + Responsibilities

The learner lists the classes/entities they would create and explains what responsibility belongs to each class.

### 4.3 Design / Relationships

The learner explains relationships between classes and how the main flow of the system works.

### 4.4 Design Decisions / Explanation

The learner explains important design choices, abstractions, interfaces, and patterns used.

### 4.5 Trade-offs / Assumptions

The learner documents assumptions and explains trade-offs made in the design.

This format intentionally evaluates the learner's reasoning rather than requiring a single code implementation.

---

## 5. Domain Model

The core domain flow is:

    Problem
       |
       v
    Attempt
       |
       v
    Submission
       |
       v
    Evaluation
       |
       v
    Feedback

### Problem

Represents an LLD problem available for practice.

Responsibilities:

- Store problem title
- Store problem description
- Store requirements
- Provide the problem context for an attempt

### Attempt

Represents a learner's work on a particular problem.

Responsibilities:

- Associate a learner attempt with a problem
- Track the attempt lifecycle
- Associate the submitted solution

An attempt can have one submission in the current MVP.

### Submission

Represents the actual snapshot of the learner's design sent for evaluation.

Responsibilities:

- Store the learner's five submission sections
- Associate the submission with an attempt
- Preserve the learner's work independently of evaluation success

### Evaluation

Represents the result of evaluating a submission.

Responsibilities:

- Track evaluation status
- Store the overall score
- Store criterion-level feedback
- Store the generated evaluation result

Evaluation statuses are:

    EVALUATING
    COMPLETED
    FAILED

---

## 6. Database Relationships

The database relationships are:

    Problem 1 -------- * Attempt

    Attempt 1 -------- 1 Submission

    Submission 1 ----- 1 Evaluation

The corresponding Prisma models are:

- Problem
- Attempt
- Submission
- Evaluation

The database stores submissions and evaluations separately so that evaluation failures do not remove the learner's submitted work.

---

## 7. Evaluator Architecture

The evaluator is represented using an interface:

              Evaluator
                  |
        +---------+---------+
        |                   |
    AIEvaluator        StubEvaluator

The interface conceptually exposes:

    evaluate(input): Promise<EvaluationResult>

This keeps the rest of the application independent from the specific evaluation strategy.

A future implementation could add:

    Evaluator
       |
       +-- AIEvaluator
       +-- RuleBasedEvaluator
       +-- HumanEvaluator

No changes to the submission or feedback flow would be required just because the evaluation strategy changes.

---

## 8. Evaluation Strategy

LLD does not have one universally correct implementation.

Two learners may use different classes or patterns while both producing reasonable designs.

Therefore, the evaluator does not compare a learner's submission against a single reference answer.

Instead, it evaluates the submission using six criteria.

### Rubric

| Criterion                   | Maximum |
| --------------------------- | ------: |
| Requirement Understanding   |      10 |
| Class Responsibilities      |      10 |
| Encapsulation & Abstraction |      10 |
| Coupling & Cohesion         |      10 |
| Extensibility               |      10 |
| Edge Cases & Testability    |      10 |
| **Total**                   |  **60** |

For each criterion, the evaluator provides:

- Score
- Evidence-based feedback
- Explanation of concerns
- Actionable suggestions

The overall score is the sum of the criterion scores.

---

## 9. Deterministic Validation vs AI Evaluation

The system separates checks that can be deterministic from qualitative design judgment.

### Deterministic Validation

The application checks that all required submission sections are present:

    Requirements
    Classes
    Design
    Decisions
    Trade-offs

These checks are handled by:

    validateSubmissionInput()

An LLM is not needed for these checks.

### AI Evaluation

The AI evaluator handles qualitative questions such as:

- Are responsibilities clearly separated?
- Is the design cohesive?
- Is coupling unnecessarily high?
- Are abstractions appropriate?
- Is the design extensible?
- Were important edge cases considered?
- Are the design decisions explained clearly?

This separation makes basic validation predictable while using AI where judgment is actually useful.

---

## 10. AI Evaluator

The AIEvaluator receives:

- Problem title
- Problem description
- Problem requirements
- Learner requirements understanding
- Classes and responsibilities
- Design and relationships
- Design decisions
- Trade-offs and assumptions
- Evaluation rubric

The evaluator is explicitly instructed that:

> There is no single correct answer in LLD.

It should not penalize a learner merely because their design differs from a possible reference implementation.

The AI returns structured JSON containing:

    overallScore
    criteriaScores
    feedback

This result is stored in the Evaluation record.

---

## 11. Reliability and Failure Handling

The key reliability principle is:

    SAVE SUBMISSION FIRST
            |
            v
    START EVALUATION

The system creates the submission and an initial evaluation record with:

    EVALUATING

before calling the AI evaluator.

If the AI/provider fails:

    Submission
        |
        +--> Preserved
        |
        +--> Evaluation = FAILED

This means a temporary provider failure does not cause the learner's work to be lost.

The evaluation state also makes it possible for the UI to distinguish between:

- Evaluation still in progress
- Evaluation completed
- Evaluation failed

---

## 12. Extensibility

The design intentionally leaves extension points without introducing unnecessary complexity.

### Additional Evaluators

The Evaluator interface allows future strategies such as:

- Rule-based evaluation
- Human review
- Another LLM provider

### Additional Submission Formats

The current MVP uses structured text fields. The model can later be extended to support:

- Code submissions
- UML diagrams
- Mermaid diagrams
- Mixed text + diagram submissions

The important separation is that the submission represents learner input, while the evaluator is responsible for interpreting it.

### Additional Problems

Problems are stored in the database rather than hard-coded into the UI, allowing new LLD problems to be added without changing the core flow.

---

## 13. Key Design Trade-offs

### Simple Monolith vs Distributed Architecture

**Decision:** Use a Next.js monolith.

**Why:**

The assignment is focused on LLD and product behavior. Introducing microservices, queues, or distributed infrastructure would add complexity without improving the MVP significantly.

A background worker could be introduced later if evaluation volume grows.

### Text Submission vs Full Code Editor

**Decision:** Use structured text sections.

**Why:**

The primary goal is evaluating LLD reasoning rather than building a complete coding IDE.

This keeps the MVP small while still allowing the evaluator to assess classes, responsibilities, relationships, abstractions, and trade-offs.

### Rubric vs Reference Answer

**Decision:** Use rubric-based evaluation.

**Why:**

There can be multiple valid LLD solutions. Comparing against one reference implementation would risk incorrectly penalizing valid designs.

### AI vs Fully Deterministic Evaluation

**Decision:** Use deterministic validation plus AI judgment.

**Why:**

Required-field validation is predictable and does not need an LLM.

Qualitative LLD evaluation requires reasoning about design choices, which is where an LLM provides value.

---

## 14. Future Improvements

The MVP intentionally does not implement these features yet, but the architecture leaves room for them:

- Background evaluation jobs
- Retry failed evaluations
- Multiple submissions per attempt
- Code and diagram submissions
- More sophisticated deterministic checks
- Evaluation history and progress analytics
- Human review
- Multiple AI providers
- Versioned rubrics
- More LLD problems

These are future extensions rather than requirements of the current MVP.
