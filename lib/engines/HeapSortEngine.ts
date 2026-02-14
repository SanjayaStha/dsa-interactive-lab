/**
 * Heap Sort Algorithm Engine
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export class HeapSortEngine extends BaseAlgorithmEngine {
  initialize(algorithm: Algorithm, input: number[]): void {
    if (!Array.isArray(input)) {
      throw new Error('Input must be an array');
    }
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    if (!Array.isArray(this.input)) {
      throw new Error('Input must be an array');
    }

    this.steps = [];
    const arr = [...this.input] as number[];
    const n = arr.length;

    const initial = this.createState(arr);
    this.steps.push(
      this.createStep(
        'highlight',
        'Starting Heap Sort',
        0,
        [],
        initial,
        initial,
        'Heap Sort first builds a max-heap, then repeatedly moves the root (largest value) to the end and restores heap order.',
        { size: n }
      )
    );

    const heapify = (size: number, root: number) => {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < size) {
        this.incrementComparisons();
        const before = this.createState(arr, { heapSize: size });
        this.steps.push(
          this.createStep(
            'compare',
            `Compare root ${arr[largest]} with left child ${arr[left]}`,
            2,
            [largest, left],
            before,
            before,
            undefined,
            { root, left, heapSize: size }
          )
        );

        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        this.incrementComparisons();
        const before = this.createState(arr, { heapSize: size });
        this.steps.push(
          this.createStep(
            'compare',
            `Compare current largest ${arr[largest]} with right child ${arr[right]}`,
            3,
            [largest, right],
            before,
            before,
            undefined,
            { root, right, heapSize: size }
          )
        );

        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== root) {
        const beforeSwap = this.createState(arr, { heapSize: size });
        [arr[root], arr[largest]] = [arr[largest], arr[root]];
        this.incrementOperations();
        const afterSwap = this.createState(arr, { heapSize: size });

        this.steps.push(
          this.createStep(
            'swap',
            `Swap ${arr[largest]} and ${arr[root]} to maintain max-heap`,
            4,
            [root, largest],
            beforeSwap,
            afterSwap,
            undefined,
            { root, largest, heapSize: size }
          )
        );

        heapify(size, largest);
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    const heapBuilt = this.createState(arr);
    this.steps.push(
      this.createStep(
        'highlight',
        'Max-heap built',
        5,
        Array.from({ length: n }, (_, index) => index),
        heapBuilt,
        heapBuilt,
        undefined,
        { heap: `[${arr.join(', ')}]` }
      )
    );

    for (let end = n - 1; end > 0; end--) {
      const beforeSwap = this.createState(arr, { heapSize: end + 1, sortedFrom: end + 1 });
      [arr[0], arr[end]] = [arr[end], arr[0]];
      this.incrementOperations();
      const afterSwap = this.createState(arr, { heapSize: end, sortedFrom: end });

      this.steps.push(
        this.createStep(
          'swap',
          `Move current max ${arr[end]} to index ${end}`,
          6,
          [0, end],
          beforeSwap,
          afterSwap,
          undefined,
          { extractedMax: arr[end], sortedIndex: end }
        )
      );

      heapify(end, 0);
    }

    const finalState = this.createState(arr, { sorted: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Heap Sort complete',
        7,
        Array.from({ length: n }, (_, index) => index),
        finalState,
        finalState,
        undefined,
        { sorted: `[${arr.join(', ')}]` }
      )
    );

    return this.steps;
  }

  protected createState(data: number[], metadata: Record<string, unknown> = {}) {
    return {
      type: 'array' as const,
      data: [...data],
      metadata,
    };
  }
}
