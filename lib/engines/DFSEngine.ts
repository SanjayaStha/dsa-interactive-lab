/**
 * Depth-First Search Engine
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

interface DFSInput {
  adjacency: Record<number, number[]>;
  start: number;
}

export class DFSEngine extends BaseAlgorithmEngine {
  initialize(algorithm: Algorithm, input: DFSInput): void {
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    if (!this.input || !this.input.adjacency) {
      throw new Error('Invalid DFS input');
    }

    this.steps = [];
    const { adjacency, start } = this.input as DFSInput;
    const visited = new Set<number>();
    const order: number[] = [];

    const initial = this.createState(order);
    this.steps.push(
      this.createStep(
        'highlight',
        `Start DFS from node ${start}`,
        0,
        [],
        initial,
        initial
      )
    );

    const dfs = (node: number) => {
      visited.add(node);
      order.push(node);
      this.incrementOperations();

      const state = this.createState(order);
      this.steps.push(
        this.createStep(
          'traverse',
          `Visit node ${node}`,
          1,
          [order.length - 1],
          state,
          state,
          undefined,
          { node, visited: `[${Array.from(visited).join(', ')}]` }
        )
      );

      const neighbors = adjacency[node] || [];
      neighbors.forEach((neighbor) => {
        this.incrementComparisons();
        if (!visited.has(neighbor)) {
          const before = this.createState(order);
          this.steps.push(
            this.createStep(
              'highlight',
              `Traverse edge ${node} -> ${neighbor}`,
              2,
              [order.length - 1],
              before,
              before,
              undefined,
              { from: node, to: neighbor }
            )
          );
          dfs(neighbor);
        }
      });
    };

    dfs(start);

    const finalState = this.createState(order, { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'DFS traversal complete',
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
