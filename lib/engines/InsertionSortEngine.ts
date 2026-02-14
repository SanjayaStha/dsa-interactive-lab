/**
 * Insertion Sort Algorithm Engine
 * Implements step-by-step insertion sort with visualization support
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class InsertionSortEngine extends BaseAlgorithmEngine {
  /**
   * Generate all steps for insertion sort algorithm
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
        'Starting Insertion Sort',
        0,
        [],
        initialState,
        initialState
      )
    );

    // Insertion sort algorithm
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      // Highlight key element
      const keyState = this.createState(arr, { key: i });
      this.steps.push(
        this.createStep(
          'highlight',
          `Inserting element ${key} into sorted portion`,
          2,
          [i],
          keyState,
          keyState
        )
      );

      // Move elements greater than key
      while (j >= 0 && arr[j] > key) {
        this.incrementComparisons();

        const compareState = this.createState(arr);
        this.steps.push(
          this.createStep(
            'compare',
            `Comparing ${arr[j]} with ${key}`,
            4,
            [j, j + 1],
            compareState,
            compareState
          )
        );

        // Shift element
        const beforeShift = this.createState(arr);
        arr[j + 1] = arr[j];
        this.incrementOperations();

        const afterShift = this.createState(arr);
        this.steps.push(
          this.createStep(
            'update',
            `Shifting ${arr[j + 1]} to the right`,
            5,
            [j, j + 1],
            beforeShift,
            afterShift
          )
        );

        j--;
      }

      // Insert key
      const beforeInsert = this.createState(arr);
      arr[j + 1] = key;
      this.incrementOperations();

      const afterInsert = this.createState(arr);
      this.steps.push(
        this.createStep(
          'insert',
          `Inserting ${key} at index ${j + 1}`,
          7,
          [j + 1],
          beforeInsert,
          afterInsert
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
