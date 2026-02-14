/**
 * Merge Sort Algorithm Engine
 * Implements step-by-step merge sort with divide-and-conquer visualization
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class MergeSortEngine extends BaseAlgorithmEngine {
  /**
   * Generate all steps for merge sort algorithm
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
        'Starting Merge Sort',
        0,
        [],
        initialState,
        initialState
      )
    );

    // Perform merge sort
    this.mergeSortRecursive(arr, 0, arr.length - 1, 0);

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

  private mergeSortRecursive(arr: number[], left: number, right: number, depth: number): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Divide phase
    const divideState = this.createState(arr, { dividing: true, left, mid, right, depth, phase: 'divide' });
    this.steps.push(
      this.createStep(
        'highlight',
        `Dividing array from index ${left} to ${right}`,
        2,
        Array.from({ length: right - left + 1 }, (_, i) => left + i),
        divideState,
        divideState
      )
    );

    // Sort left half
    this.mergeSortRecursive(arr, left, mid, depth + 1);

    // Sort right half
    this.mergeSortRecursive(arr, mid + 1, right, depth + 1);

    // Merge phase
    this.merge(arr, left, mid, right, depth);
  }

  private merge(arr: number[], left: number, mid: number, right: number, depth: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    const mergeState = this.createState(arr, { merging: true, left, mid, right, depth, phase: 'merge' });
    this.steps.push(
      this.createStep(
        'highlight',
        `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
        5,
        Array.from({ length: right - left + 1 }, (_, i) => left + i),
        mergeState,
        mergeState
      )
    );

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.incrementComparisons();

      const compareState = this.createState(arr);
      this.steps.push(
        this.createStep(
          'compare',
          `Comparing ${leftArr[i]} and ${rightArr[j]}`,
          6,
          [left + i, mid + 1 + j],
          compareState,
          compareState
        )
      );

      const beforeUpdate = this.createState(arr);
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      this.incrementOperations();

      const afterUpdate = this.createState(arr);
      this.steps.push(
        this.createStep(
          'update',
          `Placing ${arr[k]} at index ${k}`,
          7,
          [k],
          beforeUpdate,
          afterUpdate
        )
      );
      k++;
    }

    // Copy remaining elements
    while (i < leftArr.length) {
      const beforeUpdate = this.createState(arr);
      arr[k] = leftArr[i];
      this.incrementOperations();
      const afterUpdate = this.createState(arr);
      this.steps.push(
        this.createStep(
          'update',
          `Copying remaining element ${arr[k]} to index ${k}`,
          8,
          [k],
          beforeUpdate,
          afterUpdate
        )
      );
      i++;
      k++;
    }

    while (j < rightArr.length) {
      const beforeUpdate = this.createState(arr);
      arr[k] = rightArr[j];
      this.incrementOperations();
      const afterUpdate = this.createState(arr);
      this.steps.push(
        this.createStep(
          'update',
          `Copying remaining element ${arr[k]} to index ${k}`,
          9,
          [k],
          beforeUpdate,
          afterUpdate
        )
      );
      j++;
      k++;
    }
  }

  protected createState(data: unknown, metadata: Record<string, unknown> = {}) {
    return {
      type: 'array' as const,
      data: Array.isArray(data) ? [...data] : data,
      metadata,
    };
  }
}
