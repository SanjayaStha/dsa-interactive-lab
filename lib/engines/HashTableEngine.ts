/**
 * Hash Table Engine (linear probing)
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

export type HashTableOperation =
  | { type: 'set'; key: number; value: number }
  | { type: 'get'; key: number }
  | { type: 'delete'; key: number };

interface HashTableInput {
  size: number;
  operations: HashTableOperation[];
}

export class HashTableEngine extends BaseAlgorithmEngine {
  private tableSize = 7;
  private operations: HashTableOperation[] = [];

  initialize(algorithm: Algorithm, input: HashTableInput): void {
    this.tableSize = Math.max(3, input.size);
    this.operations = input.operations;
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    this.steps = [];
    const table = Array.from<number>({ length: this.tableSize }).fill(-1);

    const initial = this.createState(table);
    this.steps.push(
      this.createStep(
        'highlight',
        `Hash table initialized with ${this.tableSize} buckets`,
        0,
        [],
        initial,
        initial
      )
    );

    const hash = (key: number) => key % this.tableSize;

    const findSlot = (key: number) => {
      let slot = hash(key);
      let probes = 0;

      while (probes < this.tableSize && table[slot] !== -1 && table[slot] !== key) {
        this.incrementComparisons();
        slot = (slot + 1) % this.tableSize;
        probes++;
      }

      return slot;
    };

    this.operations.forEach((op) => {
      if (op.type === 'set') {
        const before = this.createState(table);
        const slot = findSlot(op.key);
        table[slot] = op.key;
        this.incrementOperations();
        const after = this.createState(table);

        this.steps.push(
          this.createStep(
            'insert',
            `Set key ${op.key} at slot ${slot}`,
            1,
            [slot],
            before,
            after,
            undefined,
            { key: op.key, value: op.value, slot }
          )
        );
      }

      if (op.type === 'get') {
        let slot = hash(op.key);
        let probes = 0;
        let found = -1;

        while (probes < this.tableSize && table[slot] !== -1) {
          this.incrementComparisons();
          const state = this.createState(table);
          this.steps.push(
            this.createStep(
              'compare',
              `Probe slot ${slot} for key ${op.key}`,
              2,
              [slot],
              state,
              state,
              undefined,
              { key: op.key, slot, stored: table[slot] }
            )
          );

          if (table[slot] === op.key) {
            found = slot;
            break;
          }

          slot = (slot + 1) % this.tableSize;
          probes++;
        }

        const state = this.createState(table);
        this.steps.push(
          this.createStep(
            'highlight',
            found >= 0 ? `Key ${op.key} found at slot ${found}` : `Key ${op.key} not found`,
            3,
            found >= 0 ? [found] : [],
            state,
            state,
            undefined,
            { key: op.key, found }
          )
        );
      }

      if (op.type === 'delete') {
        let slot = hash(op.key);
        let probes = 0;
        let found = -1;

        while (probes < this.tableSize && table[slot] !== -1) {
          this.incrementComparisons();
          if (table[slot] === op.key) {
            found = slot;
            break;
          }
          slot = (slot + 1) % this.tableSize;
          probes++;
        }

        if (found >= 0) {
          const before = this.createState(table);
          table[found] = -1;
          this.incrementOperations();
          const after = this.createState(table);

          this.steps.push(
            this.createStep(
              'delete',
              `Delete key ${op.key} from slot ${found}`,
              4,
              [found],
              before,
              after,
              undefined,
              { key: op.key, slot: found }
            )
          );
        }
      }
    });

    const finalState = this.createState(table, { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Hash table operations complete',
        5,
        Array.from({ length: table.length }, (_, i) => i),
        finalState,
        finalState
      )
    );

    return this.steps;
  }

  protected createState(data: number[], metadata: Record<string, unknown> = {}) {
    return {
      type: 'hashtable' as const,
      data: [...data],
      metadata,
    };
  }
}
