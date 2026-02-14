/**
 * Types for Session Management and Progress Tracking
 */

export type SessionSectionType = 
  | 'concept' 
  | 'demo' 
  | 'simulation' 
  | 'sandbox' 
  | 'exercise' 
  | 'challenge' 
  | 'complexity';

export type ModuleCategory = 'data-structure' | 'algorithm';
export type ModuleDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * A single section within a learning session
 */
export interface SessionSection {
  type: SessionSectionType;
  title: string;
  content: any;
  completed: boolean;
}

/**
 * Progress tracking for a session
 */
export interface SessionProgress {
  conceptCompleted: boolean;
  demoCompleted: boolean;
  simulationCompleted: boolean;
  sandboxCompleted: boolean;
  exercisesCompleted: number;
  challengeCompleted: boolean;
  complexityReviewed: boolean;
}

/**
 * Complete learning session
 */
export interface Session {
  moduleId: string;
  sections: SessionSection[];
  currentSectionIndex: number;
  progress: SessionProgress;
}

/**
 * Session Manager interface
 */
export interface SessionManager {
  startSession(moduleId: string): Session;
  getCurrentSection(): SessionSection;
  completeSection(): void;
  nextSection(): void;
  previousSection(): void;
  getProgress(): SessionProgress;
}

/**
 * Concept explanation section
 */
export interface ConceptSection {
  title: string;
  explanation: string;
  diagrams: string[];
  keyPoints: string[];
}

/**
 * Demo section with sample execution
 */
export interface DemoSection {
  algorithmId: string;
  sampleInput: any;
  narration: string[];
}

/**
 * Interactive simulation section
 */
export interface SimulationSection {
  algorithmId: string;
  interactiveControls: boolean;
}

/**
 * Sandbox section for experimentation
 */
export interface SandboxSection {
  algorithmId: string;
  defaultInput: any;
  hints: string[];
}

/**
 * Practice exercise
 */
export interface Exercise {
  id: string;
  title: string;
  description: string;
  input: any;
  expectedOutput: any;
  hints: string[];
}

/**
 * Test case for challenges
 */
export interface TestCase {
  input: any;
  expectedOutput: any;
  hidden: boolean;
}

/**
 * Challenge problem
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'medium' | 'hard';
  testCases: TestCase[];
}

/**
 * Complexity breakdown section
 */
export interface ComplexitySection {
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
    explanation: string;
  };
  spaceComplexity: {
    best: string;
    average: string;
    worst: string;
    explanation: string;
  };
  comparisonChart: ComparisonData[];
}

/**
 * Algorithm comparison data
 */
export interface ComparisonData {
  algorithmName: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestFor: string;
}

/**
 * Complete module content
 */
export interface ModuleContent {
  concept: ConceptSection;
  demo: DemoSection;
  simulation: SimulationSection;
  sandbox: SandboxSection;
  exercises: Exercise[];
  challenge: Challenge;
  complexity: ComplexitySection;
}

/**
 * Module definition
 */
export interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  subcategory: string;
  difficulty: ModuleDifficulty;
  description: string;
  content: ModuleContent;
  createdAt: Date;
}
