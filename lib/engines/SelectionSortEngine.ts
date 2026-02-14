/**
 * Selection Sort Algorithm Engine
 * Implements step-by-step selection sort with visualization support
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class SelectionSortEngine extends BaseAlgorithmEngine {
  /**
   * Generate all steps for selection sort algorithm
   */
  generateSteps(): AlgorithmStep[] {
    if (!this.input || !Array.isArray(this.input)) {
      throw new Error('Input must be an array');
    }

    this.steps = [];
    const arr = [...this.input];
    const n = arr.length;

    // Initial state
    const initialState = this.createState(arr);
    this.steps.push(
      this.createStep(
        'highlight',
        'Starting Selection Sort',
        0,
        [],
        initialState,
        initialState
      )
    );

    // Selection sort algorithm
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // Highlight current position
      const startState = this.createState(arr, { currentIndex: i });
      this.steps.push(
        this.createStep(
          'highlight',
          `Finding minimum element from index ${i}`,
          1,
          [i],
          startState,
          startState
        )
      );

      // Find minimum element
      for (let j = i + 1; j < n; j++) {
        this.incrementComparisons();

        const compareState = this.createState(arr, { minIdx, comparing: j });
        this.steps.push(
          this.createStep(
            'compare',
            `Comparing ${arr[minIdx]} with ${arr[j]}`,
            3,
            [minIdx, j],
            compareState,
            compareState
          )
        );

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          const newMinState = this.createState(arr, { minIdx });
          this.steps.push(
            this.createStep(
              'highlight',
              `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
              4,
              [minIdx],
              newMinState,
              newMinState
            )
          );
        }
      }

      // Swap if needed
      if (minIdx !== i) {
        const beforeSwap = this.createState(arr);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        this.incrementOperations();

        const afterSwap = this.createState(arr);
        this.steps.push(
          this.createStep(
            'swap',
            `Swapping ${arr[minIdx]} and ${arr[i]}`,
            6,
            [i, minIdx],
            beforeSwap,
            afterSwap
          )
        );
      }

      // Mark as sorted
      const sortedState = this.createState(arr, { sortedIndex: i });
      this.steps.push(
        this.createStep(
          'highlight',
          `Element at index ${i} is now in its final position`,
          7,
          [i],
          sortedState,
          sortedState
        )
      );
    }

    // Final state
    const finalState = this.createState(arr, { sorted: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Array is now sorted',
        8,
        Array.from({ length: n }, (_, i) => i),
        finalState,
        finalState
      )
    );

    return this.steps;
  }

  protected createState(data: any, metadata: Record<string, any> = {}) {
    return {
      type: 'array' as const,
      data: Array.isArray(data) ? [...data] : data,
      metadata,
    };
  }
}
