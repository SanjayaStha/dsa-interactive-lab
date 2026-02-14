/**
 * Grid Pathfinding Engine (BFS, Dijkstra, A*)
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

type PathfindingAlgorithm = 'pathfinding-bfs' | 'pathfinding-dijkstra' | 'pathfinding-astar';

type GridCell = [number, number];

interface GridPathfindingInput {
  rows: number;
  cols: number;
  start: GridCell;
  end: GridCell;
  walls: boolean[][];
  algorithm: PathfindingAlgorithm;
}

interface GridStepData {
  rows: number;
  cols: number;
  start: GridCell;
  end: GridCell;
  walls: boolean[][];
  visitedOrder: GridCell[];
  frontier: GridCell[];
  current: GridCell | null;
  finalPath: GridCell[];
}

export class GridPathfindingEngine extends BaseAlgorithmEngine {
  private static readonly VISIT_STEP_INTERVAL = 12;
  private static readonly PATH_STEP_INTERVAL = 4;

  private rows = 0;
  private cols = 0;
  private walls: boolean[][] = [];
  private start: GridCell = [0, 0];
  private end: GridCell = [0, 0];
  private selectedPathAlgorithm: PathfindingAlgorithm = 'pathfinding-bfs';

  initialize(algorithm: Algorithm, input: GridPathfindingInput): void {
    this.rows = input.rows;
    this.cols = input.cols;
    this.walls = input.walls.map((row) => [...row]);
    this.start = [...input.start] as GridCell;
    this.end = [...input.end] as GridCell;
    this.selectedPathAlgorithm = input.algorithm;
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    this.steps = [];

    const visitedOrder: GridCell[] = [];
    const cameFrom = new Map<string, string>();

    const startKey = this.toKey(this.start[0], this.start[1]);
    const endKey = this.toKey(this.end[0], this.end[1]);

    const distances = new Map<string, number>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const openSet = new Set<string>();
    openSet.add(startKey);

    distances.set(startKey, 0);
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(this.start, this.end));

    this.steps.push(
      this.createStep(
        'highlight',
        `Starting ${this.getLabel(this.selectedPathAlgorithm)} from (${this.start[0]}, ${this.start[1]}) to (${this.end[0]}, ${this.end[1]})`,
        0,
        [],
        this.createGridState({ visitedOrder, frontier: [this.start], current: null, finalPath: [] }),
        this.createGridState({ visitedOrder, frontier: [this.start], current: null, finalPath: [] }),
        'Pathfinding explores walkable cells while avoiding walls, then reconstructs the best path to the destination.'
      )
    );

    let found = false;

    while (openSet.size > 0) {
      const currentKey = this.pickNext(openSet, distances, fScore);
      if (!currentKey) {
        break;
      }

      openSet.delete(currentKey);
      const [row, col] = this.fromKey(currentKey);
      const current: GridCell = [row, col];

      if (!visitedOrder.some(([r, c]) => r === row && c === col)) {
        visitedOrder.push(current);
      }

      this.incrementOperations();

      const frontierCells = Array.from(openSet).map((key) => this.fromKey(key) as GridCell);
      if (
        visitedOrder.length === 1 ||
        visitedOrder.length % GridPathfindingEngine.VISIT_STEP_INTERVAL === 0 ||
        currentKey === endKey
      ) {
        this.steps.push(
          this.createStep(
            'traverse',
            `Visiting cell (${row}, ${col})`,
            1,
            [row * this.cols + col],
            this.createGridState({ visitedOrder, frontier: frontierCells, current, finalPath: [] }),
            this.createGridState({ visitedOrder, frontier: frontierCells, current, finalPath: [] }),
            undefined,
            {
              frontierSize: openSet.size,
              visitedCount: visitedOrder.length,
            }
          )
        );
      }

      if (currentKey === endKey) {
        found = true;
        break;
      }

      for (const [nr, nc] of this.neighbors(row, col)) {
        if (this.walls[nr][nc]) {
          continue;
        }

        const neighborKey = this.toKey(nr, nc);
        this.incrementComparisons();

        const newDistance = (distances.get(currentKey) ?? Number.POSITIVE_INFINITY) + 1;
        const newG = (gScore.get(currentKey) ?? Number.POSITIVE_INFINITY) + 1;

        const currentDistance = distances.get(neighborKey) ?? Number.POSITIVE_INFINITY;
        const currentG = gScore.get(neighborKey) ?? Number.POSITIVE_INFINITY;

        let improved = false;

        if (this.selectedPathAlgorithm === 'pathfinding-bfs') {
          if (!distances.has(neighborKey)) {
            distances.set(neighborKey, newDistance);
            improved = true;
          }
        } else if (this.selectedPathAlgorithm === 'pathfinding-dijkstra') {
          if (newDistance < currentDistance) {
            distances.set(neighborKey, newDistance);
            improved = true;
          }
        } else {
          if (newG < currentG) {
            gScore.set(neighborKey, newG);
            fScore.set(neighborKey, newG + this.heuristic([nr, nc], this.end));
            improved = true;
          }
        }

        if (improved) {
          cameFrom.set(neighborKey, currentKey);
          openSet.add(neighborKey);

          const updatedFrontier = Array.from(openSet).map((key) => this.fromKey(key) as GridCell);
          if (visitedOrder.length % GridPathfindingEngine.VISIT_STEP_INTERVAL === 0) {
            this.steps.push(
              this.createStep(
                'highlight',
                `Discover cell (${nr}, ${nc})`,
                2,
                [nr * this.cols + nc],
                this.createGridState({ visitedOrder, frontier: updatedFrontier, current, finalPath: [] }),
                this.createGridState({ visitedOrder, frontier: updatedFrontier, current, finalPath: [] }),
                undefined,
                {
                  parent: `(${row}, ${col})`,
                  discovered: `(${nr}, ${nc})`,
                }
              )
            );
          }
        }
      }
    }

    const finalPath = found ? this.reconstructPath(cameFrom, endKey, startKey) : [];

    if (finalPath.length > 0) {
      const growingPath: GridCell[] = [];
      finalPath.forEach((cell, index) => {
        growingPath.push(cell);
        this.incrementOperations();
        if (
          index === 0 ||
          index === finalPath.length - 1 ||
          index % GridPathfindingEngine.PATH_STEP_INTERVAL === 0
        ) {
          this.steps.push(
            this.createStep(
              'update',
              `Building final path through (${cell[0]}, ${cell[1]})`,
              3,
              [cell[0] * this.cols + cell[1]],
              this.createGridState({ visitedOrder, frontier: [], current: cell, finalPath: [...growingPath] }),
              this.createGridState({ visitedOrder, frontier: [], current: cell, finalPath: [...growingPath] }),
              undefined,
              {
                pathLength: growingPath.length,
              }
            )
          );
        }
      });

      this.steps.push(
        this.createStep(
          'highlight',
          `Path found! Length: ${finalPath.length - 1}`,
          4,
          finalPath.map(([r, c]) => r * this.cols + c),
          this.createGridState({ visitedOrder, frontier: [], current: this.end, finalPath }),
          this.createGridState({ visitedOrder, frontier: [], current: this.end, finalPath }),
          undefined,
          {
            algorithm: this.getLabel(this.selectedPathAlgorithm),
            visited: visitedOrder.length,
            pathLength: finalPath.length,
          }
        )
      );
    } else {
      this.steps.push(
        this.createStep(
          'highlight',
          'No path found from start to end',
          4,
          [],
          this.createGridState({ visitedOrder, frontier: [], current: null, finalPath: [] }),
          this.createGridState({ visitedOrder, frontier: [], current: null, finalPath: [] }),
          undefined,
          {
            algorithm: this.getLabel(this.selectedPathAlgorithm),
            visited: visitedOrder.length,
          }
        )
      );
    }

    return this.steps;
  }

  private createGridState(data: {
    visitedOrder: GridCell[];
    frontier: GridCell[];
    current: GridCell | null;
    finalPath: GridCell[];
  }) {
    const gridData: GridStepData = {
      rows: this.rows,
      cols: this.cols,
      start: this.start,
      end: this.end,
      walls: this.walls.map((row) => [...row]),
      visitedOrder: [...data.visitedOrder],
      frontier: [...data.frontier],
      current: data.current,
      finalPath: [...data.finalPath],
    };

    return {
      type: 'graph' as const,
      data: gridData,
      metadata: {
        rows: this.rows,
        cols: this.cols,
      },
    };
  }

  private toKey(row: number, col: number): string {
    return `${row},${col}`;
  }

  private fromKey(key: string): [number, number] {
    const [row, col] = key.split(',').map(Number);
    return [row, col];
  }

  private neighbors(row: number, col: number): GridCell[] {
    const result: GridCell[] = [];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    directions.forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        result.push([nr, nc]);
      }
    });

    return result;
  }

  private reconstructPath(cameFrom: Map<string, string>, endKey: string, startKey: string): GridCell[] {
    const pathKeys: string[] = [endKey];
    let current = endKey;

    while (current !== startKey) {
      const parent = cameFrom.get(current);
      if (!parent) {
        return [];
      }
      pathKeys.push(parent);
      current = parent;
    }

    pathKeys.reverse();
    return pathKeys.map((key) => this.fromKey(key) as GridCell);
  }

  private heuristic(a: GridCell, b: GridCell): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  private pickNext(
    openSet: Set<string>,
    distances: Map<string, number>,
    fScore: Map<string, number>
  ): string | null {
    let best: string | null = null;
    let bestValue = Number.POSITIVE_INFINITY;

    for (const key of openSet) {
      let value = Number.POSITIVE_INFINITY;
      if (this.selectedPathAlgorithm === 'pathfinding-bfs') {
        value = distances.get(key) ?? Number.POSITIVE_INFINITY;
      } else if (this.selectedPathAlgorithm === 'pathfinding-dijkstra') {
        value = distances.get(key) ?? Number.POSITIVE_INFINITY;
      } else {
        value = fScore.get(key) ?? Number.POSITIVE_INFINITY;
      }

      if (value < bestValue) {
        bestValue = value;
        best = key;
      }
    }

    return best;
  }

  private getLabel(algorithm: PathfindingAlgorithm): string {
    switch (algorithm) {
      case 'pathfinding-bfs':
        return 'Breadth-First Search';
      case 'pathfinding-dijkstra':
        return "Dijkstra's Algorithm";
      case 'pathfinding-astar':
        return 'A* Search';
      default:
        return 'Pathfinding';
    }
  }
}
