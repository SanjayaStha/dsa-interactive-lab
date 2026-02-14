/**
 * Binary Search Algorithm Engine
 * Implements step-by-step binary search with search space halving visualization
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class BinarySearchEngine extends BaseAlgorithmEngine {
  private target: number = 0;

  /**
   * Initialize with sorted array and target value
   */
  initialize(algorithm: any, input: { array: number[]; target: number }): void {
    super.initialize(algorithm, input.array);
    this.target = input.target;
  }

  /**
   * Generate all steps for binary search algorithm
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
        `Starting Binary Search for target: ${this.target}`,
        0,
        [],
        initialState,
        initialState,
        `Binary search works on sorted arrays by repeatedly dividing the search space in half. We'll compare the target ${this.target} with the middle element and eliminate half of the remaining elements in each step.`,
        { target: this.target, 'array size': arr.length, left: 0, right: arr.length - 1 }
      )
    );

    let left = 0;
    let right = arr.length - 1;
    let found = false;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // Highlight search space
      const searchSpaceState = this.createState(arr, { left, right, mid });
      this.steps.push(
        this.createStep(
          'highlight',
          `Search space: [${left}..${right}], checking middle index ${mid}`,
          2,
          Array.from({ length: right - left + 1 }, (_, i) => left + i),
          searchSpaceState,
          searchSpaceState,
          `Current search boundaries: left = ${left}, right = ${right}. We calculate mid = floor((${left} + ${right}) / 2) = ${mid}. The middle element is arr[${mid}] = ${arr[mid]}.`,
          { left: left, right: right, mid: mid, 'arr[mid]': arr[mid], 'search space size': right - left + 1 }
        )
      );

      this.incrementComparisons();

      // Compare with middle element
      const compareState = this.createState(arr, { left, right, mid, comparing: true });
      this.steps.push(
        this.createStep(
          'compare',
          `Comparing ${arr[mid]} with target ${this.target}`,
          3,
          [mid],
          compareState,
          compareState,
          `We compare the middle element arr[${mid}] = ${arr[mid]} with our target ${this.target}. If they're equal, we found it! If target is greater, search right half. If target is smaller, search left half.`,
          { 'arr[mid]': arr[mid], target: this.target, comparison: `${arr[mid]} vs ${this.target}` }
        )
      );

      if (arr[mid] === this.target) {
        found = true;
        const foundState = this.createState(arr, { found: mid });
        this.steps.push(
          this.createStep(
            'highlight',
            `Target ${this.target} found at index ${mid}!`,
            4,
            [mid],
            foundState,
            foundState,
            `Success! arr[${mid}] = ${arr[mid]} equals our target ${this.target}. Binary search found the element in O(log n) time, making ${this.comparisonCount} comparisons.`,
            { 'found at': mid, value: arr[mid], 'total comparisons': this.comparisonCount }
          )
        );
        break;
      } else if (arr[mid] < this.target) {
        // Search right half
        const rightState = this.createState(arr, { left: mid + 1, right });
        this.steps.push(
          this.createStep(
            'highlight',
            `${arr[mid]} < ${this.target}, searching right half`,
            6,
            Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
            rightState,
            rightState,
            `Since ${arr[mid]} < ${this.target}, the target must be in the right half. We eliminate the left half and middle element by setting left = mid + 1 = ${mid + 1}. New search space: [${mid + 1}..${right}].`,
            { decision: 'search right', 'new left': mid + 1, right: right, 'elements eliminated': mid + 1 }
          )
        );
        left = mid + 1;
      } else {
        // Search left half
        const leftState = this.createState(arr, { left, right: mid - 1 });
        this.steps.push(
          this.createStep(
            'highlight',
            `${arr[mid]} > ${this.target}, searching left half`,
            8,
            Array.from({ length: mid - left }, (_, i) => left + i),
            leftState,
            leftState,
            `Since ${arr[mid]} > ${this.target}, the target must be in the left half. We eliminate the right half and middle element by setting right = mid - 1 = ${mid - 1}. New search space: [${left}..${mid - 1}].`,
            { decision: 'search left', left: left, 'new right': mid - 1, 'elements eliminated': arr.length - mid }
          )
        );
        right = mid - 1;
      }
    }

    // Final state
    if (!found) {
      const notFoundState = this.createState(arr, { notFound: true });
      this.steps.push(
        this.createStep(
          'highlight',
          `Target ${this.target} not found in array`,
          10,
          [],
          notFoundState,
          notFoundState,
          `Search space exhausted. The target ${this.target} is not in the array. We made ${this.comparisonCount} comparisons. Binary search guarantees finding an element if it exists, so we can conclude it's not present.`,
          { result: 'not found', target: this.target, 'total comparisons': this.comparisonCount }
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
