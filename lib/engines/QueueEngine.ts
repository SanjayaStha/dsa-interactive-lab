/**
 * Queue Data Structure Engine
 * Implements step-by-step queue operations (enqueue, dequeue) with FIFO visualization
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

type QueueOperation = 
  | { type: 'enqueue'; value: number }
  | { type: 'dequeue' }
  | { type: 'peek' };

export class QueueEngine extends BaseAlgorithmEngine {
  private operations: QueueOperation[] = [];

  /**
   * Initialize with operations to perform
   */
  initialize(algorithm: any, input: QueueOperation[]): void {
    this.operations = input;
    super.initialize(algorithm, []);
  }

  /**
   * Generate all steps for queue operations
   */
  generateSteps(): AlgorithmStep[] {
    this.steps = [];
    const queue: number[] = [];

    // Initial state
    const initialState = this.createQueueState(queue);
    this.steps.push(
      this.createStep(
        'highlight',
        'Queue initialized (empty)',
        0,
        [],
        initialState,
        initialState
      )
    );

    // Execute operations
    for (let i = 0; i < this.operations.length; i++) {
      const op = this.operations[i];

      if (op.type === 'enqueue') {
        const beforeEnqueue = this.createQueueState(queue);
        queue.push(op.value);
        this.incrementOperations();

        const afterEnqueue = this.createQueueState(queue, { rear: queue.length - 1 });
        this.steps.push(
          this.createStep(
            'insert',
            `Enqueue ${op.value} to rear of queue`,
            2,
            [queue.length - 1],
            beforeEnqueue,
            afterEnqueue
          )
        );

        // Highlight front and rear
        const queueState = this.createQueueState(queue, { front: 0, rear: queue.length - 1 });
        this.steps.push(
          this.createStep(
            'highlight',
            `Front: ${queue[0]}, Rear: ${queue[queue.length - 1]}`,
            3,
            [0, queue.length - 1],
            queueState,
            queueState
          )
        );
      } else if (op.type === 'dequeue') {
        if (queue.length === 0) {
          const underflowState = this.createQueueState(queue, { underflow: true });
          this.steps.push(
            this.createStep(
              'highlight',
              'Queue underflow! Cannot dequeue from empty queue',
              5,
              [],
              underflowState,
              underflowState
            )
          );
        } else {
          const beforeDequeue = this.createQueueState(queue);
          const dequeuedValue = queue.shift()!;
          this.incrementOperations();

          const afterDequeue = this.createQueueState(queue);
          this.steps.push(
            this.createStep(
              'delete',
              `Dequeue ${dequeuedValue} from front of queue`,
              6,
              [0],
              beforeDequeue,
              afterDequeue
            )
          );

          if (queue.length > 0) {
            const newFrontState = this.createQueueState(queue, { front: 0 });
            this.steps.push(
              this.createStep(
                'highlight',
                `New front element is ${queue[0]}`,
                7,
                [0],
                newFrontState,
                newFrontState
              )
            );
          }
        }
      } else if (op.type === 'peek') {
        if (queue.length === 0) {
          const emptyState = this.createQueueState(queue);
          this.steps.push(
            this.createStep(
              'highlight',
              'Queue is empty, nothing to peek',
              9,
              [],
              emptyState,
              emptyState
            )
          );
        } else {
          const peekState = this.createQueueState(queue, { peeking: true });
          this.steps.push(
            this.createStep(
              'highlight',
              `Peek: Front element is ${queue[0]}`,
              10,
              [0],
              peekState,
              peekState
            )
          );
        }
      }
    }

    // Final state
    const finalState = this.createQueueState(queue, { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        `Operations complete. Queue size: ${queue.length}`,
        12,
        Array.from({ length: queue.length }, (_, i) => i),
        finalState,
        finalState
      )
    );

    return this.steps;
  }

  private createQueueState(queue: number[], metadata: Record<string, any> = {}) {
    return {
      type: 'queue' as const,
      data: [...queue],
      metadata,
    };
  }

  protected createState(data: any, metadata: Record<string, any> = {}) {
    return this.createQueueState(data, metadata);
  }
}
