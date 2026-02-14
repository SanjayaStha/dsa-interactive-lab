/**
 * Quick Sort Algorithm Engine
 * Implements step-by-step quick sort with pivot selection and partitioning
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class QuickSortEngine extends BaseAlgorithmEngine {
  /**
   * Generate all steps for quick sort algorithm
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
        'Starting Quick Sort',
        0,
        [],
        initialState,
        initialState
      )
    );

    // Perform quick sort
    this.quickSortRecursive(arr, 0, arr.length - 1, 0);

    // Final state
    const finalState = this.createState(arr, { sorted: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Array is now sorted',
        10,
        Array.from({ length: arr.length }, (_, i) => i),
        finalState,
        finalState
      )
    );

    return this.steps;
  }

  private quickSortRecursive(arr: number[], low: number, high: number, depth: number): void {
    if (low >= high) return;

    const callState = this.createState(arr, { low, high, depth, phase: 'call' });
    this.steps.push(
      this.createStep(
        'highlight',
        `Quick Sort on range [${low}..${high}]`,
        1,
        Array.from({ length: high - low + 1 }, (_, i) => low + i),
        callState,
        callState
      )
    );

    // Partition the array
    const pivotIndex = this.partition(arr, low, high, depth);

    // Recursively sort left and right subarrays
    this.quickSortRecursive(arr, low, pivotIndex - 1, depth + 1);
    this.quickSortRecursive(arr, pivotIndex + 1, high, depth + 1);
  }

  private partition(arr: number[], low: number, high: number, depth: number): number {
    const pivot = arr[high];

    // Highlight pivot selection
    const pivotState = this.createState(arr, { pivot: high, low, high, depth, phase: 'pivot' });
    this.steps.push(
      this.createStep(
        'highlight',
        `Selected pivot: ${pivot} at index ${high}`,
        2,
        [high],
        pivotState,
        pivotState
      )
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.incrementComparisons();

      const compareState = this.createState(arr, { pivot: high, comparing: j, low, high, depth, phase: 'partition-compare' });
      this.steps.push(
        this.createStep(
          'compare',
          `Comparing ${arr[j]} with pivot ${pivot}`,
          4,
          [j, high],
          compareState,
          compareState
        )
      );

      if (arr[j] < pivot) {
        i++;

        if (i !== j) {
          // Swap elements
          const beforeSwap = this.createState(arr);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          this.incrementOperations();

          const afterSwap = this.createState(arr);
          this.steps.push(
            this.createStep(
              'swap',
              `Swapping ${arr[j]} and ${arr[i]}`,
              5,
              [i, j],
              beforeSwap,
              afterSwap
            )
          );
        }
      }
    }

    // Place pivot in correct position
    const beforePivotSwap = this.createState(arr);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    this.incrementOperations();

    const afterPivotSwap = this.createState(arr);
    this.steps.push(
      this.createStep(
        'swap',
        `Placing pivot ${arr[i + 1]} at index ${i + 1}`,
        7,
        [i + 1, high],
        beforePivotSwap,
        afterPivotSwap
      )
    );

    // Highlight partitioned section
    const partitionState = this.createState(arr, { partitioned: i + 1, low, high, depth, phase: 'partition-done' });
    this.steps.push(
      this.createStep(
        'highlight',
        `Partition complete. Pivot at index ${i + 1}`,
        8,
        [i + 1],
        partitionState,
        partitionState
      )
    );

    return i + 1;
  }

  protected createState(data: unknown, metadata: Record<string, unknown> = {}) {
    return {
      type: 'array' as const,
      data: Array.isArray(data) ? [...data] : data,
      metadata,
    };
  }
}
