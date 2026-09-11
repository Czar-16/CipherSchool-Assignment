# DesignArena — Research Note

## 1. Problem Understanding

Low-Level Design (LLD) focuses on translating requirements into object-oriented structures such as classes, interfaces, responsibilities, and relationships.

Research into LLD interview preparation consistently emphasizes:

- Understanding requirements
- Identifying domain entities
- Assigning responsibilities to classes
- Applying object-oriented design principles
- Managing coupling and cohesion
- Using abstraction and interfaces appropriately
- Designing for extensibility
- Explaining design decisions and trade-offs

LLD problems commonly include systems such as parking lots, libraries, ticket booking systems, payment systems, and other real-world domain models.

Sources reviewed include LLD interview and object-oriented design material from Educative and public LLD problem repositories on GitHub.

---

## 2. Learner Problem

A learner practicing LLD needs more than a collection of questions.

A useful practice experience should allow the learner to:

1. Understand the problem
2. Think through requirements
3. Design classes and relationships
4. Explain design decisions
5. Submit the solution
6. Receive meaningful feedback
7. Review previous attempts
8. Try again and improve

The main product challenge is that LLD does not usually have one exact correct answer.

Two learners can produce different class structures and still have valid designs.

Therefore, the platform should evaluate the quality of the reasoning and design rather than simply compare the submission against one expected solution.

---

## 3. Research Findings

### 3.1 Requirement Understanding Matters

LLD begins with understanding the problem before creating classes.

A learner should identify:

- Functional requirements
- Important entities
- Main system behavior
- Constraints
- Important assumptions

This is why requirement understanding is included as a separate evaluation criterion.

### 3.2 Class Responsibilities Are Central to LLD

A major part of LLD is deciding what each class should be responsible for.

A good design should avoid classes that take responsibility for unrelated concerns.

For example, a parking-related domain should not have one class responsible for:

- Finding parking spots
- Processing payments
- Sending emails
- Generating reports
- Managing authentication

Separating responsibilities generally improves cohesion and makes the system easier to understand and modify.

### 3.3 Encapsulation and Abstraction

Object-oriented design relies on hiding implementation details and exposing clear interfaces.

For example:

    Payment
       |
       +-- CardPayment
       +-- UPIPayment

The rest of the application can depend on the payment abstraction instead of knowing the implementation details of every payment method.

This allows implementations to change without requiring unrelated parts of the system to change.

### 3.4 Coupling and Cohesion

Two important qualities of an LLD are:

**High cohesion**

A class should contain responsibilities that naturally belong together.

**Low coupling**

Classes should avoid unnecessary dependencies on specific implementation details.

For example, depending directly on a concrete payment implementation makes replacement harder than depending on a suitable abstraction.

These concepts are therefore included in the evaluation rubric.

### 3.5 Extensibility

LLD designs are often evaluated on how easily they can accommodate future requirements.

Examples include:

- Adding another payment method
- Adding another vehicle type
- Adding another notification channel
- Adding another booking rule

Patterns such as Strategy, Factory, and Observer can sometimes help, but patterns should be used when they solve an actual design problem rather than being added only for the sake of using patterns.

Therefore, the platform evaluates extensibility without requiring a particular design pattern.

---

## 4. Evaluation Approach

### Why Not Use a Single Reference Solution?

A single reference solution creates a significant problem for LLD evaluation.

For example, one learner may model a parking system using:

    ParkingLot
    ParkingFloor
    ParkingSpot
    Vehicle
    Ticket

while another may introduce additional abstractions or use different relationships.

Both designs may be reasonable.

A strict reference comparison could therefore mark a valid solution as incorrect simply because it is structurally different.

### Chosen Approach

DesignArena uses a rubric-based evaluation model.

The rubric focuses on qualities that can apply across different valid designs.

---

## 5. Evaluation Rubric

The MVP uses six criteria with 10 points each.

