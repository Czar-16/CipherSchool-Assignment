# DesignArena — LLD Practice Platform

DesignArena is an interactive Low-Level Design (LLD) practice platform where learners can practice object-oriented design problems, submit structured solutions, receive AI-powered rubric evaluations, review past attempts, and iteratively improve their system design skills.

---

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **AI Evaluation**: OpenRouter API (LLM integration)
- **Styling**: Tailwind CSS
- **Testing**: Vitest

---

## Features

- **Problem Catalog**: Practice real-world LLD problems such as:
  - Parking Lot
  - Library Management System
  - Movie Ticket Booking

- **Structured Submission Flow**: Submit solutions broken down into 5 key components:
  1. Requirements Understood
  2. Core Classes & Responsibilities
  3. Design & Relationships
  4. Design Decisions
  5. Trade-offs & Limitations

- **Rubric-Based AI Evaluation**: Automated evaluation against a 6-criterion LLD rubric out of 60 total points with detailed feedback per criterion.

- **Deterministic Validation**: Server-side validation to catch incomplete submissions before AI analysis.

- **Submission History**: Review previous submissions and retry problems to improve.

---

## Evaluation Rubric

Submissions are evaluated out of 60 points across 6 criteria, with each criterion worth 10 points:

1. **Requirement Understanding**: Accuracy in identifying functional requirements and constraints.

2. **Class Responsibilities**: Clarity, Single Responsibility Principle (SRP), and entity breakdown.

3. **Encapsulation & Abstraction**: Access control, hiding implementation details, and appropriate use of interfaces.

4. **Coupling & Cohesion**: Modularity, dependency management, low coupling, and high cohesion.

5. **Extensibility**: Ease of extending the design when requirements change.

6. **Edge Cases & Testability**: Handling boundary conditions, failure modes, concurrency, and testability.

---

## Getting Started

### Prerequisites

- Node.js v20 or higher
- PostgreSQL
- OpenRouter API key for AI evaluation

### Environment Setup

Create a `.env` file in the root directory:

    DATABASE_URL="postgresql://user:password@localhost:5432/cipherschool_assignment?schema=public"

    OPENROUTER_API_KEY="your-openrouter-api-key"

    OPENROUTER_MODEL="openrouter/free"

### Installation

    # Install dependencies
    npm install

    # Set up the database
    npx prisma db push

    # Seed the initial LLD problems
    npx tsx prisma/seed.ts

    # Start the development server
    npm run dev

Open `http://localhost:3000` in your browser.

---

## Scripts

- `npm run dev` — Starts the Next.js development server.
- `npm run build` — Builds the application for production.
- `npm run start` — Starts the production server.
- `npm run test` — Runs the test suite.
- `npm run lint` — Runs ESLint checks.

---

## Project Structure

    ├── app/
    │   ├── api/                  # API routes (problems, submissions, attempts)
    │   ├── domain/               # Evaluation logic, rubric, validator & AI evaluator
    │   ├── problems/             # Problem catalog & problem detail pages
    │   ├── submissions/          # Submission feedback & review pages
    │   └── page.tsx              # Home / Dashboard page
    ├── prisma/
    │   ├── schema.prisma         # Database schema
    │   └── seed.ts               # Initial problem data
    ├── tests/                    # Unit and domain evaluation tests
    ├── DESIGN.md                 # System design and architecture document
    ├── RESEARCH.md               # LLD, product and evaluation research
    └── AI_USAGE.md               # AI assistance tracking log

---

## Evaluation Architecture

The platform separates deterministic validation from qualitative AI evaluation.

Basic submission validation is performed by application logic before the AI evaluator is called.

The AI evaluator evaluates the learner's design using the six-criterion rubric and provides criterion-level scores and actionable feedback.

The evaluator is implemented behind an `Evaluator` interface, allowing future evaluation strategies such as rule-based or human evaluation to be added without changing the core submission flow.

LLD solutions are not expected to have one universally correct implementation. The evaluation therefore focuses on design quality, reasoning, and trade-offs rather than matching a single reference solution.

---

## Submission Model

Each submission contains five sections:

1. **Requirements Understood**
2. **Classes & Responsibilities**
3. **Design & Relationships**
4. **Design Decisions & Explanation**
5. **Trade-offs & Assumptions**

This structure allows the evaluator to assess both the learner's design and the reasoning behind it.

---

## Evaluation Flow

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
          +---- Failed ----> Preserve Submission
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

---

## Reliability

The submission is persisted before AI evaluation begins.

The evaluation lifecycle is:

    EVALUATING
         |
         +----> COMPLETED
         |
         +----> FAILED

If the AI provider fails, the learner's submission remains stored and the evaluation is marked as `FAILED`.

This prevents a temporary AI or provider failure from causing the learner's work to be lost.

---

## Extensibility

The system is designed to allow future improvements without significantly changing the core submission flow.

### Additional Evaluators

The `Evaluator` interface can support future implementations such as:

- Rule-based evaluation
- Human evaluation
- Another LLM provider

### Additional Submission Formats

The current MVP uses structured text submissions. It could later support:

- Code submissions
- UML diagrams
- Mermaid diagrams
- Mixed text and diagram submissions

### Additional Problems

Problems are stored in PostgreSQL rather than hard-coded into the UI, allowing additional LLD problems to be added without changing the core application flow.

---

## Design Decisions

### Simple Monolith

The application uses a Next.js monolith instead of introducing microservices or distributed infrastructure.

This keeps the implementation focused on the assignment's LLD and product requirements while avoiding unnecessary infrastructure complexity.

### Rubric-Based Evaluation

The evaluator uses a rubric instead of comparing submissions against one reference solution.

LLD allows multiple valid designs, so evaluating design quality and reasoning is more appropriate than requiring an exact class structure.

### Deterministic Validation + AI Judgment

Simple predictable checks are handled by application logic.

The LLM is used for qualitative evaluation such as:

- Class responsibilities
- Encapsulation
- Abstraction
- Coupling
- Cohesion
- Extensibility
- Edge cases
- Design reasoning

This avoids using AI for checks that can be handled deterministically.

### Structured AI Output

The AI evaluator returns structured JSON containing:

- Overall score
- Criterion-level scores
- Criterion-level feedback
- Overall feedback

This makes the evaluation result predictable for the frontend and easier to display.

---

## Future Improvements

The MVP intentionally keeps the scope small. Possible future improvements include:

- Background evaluation jobs
- Retry failed evaluations
- Multiple submissions per attempt
- Code editor support
- UML/diagram submissions
- More deterministic evaluation checks
- Progress analytics
- Human review
- Multiple AI providers
- Versioned rubrics
- Additional LLD problems

---

## License

This project was created as an engineering assignment prototype.
