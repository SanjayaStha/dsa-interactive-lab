/**
 * Linked List Engine
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export type LinkedListOperation =
  | { type: 'insert'; value: number }
  | { type: 'delete'; value: number }
  | { type: 'search'; value: number };

export class LinkedListEngine extends BaseAlgorithmEngine {
  private operations: LinkedListOperation[] = [];

  initialize(algorithm: Algorithm, input: LinkedListOperation[]): void {
    this.operations = input;
    super.initialize(algorithm, []);
  }

  generateSteps(): AlgorithmStep[] {
    this.steps = [];
    const list: number[] = [];

    const initial = this.createState(list);
    this.steps.push(
      this.createStep(
        'highlight',
        'Linked list initialized (empty)',
        0,
        [],
        initial,
        initial,
        'A linked list stores nodes in sequence. Here we visualize node values as an array from head to tail.'
      )
    );

    this.operations.forEach((op) => {
      if (op.type === 'insert') {
        const before = this.createState(list);
        list.push(op.value);
        this.incrementOperations();
        const after = this.createState(list);

        this.steps.push(
          this.createStep(
            'insert',
            `Insert node ${op.value} at tail`,
            1,
            [list.length - 1],
            before,
            after,
            undefined,
            { value: op.value, size: list.length }
          )
        );
      }

      if (op.type === 'delete') {
        const index = list.indexOf(op.value);
        if (index === -1) {
          const state = this.createState(list);
          this.steps.push(
            this.createStep(
              'highlight',
              `Value ${op.value} not found for deletion`,
              2,
              [],
              state,
              state,
              undefined,
              { value: op.value }
            )
          );
        } else {
          const before = this.createState(list);
          list.splice(index, 1);
          this.incrementOperations();
          const after = this.createState(list);

          this.steps.push(
            this.createStep(
              'delete',
              `Delete node ${op.value}`,
              3,
              [index],
              before,
              after,
              undefined,
              { value: op.value, deletedIndex: index }
            )
          );
        }
      }

      if (op.type === 'search') {
        let foundAt = -1;

        for (let i = 0; i < list.length; i++) {
          this.incrementComparisons();
          const state = this.createState(list);
          this.steps.push(
            this.createStep(
              'compare',
              `Compare node ${list[i]} with target ${op.value}`,
              4,
              [i],
              state,
              state,
              undefined,
              { index: i, current: list[i], target: op.value }
            )
          );

          if (list[i] === op.value) {
            foundAt = i;
            break;
          }
        }

        const final = this.createState(list);
        this.steps.push(
          this.createStep(
            'highlight',
            foundAt >= 0 ? `Found ${op.value} at node ${foundAt}` : `${op.value} not found in list`,
            5,
            foundAt >= 0 ? [foundAt] : [],
            final,
            final,
            undefined,
            { target: op.value, foundAt }
          )
        );
      }
    });

    const done = this.createState(list, { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Linked list operations complete',
        6,
        Array.from({ length: list.length }, (_, i) => i),
        done,
        done
      )
    );

    return this.steps;
  }

  protected createState(data: number[], metadata: Record<string, unknown> = {}) {
    return {
      type: 'linkedlist' as const,
      data: [...data],
      metadata,
    };
  }
}
