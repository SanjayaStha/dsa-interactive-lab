/**
 * Bubble Sort Algorithm Engine
 * Implements step-by-step bubble sort with visualization support
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class BubbleSortEngine extends BaseAlgorithmEngine {
  /**
   * Generate all steps for bubble sort algorithm
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
        'Starting Bubble Sort',
        0,
        [],
        initialState,
        initialState,
        'We will iterate through the array multiple times, comparing adjacent elements and swapping them if they are in the wrong order. This "bubbles" the largest element to the end in each pass.',
        { n: n, i: 0, j: 0 }
      )
    );

    // Bubble sort algorithm
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.incrementComparisons();

        // Comparison step
        const beforeCompare = this.createState(arr);
        this.steps.push(
          this.createStep(
            'compare',
            `Comparing ${arr[j]} and ${arr[j + 1]}`,
            3,
            [j, j + 1],
            beforeCompare,
            beforeCompare,
            `We compare arr[${j}] = ${arr[j]} with arr[${j + 1}] = ${arr[j + 1]}. If arr[${j}] > arr[${j + 1}], we need to swap them to maintain ascending order.`,
            { i: i, j: j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], comparing: `${arr[j]} vs ${arr[j + 1]}` }
          )
        );

        if (arr[j] > arr[j + 1]) {
          // Swap step
          const beforeSwap = this.createState(arr);
          const temp = arr[j];
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.incrementOperations();

          const afterSwap = this.createState(arr);
          this.steps.push(
            this.createStep(
              'swap',
              `Swapping ${arr[j + 1]} and ${arr[j]}`,
              4,
              [j, j + 1],
              beforeSwap,
              afterSwap,
              `Since ${temp} > ${arr[j]}, we swap them. We use a temporary variable: temp = ${temp}, then arr[${j}] = ${arr[j]}, and arr[${j + 1}] = ${temp}. After swap: [${arr.join(', ')}]`,
              { i: i, j: j, temp: temp, 'before swap': `[${beforeSwap.data.join(', ')}]`, 'after swap': `[${arr.join(', ')}]` }
            )
          );
        }
      }

      // Mark sorted element
      const sortedState = this.createState(arr, { sortedIndex: n - i - 1 });
      this.steps.push(
        this.createStep(
          'highlight',
          `Element at index ${n - i - 1} is now in its final position`,
          6,
          [n - i - 1],
          sortedState,
          sortedState,
          `Pass ${i + 1} complete! The largest element in the unsorted portion (${arr[n - i - 1]}) has "bubbled" to position ${n - i - 1}. It is now in its final sorted position.`,
          { pass: i + 1, 'sorted position': n - i - 1, 'sorted element': arr[n - i - 1], 'remaining passes': n - i - 2 }
        )
      );
    }

    // Final state
    const finalState = this.createState(arr, { sorted: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Array is now sorted',
        7,
        Array.from({ length: n }, (_, i) => i),
        finalState,
        finalState,
        `Bubble Sort complete! All elements are now in ascending order. Total comparisons: ${this.comparisonCount}, Total swaps: ${this.operationCount}. The array [${arr.join(', ')}] is fully sorted.`,
        { 'total comparisons': this.comparisonCount, 'total swaps': this.operationCount, 'sorted array': `[${arr.join(', ')}]` }
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
