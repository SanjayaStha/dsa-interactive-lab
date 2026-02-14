/**
 * Core types for the Algorithm Engine
 * These interfaces define the structure for algorithm execution, state management, and metrics tracking
 */

export type Language = 'python' | 'java' | 'javascript' | 'cpp';

export type DataStructureType = 
  | 'array' 
  | 'linkedlist' 
  | 'tree' 
  | 'graph' 
  | 'stack' 
  | 'queue' 
  | 'hashtable';

export type StepType = 
  | 'compare' 
  | 'swap' 
  | 'insert' 
  | 'delete' 
  | 'update' 
  | 'highlight' 
  | 'traverse';

export type AlgorithmCategory = 
  | 'sorting' 
  | 'searching' 
  | 'graph' 
  | 'dp' 
  | 'recursion';

/**
 * Represents the state of a data structure at a specific point in time
 */
export interface DataStructureState {
  type: DataStructureType;
  data: any;
  metadata: Record<string, any>;
}

/**
 * Metrics tracked during algorithm execution
 */
export interface StepMetrics {
  operationCount: number;
  comparisonCount: number;
  memoryUsage: number;
  timeComplexity: string;
}

/**
 * Represents a single step in algorithm execution
 */
export interface AlgorithmStep {
  id: string;
  type: StepType;
  description: string;
  detailedExplanation?: string; // Detailed explanation of what's happening
  pseudocodeLine: number;
  affectedIndices: number[];
  beforeState: DataStructureState;
  afterState: DataStructureState;
  metrics: StepMetrics;
  variables?: Record<string, any>; // Track temporary variables
}

/**
 * Complexity information for an algorithm
 */
export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  explanation: string;
}

/**
 * Complete algorithm definition
 */
export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  pseudocode: string[];
  implementations: Record<Language, string>;
  timeComplexity: ComplexityInfo;
  spaceComplexity: ComplexityInfo;
}

/**
 * Summary metrics for an algorithm execution
 */
export interface AlgorithmMetrics {
  totalOperations: number;
  totalComparisons: number;
  peakMemoryUsage: number;
  executionSteps: number;
  timeComplexity: ComplexityInfo;
  spaceComplexity: ComplexityInfo;
}

/**
 * Core interface for the Algorithm Engine
 */
export interface AlgorithmEngine {
  /**
   * Initialize the engine with algorithm and input
   */
  initialize(algorithm: Algorithm, input: any): void;
  
  /**
   * Execute algorithm and generate all steps
   */
  generateSteps(): AlgorithmStep[];
  
  /**
   * Get current step
   */
  getCurrentStep(): AlgorithmStep | null;
  
  /**
   * Get all steps
   */
  getAllSteps(): AlgorithmStep[];
  
  /**
   * Get metrics summary
   */
  getMetrics(): AlgorithmMetrics;
}
