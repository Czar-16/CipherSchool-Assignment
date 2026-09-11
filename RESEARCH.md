# Research & LLD Evaluation Criteria

## Overview
This document contains research notes on Low-Level Design evaluation methodologies, rubric definitions, and AI evaluator prompt design.

## Evaluation Rubric (60 Points Total)

1. **Requirement Understanding (10 pts)**
   - Completeness in identifying functional & non-functional requirements.
   - Boundaries and use-cases scoping.

2. **Class Responsibilities (10 pts)**
   - Application of Single Responsibility Principle (SRP).
   - Domain model entity choices.

3. **Encapsulation & Abstraction (10 pts)**
   - Information hiding and accessibility levels.
   - Proper use of abstract classes vs interfaces.

4. **Coupling & Cohesion (10 pts)**
   - Dependency inversion and low coupling between modules.
   - High cohesion within classes.

5. **Extensibility (10 pts)**
   - Open/Closed Principle (OCP) readiness.
   - Identification of appropriate design patterns (Strategy, Factory, Observer, etc.).

6. **Edge Cases & Testability (10 pts)**
   - Boundary condition handling, concurrency assumptions, and testability.

## TODO / Future Research
- [ ] Evaluate LLM prompt strategies for rubric-based scoring.
- [ ] Benchmark zero-shot vs few-shot grading accuracy on standard LLD solutions.
- [ ] Investigate deterministic linting for class diagrams/UML text representations.
