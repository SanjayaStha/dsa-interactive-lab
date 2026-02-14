/**
 * Breadth-First Search Engine
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

interface BFSInput {
  adjacency: Record<number, number[]>;
  start: number;
}

export class BFSEngine extends BaseAlgorithmEngine {
  initialize(algorithm: Algorithm, input: BFSInput): void {
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    if (!this.input || !this.input.adjacency) {
      throw new Error('Invalid BFS input');
    }

    this.steps = [];
    const { adjacency, start } = this.input as BFSInput;

    const visited = new Set<number>();
    const queue: number[] = [start];
    const order: number[] = [];

    const initial = this.createState(order);
    this.steps.push(
      this.createStep(
        'highlight',
        `Start BFS from node ${start}`,
        0,
        [],
        initial,
        initial,
        undefined,
        { queue: `[${queue.join(', ')}]`, visited: '[]' }
      )
    );

    visited.add(start);

    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);
      this.incrementOperations();

      const afterVisit = this.createState(order);
      this.steps.push(
        this.createStep(
          'traverse',
          `Visit node ${node}`,
          1,
          [order.length - 1],
          afterVisit,
          afterVisit,
          undefined,
          { node, queue: `[${queue.join(', ')}]`, visited: `[${Array.from(visited).join(', ')}]` }
        )
      );

      const neighbors = adjacency[node] || [];
      neighbors.forEach((neighbor) => {
        this.incrementComparisons();
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          const state = this.createState(order);
          this.steps.push(
            this.createStep(
              'highlight',
              `Enqueue neighbor ${neighbor}`,
              2,
              [order.length - 1],
              state,
              state,
              undefined,
              { from: node, enqueued: neighbor, queue: `[${queue.join(', ')}]` }
            )
          );
        }
      });
    }

    const finalState = this.createState(order, { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'BFS traversal complete',
        3,
        Array.from({ length: order.length }, (_, i) => i),
        finalState,
        finalState,
        undefined,
        { order: `[${order.join(', ')}]` }
      )
    );

    return this.steps;
  }

  protected createState(data: number[], metadata: Record<string, unknown> = {}) {
    return {
      type: 'graph' as const,
      data: [...data],
      metadata,
    };
  }
}
