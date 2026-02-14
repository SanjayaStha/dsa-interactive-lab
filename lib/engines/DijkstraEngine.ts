/**
 * Dijkstra's Shortest Path Engine
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

interface WeightedEdge {
  to: number;
  weight: number;
}

interface DijkstraInput {
  adjacency: Record<number, WeightedEdge[]>;
  start: number;
}

export class DijkstraEngine extends BaseAlgorithmEngine {
  initialize(algorithm: Algorithm, input: DijkstraInput): void {
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    if (!this.input || !this.input.adjacency) {
      throw new Error('Invalid Dijkstra input');
    }

    this.steps = [];
    const { adjacency, start } = this.input as DijkstraInput;
    const nodes = Object.keys(adjacency).map(Number).sort((a, b) => a - b);
    const distances: Record<number, number> = {};
    const visited = new Set<number>();

    nodes.forEach((node) => {
      distances[node] = Number.POSITIVE_INFINITY;
    });
    distances[start] = 0;

    const toDistanceArray = () => nodes.map((node) => distances[node]);

    const initial = this.createState(toDistanceArray());
    this.steps.push(
      this.createStep(
        'highlight',
        `Initialize distances from source ${start}`,
        0,
        [nodes.indexOf(start)],
        initial,
        initial,
        undefined,
        { distances: JSON.stringify(distances) }
      )
    );

    while (visited.size < nodes.length) {
      let current = -1;
      let minDistance = Number.POSITIVE_INFINITY;

      for (const node of nodes) {
        this.incrementComparisons();
        if (!visited.has(node) && distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === -1) {
        break;
      }

      visited.add(current);
      this.incrementOperations();

      const pickState = this.createState(toDistanceArray());
      this.steps.push(
        this.createStep(
          'highlight',
          `Pick next closest node ${current}`,
          1,
          [nodes.indexOf(current)],
          pickState,
          pickState,
          undefined,
          { node: current, distance: distances[current] }
        )
      );

      const neighbors = adjacency[current] || [];
      neighbors.forEach((edge) => {
        const candidate = distances[current] + edge.weight;
        this.incrementComparisons();

        const before = this.createState(toDistanceArray());
        this.steps.push(
          this.createStep(
            'compare',
            `Check path ${current} -> ${edge.to} (weight ${edge.weight})`,
            2,
            [nodes.indexOf(current), nodes.indexOf(edge.to)],
            before,
            before,
            undefined,
            { from: current, to: edge.to, candidate, currentBest: distances[edge.to] }
          )
        );

        if (candidate < distances[edge.to]) {
          distances[edge.to] = candidate;
          this.incrementOperations();
          const after = this.createState(toDistanceArray());
          this.steps.push(
            this.createStep(
              'update',
              `Update distance of ${edge.to} to ${candidate}`,
              3,
              [nodes.indexOf(edge.to)],
              before,
              after,
              undefined,
              { updatedNode: edge.to, newDistance: candidate }
            )
          );
        }
      });
    }

    const finalState = this.createState(toDistanceArray(), { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        'Dijkstra complete',
        4,
        Array.from({ length: nodes.length }, (_, i) => i),
        finalState,
        finalState,
        undefined,
        { distances: JSON.stringify(distances) }
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