| Criterion                   | What It Evaluates                                                          |
| --------------------------- | -------------------------------------------------------------------------- |
| Requirement Understanding   | Whether important requirements and constraints were identified             |
| Class Responsibilities      | Whether classes have clear and appropriate responsibilities                |
| Encapsulation & Abstraction | Whether implementation details are hidden and abstractions are appropriate |
| Coupling & Cohesion         | Whether dependencies are reasonable and responsibilities are cohesive      |
| Extensibility               | How easily the design can support future requirements                      |
| Edge Cases & Testability    | Whether boundary conditions and testability were considered                |

**Total: 60 points**

The evaluator provides both scores and explanations so that the result is useful for learning rather than being just a number.

---

## 6. Deterministic Checks vs AI Judgment

Not every evaluation task requires AI.

### Deterministic Checks

These are predictable checks such as:

- Required sections are present
- Submission belongs to a valid problem
- Submission can be persisted
- Evaluation state can be tracked

These checks should be handled by application logic.

### AI Judgment

The LLM is better suited to qualitative questions such as:

- Whether responsibilities make sense
- Whether abstractions are appropriate
- Whether coupling could be reduced
- Whether the design is extensible
- Whether important edge cases were considered
- Whether the learner's explanation supports their design

This separation reduces unnecessary AI usage and makes basic validation reliable.

---

## 7. Feedback Design

A useful learning platform should explain why a learner received a score.

The feedback model therefore includes:

    Criterion
        ↓
    Score
        ↓
    Evidence / Explanation
        ↓
    Concern
        ↓
    Suggested Improvement

For example:

    Coupling & Cohesion — 6/10

    The design separates vehicle and parking spot responsibilities well.
    However, the parking manager directly depends on concrete payment
    implementations, which makes replacing the payment mechanism harder.

    Suggestion:
    Depend on a payment abstraction so new payment methods can be added
    without modifying the parking manager.

This gives the learner a concrete direction for improving the next attempt.

---

## 8. Evaluation Reliability

AI evaluation can fail because of:

- Provider errors
- Network failures
- Timeouts
- Temporary service availability
- Unexpected model responses

The system therefore treats evaluation as a separate stage from submission.

The learner's submission is saved before the AI evaluator is called.

The evaluation lifecycle is:

    Submission Created
           |
           v
       EVALUATING
           |
       +---+---+
       |       |
       v       v
    COMPLETED FAILED

This ensures that an AI failure does not erase learner work.

---

## 9. Product Direction

The research suggests that the platform should focus on **practice + feedback + iteration**, rather than simply providing an LLD question bank.

The most valuable loop is:

    Practice
       ↓
    Submit
       ↓
    Get Feedback
       ↓
    Understand Weaknesses
       ↓
    Try Again
       ↓
    Improve

This directly supports the learner's goal of improving their design skills over repeated attempts.

The MVP therefore prioritizes:

- A small set of realistic LLD problems
- A simple submission experience
- Explainable rubric-based feedback
- Submission history
- A clear retry flow

Rather than expanding into a large course platform or complex coding environment.

---

## 10. Sources

### Educative — Grokking the Low Level Design Interview Using OOD Principles

Research material covering object-oriented design, SOLID principles, design patterns, UML, and real-world LLD systems.

https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles

### Educative — Low-Level Design Interview Questions for System Design Roles

Material describing LLD as the process of translating requirements into class structures, responsibilities, relationships, and extensible designs.

https://www.educative.io/blog/low-level-design-interview-questions-for-system-design-roles

### GitHub — LowLevelDesign

Public collection of low-level design problems and implementations used to understand common LLD practice areas.

https://github.com/kousiknath/LowLevelDesign

### GitHub — Low-Level-Design

Public repository containing object-oriented design patterns, UML examples, and LLD interview problems.

https://github.com/davidp918/Low-Level-Design

---

## 11. Conclusion

The research supports a practice experience centered around:

**Problem → Design → Submit → Evaluate → Feedback → Review → Try Again**

Because LLD allows multiple valid solutions, the evaluation system should focus on design quality and reasoning instead of enforcing one reference implementation.

The resulting MVP uses a rubric-based AI evaluator supported by deterministic validation, persistent submissions, explicit evaluation states, and structured feedback.
