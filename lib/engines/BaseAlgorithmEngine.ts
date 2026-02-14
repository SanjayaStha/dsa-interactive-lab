/**
 * Base Algorithm Engine Implementation
 * Provides core functionality for step-by-step algorithm execution
 */

import {
  Algorithm,
  AlgorithmEngine,
  AlgorithmStep,
  AlgorithmMetrics,
  DataStructureState,
  StepMetrics,
} from '@/types';

export abstract class BaseAlgorithmEngine implements AlgorithmEngine {
  protected algorithm: Algorithm | null = null;
  protected input: any = null;
  protected steps: AlgorithmStep[] = [];
  protected currentStepIndex: number = -1;
  protected operationCount: number = 0;
  protected comparisonCount: number = 0;
  protected peakMemoryUsage: number = 0;

  /**
   * Initialize the engine with algorithm and input
   */
  initialize(algorithm: Algorithm, input: any): void {
    this.algorithm = algorithm;
    this.input = input;
    this.steps = [];
    this.currentStepIndex = -1;
    this.operationCount = 0;
    this.comparisonCount = 0;
    this.peakMemoryUsage = 0;
  }

  /**
   * Execute algorithm and generate all steps
   * This method must be implemented by subclasses
   */
  abstract generateSteps(): AlgorithmStep[];

  /**
   * Get current step
   */
  getCurrentStep(): AlgorithmStep | null {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.steps.length) {
      return this.steps[this.currentStepIndex];
    }
    return null;
  }

  /**
   * Get all steps
   */
  getAllSteps(): AlgorithmStep[] {
    return this.steps;
  }

  /**
   * Get metrics summary
   */
  getMetrics(): AlgorithmMetrics {
    if (!this.algorithm) {
      throw new Error('Algorithm not initialized');
    }

    return {
      totalOperations: this.operationCount,
      totalComparisons: this.comparisonCount,
      peakMemoryUsage: this.peakMemoryUsage,
      executionSteps: this.steps.length,
      timeComplexity: this.algorithm.timeComplexity,
      spaceComplexity: this.algorithm.spaceComplexity,
    };
  }

  /**
   * Helper method to create a step
   */
  protected createStep(
    type: AlgorithmStep['type'],
    description: string,
    pseudocodeLine: number,
    affectedIndices: number[],
    beforeState: DataStructureState,
    afterState: DataStructureState,
    detailedExplanation?: string,
    variables?: Record<string, any>
  ): AlgorithmStep {
    const stepId = `step-${this.steps.length}`;
    
    const metrics: StepMetrics = {
      operationCount: this.operationCount,
      comparisonCount: this.comparisonCount,
      memoryUsage: this.calculateMemoryUsage(afterState.data),
      timeComplexity: this.algorithm?.timeComplexity.average || 'O(n)',
    };

    // Update peak memory usage
    if (metrics.memoryUsage > this.peakMemoryUsage) {
      this.peakMemoryUsage = metrics.memoryUsage;
    }

    return {
      id: stepId,
      type,
      description,
      detailedExplanation,
      pseudocodeLine,
      affectedIndices,
      beforeState,
      afterState,
      metrics,
      variables,
    };
  }

  /**
   * Calculate memory usage for a data structure
   */
  protected calculateMemoryUsage(data: any): number {
    if (Array.isArray(data)) {
      return data.length;
    }
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).length;
    }
    return 1;
  }

  /**
   * Helper to increment operation count
   */
  protected incrementOperations(): void {
    this.operationCount++;
  }

  /**
   * Helper to increment comparison count
   */
  protected incrementComparisons(): void {
    this.comparisonCount++;
  }

  /**
   * Helper to create a data structure state
   */
  protected createState(data: any, metadata: Record<string, any> = {}): DataStructureState {
    return {
      type: 'array', // Default, should be overridden by subclasses
      data: Array.isArray(data) ? [...data] : data,
      metadata,
    };
  }
}
