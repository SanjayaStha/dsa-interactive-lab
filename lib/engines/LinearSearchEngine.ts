/**
 * Linear Search Algorithm Engine
 * Implements step-by-step linear search with element-by-element comparison
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class LinearSearchEngine extends BaseAlgorithmEngine {
  private target: number = 0;

  /**
   * Initialize with array and target value
   */
  initialize(algorithm: any, input: { array: number[]; target: number }): void {
    super.initialize(algorithm, input.array);
    this.target = input.target;
  }

  /**
   * Generate all steps for linear search algorithm
   */
  generateSteps(): AlgorithmStep[] {
    if (!this.input || !Array.isArray(this.input)) {
      throw new Error('Input must be an array');
    }

    this.steps = [];
    const arr = [...this.input];

    // Initial state
    const initialState = this.createState(arr);
    this.steps.push(
      this.createStep(
        'highlight',
        `Starting Linear Search for target: ${this.target}`,
        0,
        [],
        initialState,
        initialState
      )
    );

    let found = false;
    let foundIndex = -1;

    // Linear search
    for (let i = 0; i < arr.length; i++) {
      this.incrementComparisons();

      const compareState = this.createState(arr, { searching: i });
      this.steps.push(
        this.createStep(
          'compare',
          `Comparing ${arr[i]} with target ${this.target}`,
          2,
          [i],
          compareState,
          compareState
        )
      );

      if (arr[i] === this.target) {
        found = true;
        foundIndex = i;

        const foundState = this.createState(arr, { found: i });
        this.steps.push(
          this.createStep(
            'highlight',
            `Target ${this.target} found at index ${i}!`,
            3,
            [i],
            foundState,
            foundState
          )
        );
        break;
      }
    }

    // Final state
    if (!found) {
      const notFoundState = this.createState(arr, { notFound: true });
      this.steps.push(
        this.createStep(
          'highlight',
          `Target ${this.target} not found in array`,
          5,
          [],
          notFoundState,
          notFoundState
        )
      );
    }

    return this.steps;
  }

  protected createState(data: any, metadata: Record<string, any> = {}) {
    return {
      type: 'array' as const,
      data: Array.isArray(data) ? [...data] : data,
      metadata: { ...metadata, target: this.target },
    };
  }
}
