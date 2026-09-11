export interface RubricCriterion {
  id: string;
  name: string;
  maxScore: number;
  description: string;
}

export const EVALUATION_RUBRIC: RubricCriterion[] = [
  {
    id: "requirements",
    name: "Requirement Understanding",
    maxScore: 10,
    description: "Evaluates how thoroughly and accurately the problem requirements were identified and parsed.",
  },
  {
    id: "classes",
    name: "Class Responsibilities",
    maxScore: 10,
    description: "Evaluates clarity, Single Responsibility Principle, and breakdown of entities and classes.",
  },
  {
    id: "encapsulation",
    name: "Encapsulation & Abstraction",
    maxScore: 10,
    description: "Evaluates hiding implementation details, access control, and proper use of interfaces/abstract types.",
  },
  {
    id: "coupling_cohesion",
    name: "Coupling & Cohesion",
    maxScore: 10,
    description: "Evaluates modularity, dependency management, low coupling, and high cohesion.",
  },
  {
    id: "extensibility",
    name: "Extensibility",
    maxScore: 10,
    description: "Evaluates design patterns, scalability, and ease of adding new requirements or features.",
  },
  {
    id: "edge_cases",
    name: "Edge Cases & Testability",
    maxScore: 10,
    description: "Evaluates handling of boundary conditions, concurrency, failure modes, and testability.",
  },
];

export const TOTAL_MAX_SCORE = EVALUATION_RUBRIC.reduce((acc, c) => acc + c.maxScore, 0);

export interface EvaluationInput {
  submissionId: number;
  problemId: number;
  problemTitle: string;
  problemDescription: string;
  problemRequirements: string;
  requirements: string;
  classes: string;
  design: string;
  decisions: string;
  tradeoffs: string;
}

export interface CriterionScore {
  criterionId: string;
  score: number;
  feedback: string;
}

export interface EvaluationResult {
  overallScore: number;
  feedback: string;
  status: "COMPLETED" | "FAILED";
  criteriaScores?: CriterionScore[];
}
