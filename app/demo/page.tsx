'use client';

/**
 * Demo Page - Multi-Algorithm Visualizer
 * Allows users to select and visualize different algorithms and data structures
 */

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAnimationStore } from '@/lib/stores/animationStore';
import { ArrayVisualizer } from '@/components/visualizers/ArrayVisualizer';
import { StackVisualizer } from '@/components/visualizers/StackVisualizer';
import { QueueVisualizer } from '@/components/visualizers/QueueVisualizer';
import { GridPathfindingVisualizer } from '@/components/visualizers/GridPathfindingVisualizer';
import { PlaybackControls } from '@/components/controls/PlaybackControls';
import { ExplanationPanel } from '@/components/ui/ExplanationPanel';
import {
  BubbleSortEngine,
  SelectionSortEngine,
  InsertionSortEngine,
  MergeSortEngine,
  QuickSortEngine,
  HeapSortEngine,
  LinearSearchEngine,
  BinarySearchEngine,
  StackEngine,
  QueueEngine,
  LinkedListEngine,
  BinaryTreeEngine,
  HashTableEngine,
  BFSEngine,
  DFSEngine,
  DijkstraEngine,
  GridPathfindingEngine,
} from '@/lib/engines';
import { Algorithm, AlgorithmStep } from '@/types';

type AlgorithmType = 
  | 'bubble-sort' 
  | 'selection-sort' 
  | 'insertion-sort' 
  | 'merge-sort' 
  | 'quick-sort'
  | 'heap-sort'
  | 'linear-search'
  | 'binary-search'
  | 'stack'
  | 'queue'
  | 'linked-list'
  | 'binary-tree'
  | 'hash-table'
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'pathfinding-bfs'
  | 'pathfinding-dijkstra'
  | 'pathfinding-astar';

type GridCell = [number, number];
type PathEditMode = 'wall' | 'erase' | 'start' | 'end';
type PathfindingAlgorithmType = 'pathfinding-bfs' | 'pathfinding-dijkstra' | 'pathfinding-astar';

interface PathfindingComparisonResult {
  algorithm: PathfindingAlgorithmType;
  label: string;
  elapsedMs: number;
  steps: number;
  operations: number;
  comparisons: number;
  peakMemory: number;
  pathLength: number;
  found: boolean;
}

const PATHFINDING_ALGORITHMS: PathfindingAlgorithmType[] = [
  'pathfinding-bfs',
  'pathfinding-dijkstra',
  'pathfinding-astar',
];

const GRID_ROWS = 45;
const GRID_COLS = 60;

const createEmptyWalls = () =>
  Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLS }, () => false));

const mockAlgorithm: Algorithm = {
  id: 'demo',
  name: 'Demo Algorithm',
  category: 'sorting',
  pseudocode: [],
  implementations: { python: '', java: '', javascript: '', cpp: '' },
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', explanation: '' },
  spaceComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', explanation: '' },
};

function DemoPageContent() {
  const searchParams = useSearchParams();
  const algorithmFromUrl = searchParams.get('algorithm') as AlgorithmType | null;
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(algorithmFromUrl || 'bubble-sort');
  const [inputArray, setInputArray] = useState('5,2,8,1,9,3');
  const [searchTarget, setSearchTarget] = useState('8');
  const [stackOps, setStackOps] = useState('push:5,push:3,push:8,pop,push:1');
  const [queueOps, setQueueOps] = useState('enqueue:5,enqueue:3,enqueue:8,dequeue,enqueue:1');
  const [linkedListOps, setLinkedListOps] = useState('insert:5,insert:3,insert:8,search:3,delete:5');
  const [treeValues, setTreeValues] = useState('8,3,10,1,6,14,4,7,13');
  const [hashOps, setHashOps] = useState('set:10:100,set:20:200,get:10,delete:20');
  const [graphEdges, setGraphEdges] = useState('0-1,0-2,1-3,2-4,3-5,4-5');
  const [weightedEdges, setWeightedEdges] = useState('0-1-4,0-2-1,2-1-2,1-3-1,2-3-5');
  const [graphStart, setGraphStart] = useState('0');
  const [gridWalls, setGridWalls] = useState<boolean[][]>(() => createEmptyWalls());
  const [gridStart, setGridStart] = useState<GridCell>([4, 4]);
  const [gridEnd, setGridEnd] = useState<GridCell>([40, 55]);
  const [pathEditMode, setPathEditMode] = useState<PathEditMode>('wall');
  const [pathComparisonResults, setPathComparisonResults] = useState<PathfindingComparisonResult[]>([]);
  const [pathComparisonSteps, setPathComparisonSteps] = useState<Partial<Record<PathfindingAlgorithmType, AlgorithmStep[]>>>({});
  
  const { setSteps, getCurrentStep, playbackStatus, steps, setSpeed } = useAnimationStore();
  const currentStep = getCurrentStep();
  const isPlaying = playbackStatus === 'playing';

  const isPathfindingAlgorithm =
    selectedAlgorithm === 'pathfinding-bfs' ||
    selectedAlgorithm === 'pathfinding-dijkstra' ||
    selectedAlgorithm === 'pathfinding-astar';

  // Update selected algorithm when URL changes
  useEffect(() => {
    if (algorithmFromUrl) {
      setSelectedAlgorithm(algorithmFromUrl);
    }
  }, [algorithmFromUrl]);

  const parseUnweightedGraph = (edges: string): Record<number, number[]> => {
    const adjacency: Record<number, number[]> = {};

    edges
      .split(',')
      .map((edge) => edge.trim())
      .filter(Boolean)
      .forEach((edge) => {
        const [fromRaw, toRaw] = edge.split('-');
        const from = parseInt(fromRaw, 10);
        const to = parseInt(toRaw, 10);

        if (Number.isNaN(from) || Number.isNaN(to)) {
          return;
        }

        if (!adjacency[from]) adjacency[from] = [];
        if (!adjacency[to]) adjacency[to] = [];

        adjacency[from].push(to);
        adjacency[to].push(from);
      });

    return adjacency;
  };

  const parseWeightedGraph = (edges: string): Record<number, { to: number; weight: number }[]> => {
    const adjacency: Record<number, { to: number; weight: number }[]> = {};

    edges
      .split(',')
      .map((edge) => edge.trim())
      .filter(Boolean)
      .forEach((edge) => {
        const [fromRaw, toRaw, weightRaw] = edge.split('-');
        const from = parseInt(fromRaw, 10);
        const to = parseInt(toRaw, 10);
        const weight = parseInt(weightRaw, 10);

        if (Number.isNaN(from) || Number.isNaN(to) || Number.isNaN(weight)) {
          return;
        }

        if (!adjacency[from]) adjacency[from] = [];
        if (!adjacency[to]) adjacency[to] = [];

        adjacency[from].push({ to, weight });
        adjacency[to].push({ to: from, weight });
      });

    return adjacency;
  };

  const getPathfindingLabel = (algorithm: PathfindingAlgorithmType): string => {
    switch (algorithm) {
      case 'pathfinding-bfs':
        return 'Grid BFS';
      case 'pathfinding-dijkstra':
        return 'Grid Dijkstra';
      case 'pathfinding-astar':
        return 'Grid A*';
      default:
        return 'Pathfinding';
    }
  };

  const createPathfindingAlgorithm = (algorithm: PathfindingAlgorithmType): Algorithm => {
    const label = getPathfindingLabel(algorithm);
    const averageTime =
      algorithm === 'pathfinding-bfs'
        ? 'O(V + E)'
        : algorithm === 'pathfinding-dijkstra'
          ? 'O((V + E) log V)'
          : 'O((V + E) log V)';

    return {
      id: algorithm,
      name: label,
      category: 'graph',
      pseudocode: [],
      implementations: { python: '', java: '', javascript: '', cpp: '' },
      timeComplexity: {
        best: 'O(V)',
        average: averageTime,
        worst: averageTime,
        explanation: '',
      },
      spaceComplexity: {
        best: 'O(V)',
        average: 'O(V)',
        worst: 'O(V)',
        explanation: '',
      },
    };
  };

  const getPathResultInfo = (generatedSteps: AlgorithmStep[]) => {
    const lastStep = generatedSteps[generatedSteps.length - 1];
    const data = lastStep?.afterState?.data as { finalPath?: GridCell[] } | undefined;
    const finalPath = Array.isArray(data?.finalPath) ? data.finalPath : [];
    return {
      found: finalPath.length > 0,
      pathLength: finalPath.length > 0 ? finalPath.length - 1 : 0,
    };
  };

  const runPathfindingAlgorithm = (algorithm: PathfindingAlgorithmType) => {
    const engine = new GridPathfindingEngine();
    const algorithmDefinition = createPathfindingAlgorithm(algorithm);
    const startTime = performance.now();

    engine.initialize(algorithmDefinition, {
      rows: GRID_ROWS,
      cols: GRID_COLS,
      walls: gridWalls,
      start: gridStart,
      end: gridEnd,
      algorithm,
    });

    const generatedSteps = engine.generateSteps();
    const metrics = engine.getMetrics();
    const endTime = performance.now();
    const pathInfo = getPathResultInfo(generatedSteps);

    return {
      algorithm,
      label: getPathfindingLabel(algorithm),
      steps: generatedSteps,
      comparison: {
        algorithm,
        label: getPathfindingLabel(algorithm),
        elapsedMs: Number((endTime - startTime).toFixed(2)),
        steps: generatedSteps.length,
        operations: metrics.totalOperations,
        comparisons: metrics.totalComparisons,
        peakMemory: metrics.peakMemoryUsage,
        pathLength: pathInfo.pathLength,
        found: pathInfo.found,
      } as PathfindingComparisonResult,
    };
  };

  const handleComparePathAlgorithms = () => {
    const runs = PATHFINDING_ALGORITHMS.map((algorithm) => runPathfindingAlgorithm(algorithm));
    const nextSteps: Partial<Record<PathfindingAlgorithmType, AlgorithmStep[]>> = {};

    runs.forEach((run) => {
      nextSteps[run.algorithm] = run.steps;
    });

    setPathComparisonSteps(nextSteps);
    setPathComparisonResults(runs.map((run) => run.comparison));

    const current = runs.find((run) => run.algorithm === selectedAlgorithm);
    if (current) {
      setSteps(current.steps);
      setSpeed(4);
    }
  };

  const updateWallCell = (row: number, col: number, addWall: boolean) => {
    setPathComparisonResults([]);
    setPathComparisonSteps({});
    setGridWalls((prev) => {
      const next = prev.map((line) => [...line]);
      let changed = false;
      const brushRadius = 1;

      for (let r = Math.max(0, row - brushRadius); r <= Math.min(GRID_ROWS - 1, row + brushRadius); r++) {
        for (let c = Math.max(0, col - brushRadius); c <= Math.min(GRID_COLS - 1, col + brushRadius); c++) {
          if ((r === gridStart[0] && c === gridStart[1]) || (r === gridEnd[0] && c === gridEnd[1])) {
            continue;
          }

          if (next[r][c] !== addWall) {
            next[r][c] = addWall;
            changed = true;
          }
        }
      }

      if (!changed) {
        return prev;
      }

      return next;
    });
  };

  const clearGridWalls = () => {
    setPathComparisonResults([]);
    setPathComparisonSteps({});
    setGridWalls(createEmptyWalls());
  };

  const setStartCell = (row: number, col: number) => {
    setPathComparisonResults([]);
    setPathComparisonSteps({});
    setGridStart([row, col]);
    setGridWalls((prev) => {
      if (!prev[row][col]) return prev;
      const next = [...prev];
      next[row] = [...next[row]];
      next[row][col] = false;
      return next;
    });
  };

  const setEndCell = (row: number, col: number) => {
    setPathComparisonResults([]);
    setPathComparisonSteps({});
    setGridEnd([row, col]);
    setGridWalls((prev) => {
      if (!prev[row][col]) return prev;
      const next = [...prev];
      next[row] = [...next[row]];
      next[row][col] = false;
      return next;
    });
  };

  const paintRandomWalls = (centerRow: number, centerCol: number) => {
    setPathComparisonResults([]);
    setPathComparisonSteps({});
    setGridWalls((prev) => {
      const next = prev.map((row) => [...row]);
      const radius = 12;

      for (let row = Math.max(0, centerRow - radius); row <= Math.min(GRID_ROWS - 1, centerRow + radius); row++) {
        for (let col = Math.max(0, centerCol - radius); col <= Math.min(GRID_COLS - 1, centerCol + radius); col++) {
          if ((row === gridStart[0] && col === gridStart[1]) || (row === gridEnd[0] && col === gridEnd[1])) {
            continue;
          }

          if (Math.random() < 0.6) {
            next[row][col] = true;
          }
        }
      }

      return next;
    });
  };

  const handleVisualize = () => {
    try {
      if (selectedAlgorithm === 'pathfinding-bfs' || selectedAlgorithm === 'pathfinding-dijkstra' || selectedAlgorithm === 'pathfinding-astar') {
        const run = runPathfindingAlgorithm(selectedAlgorithm);
        setSteps(run.steps);
        setSpeed(4);

        setPathComparisonResults((previous) => {
          const filtered = previous.filter((item) => item.algorithm !== selectedAlgorithm);
          return [...filtered, run.comparison].sort(
            (a, b) => PATHFINDING_ALGORITHMS.indexOf(a.algorithm) - PATHFINDING_ALGORITHMS.indexOf(b.algorithm)
          );
        });
        setPathComparisonSteps((previous) => ({
          ...previous,
          [selectedAlgorithm]: run.steps,
        }));
      } else if (selectedAlgorithm === 'stack') {
        // Parse stack operations
        const ops = stackOps.split(',').map(op => {
          const [type, value] = op.trim().split(':');
          if (type === 'push') return { type: 'push' as const, value: parseInt(value) };
          if (type === 'pop') return { type: 'pop' as const };
          return { type: 'peek' as const };
        });
        
        const engine = new StackEngine();
        engine.initialize(mockAlgorithm, ops);
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'queue') {
        // Parse queue operations
        const ops = queueOps.split(',').map(op => {
          const [type, value] = op.trim().split(':');
          if (type === 'enqueue') return { type: 'enqueue' as const, value: parseInt(value) };
          if (type === 'dequeue') return { type: 'dequeue' as const };
          return { type: 'peek' as const };
        });
        
        const engine = new QueueEngine();
        engine.initialize(mockAlgorithm, ops);
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'linked-list') {
        const ops = linkedListOps
          .split(',')
          .map(op => op.trim())
          .filter(Boolean)
          .map(op => {
            const [type, valueRaw] = op.split(':');
            const value = parseInt(valueRaw, 10);

            if ((type === 'insert' || type === 'delete' || type === 'search') && !Number.isNaN(value)) {
              return { type: type as 'insert' | 'delete' | 'search', value };
            }

            return null;
          })
          .filter((op): op is { type: 'insert' | 'delete' | 'search'; value: number } => op !== null);

        if (ops.length === 0) {
          alert('Please provide valid linked list operations');
          return;
        }

        const engine = new LinkedListEngine();
        engine.initialize(mockAlgorithm, ops);
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'binary-tree') {
        const values = treeValues.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n));

        if (values.length === 0) {
          alert('Please provide valid tree values');
          return;
        }

        const engine = new BinaryTreeEngine();
        engine.initialize(mockAlgorithm, values);
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'hash-table') {
        const ops = hashOps
          .split(',')
          .map(op => op.trim())
          .filter(Boolean)
          .map(op => {
            const [type, keyRaw, valueRaw] = op.split(':');
            const key = parseInt(keyRaw, 10);
            const value = parseInt(valueRaw, 10);

            if (type === 'set' && !Number.isNaN(key) && !Number.isNaN(value)) {
              return { type: 'set' as const, key, value };
            }
            if ((type === 'get' || type === 'delete') && !Number.isNaN(key)) {
              return { type: type as 'get' | 'delete', key };
            }

            return null;
          })
          .filter((op): op is { type: 'set'; key: number; value: number } | { type: 'get' | 'delete'; key: number } => op !== null);

        if (ops.length === 0) {
          alert('Please provide valid hash table operations');
          return;
        }

        const engine = new HashTableEngine();
        engine.initialize(mockAlgorithm, { size: 7, operations: ops });
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs') {
        const adjacency = parseUnweightedGraph(graphEdges);
        const start = parseInt(graphStart, 10);

        if (Object.keys(adjacency).length === 0 || Number.isNaN(start)) {
          alert('Please provide valid graph edges and a start node');
          return;
        }

        const engine = selectedAlgorithm === 'bfs' ? new BFSEngine() : new DFSEngine();
        engine.initialize(mockAlgorithm, { adjacency, start });
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'dijkstra') {
        const adjacency = parseWeightedGraph(weightedEdges);
        const start = parseInt(graphStart, 10);

        if (Object.keys(adjacency).length === 0 || Number.isNaN(start)) {
          alert('Please provide valid weighted edges and a start node');
          return;
        }

        const engine = new DijkstraEngine();
        engine.initialize(mockAlgorithm, { adjacency, start });
        const steps = engine.generateSteps();
        setSteps(steps);
      } else if (selectedAlgorithm === 'linear-search' || selectedAlgorithm === 'binary-search') {
        const arr = inputArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const target = parseInt(searchTarget);
        
        if (arr.length === 0 || isNaN(target)) {
          alert('Please enter valid array and target');
          return;
        }

        let engine;
        if (selectedAlgorithm === 'linear-search') {
          engine = new LinearSearchEngine();
        } else {
          // Binary search requires sorted array
          arr.sort((a, b) => a - b);
          engine = new BinarySearchEngine();
        }
        
        engine.initialize(mockAlgorithm, { array: arr, target });
        const steps = engine.generateSteps();
        setSteps(steps);
      } else {
        // Sorting algorithms
        const arr = inputArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        
        if (arr.length === 0) {
          alert('Please enter valid numbers');
          return;
        }

        if (arr.length > 20) {
          alert('Please enter 20 or fewer numbers for better visualization');
          return;
        }

        let engine;
        switch (selectedAlgorithm) {
          case 'bubble-sort':
            engine = new BubbleSortEngine();
            break;
          case 'selection-sort':
            engine = new SelectionSortEngine();
            break;
          case 'insertion-sort':
            engine = new InsertionSortEngine();
            break;
          case 'merge-sort':
            engine = new MergeSortEngine();
            break;
          case 'quick-sort':
            engine = new QuickSortEngine();
            break;
          case 'heap-sort':
            engine = new HeapSortEngine();
            break;
          default:
            engine = new BubbleSortEngine();
        }
        
        engine.initialize(mockAlgorithm, arr);
        const steps = engine.generateSteps();
        setSteps(steps);
      }
    } catch (error) {
      console.error('Error generating steps:', error);
      alert('Error processing input. Please check your input.');
    }
  };

  // Auto-visualize on mount
  useEffect(() => {
    // Always reset current playback/step history when switching algorithm
    setSteps([]);

    if (
      selectedAlgorithm === 'pathfinding-bfs' ||
      selectedAlgorithm === 'pathfinding-dijkstra' ||
      selectedAlgorithm === 'pathfinding-astar'
    ) {
      return;
    }

    handleVisualize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlgorithm]);

  const getVisualizerComponent = () => {
    if (isPathfindingAlgorithm) {
      return (
        <GridPathfindingVisualizer
          rows={GRID_ROWS}
          cols={GRID_COLS}
          walls={gridWalls}
          start={gridStart}
          end={gridEnd}
          editMode={pathEditMode}
          step={currentStep}
          onToggleWall={updateWallCell}
          onSetStart={setStartCell}
          onSetEnd={setEndCell}
          onPaintRandomWalls={paintRandomWalls}
        />
      );
    }

    if (!currentStep) return null;

    if (selectedAlgorithm === 'stack') {
      return <StackVisualizer step={currentStep} width={800} height={620} />;
    } else if (selectedAlgorithm === 'queue') {
      return <QueueVisualizer step={currentStep} width={800} height={420} />;
    } else {
      return <ArrayVisualizer step={currentStep} width={800} height={420} />;
    }
  };

  const getVisualizerHeightClass = () => {
    if (isPathfindingAlgorithm) return 'h-[720px]';
    if (selectedAlgorithm === 'stack') return 'h-[620px]';
    return 'h-[420px]';
  };

  const getInputComponent = () => {
    if (isPathfindingAlgorithm) {
      return (
        <div className="mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-cyan-200 text-sm mb-2">Grid: 45 x 60</p>
              <p className="text-xs text-purple-300">Drag on grid to paint walls. Double-click to spray random walls near cursor.</p>
            </div>
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-lg p-3 text-sm text-cyan-200">
              <p>Start: ({gridStart[0]}, {gridStart[1]})</p>
              <p>End: ({gridEnd[0]}, {gridEnd[1]})</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPathEditMode('wall')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                pathEditMode === 'wall'
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-700 text-cyan-100 border border-cyan-500/40'
              }`}
            >
              Draw Walls
            </button>
            <button
              onClick={() => setPathEditMode('erase')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                pathEditMode === 'erase'
                  ? 'bg-cyan-500 text-slate-900'
                  : 'bg-slate-700 text-cyan-100 border border-cyan-500/40'
              }`}
            >
              Erase Walls
            </button>
            <button
              onClick={() => setPathEditMode('start')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                pathEditMode === 'start'
                  ? 'bg-emerald-500 text-slate-900'
                  : 'bg-slate-700 text-cyan-100 border border-emerald-500/40'
              }`}
            >
              Place Start
            </button>
            <button
              onClick={() => setPathEditMode('end')}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-all ${
                pathEditMode === 'end'
                  ? 'bg-rose-500 text-slate-900'
                  : 'bg-slate-700 text-cyan-100 border border-rose-500/40'
              }`}
            >
              Place End
            </button>
            <button
              onClick={clearGridWalls}
              className="px-3 py-2 rounded-md text-sm font-semibold bg-slate-700 text-cyan-100 border border-purple-500/40 hover:bg-slate-600"
            >
              Clear Walls
            </button>
            <button
              onClick={() => paintRandomWalls(Math.floor(GRID_ROWS / 2), Math.floor(GRID_COLS / 2))}
              className="px-3 py-2 rounded-md text-sm font-semibold bg-slate-700 text-cyan-100 border border-purple-500/40 hover:bg-slate-600"
            >
              Random Walls
            </button>
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Run Algorithm
            </button>
            <button
              onClick={handleComparePathAlgorithms}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 rounded-md font-semibold transition-all shadow-lg shadow-amber-500/50"
            >
              Compare All (Same Grid)
            </button>
          </div>

          {pathComparisonResults.length > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-slate-900/70 p-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-3">Pathfinding Comparison</h3>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-cyan-300 border-b border-cyan-500/30">
                      <th className="py-2 pr-3">Algorithm</th>
                      <th className="py-2 pr-3">Time (ms)</th>
                      <th className="py-2 pr-3">Steps</th>
                      <th className="py-2 pr-3">Operations</th>
                      <th className="py-2 pr-3">Comparisons</th>
                      <th className="py-2 pr-3">Peak Memory</th>
                      <th className="py-2 pr-3">Path Length</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2">Replay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...pathComparisonResults]
                      .sort((a, b) => a.elapsedMs - b.elapsedMs)
                      .map((result) => (
                        <tr key={result.algorithm} className="border-b border-slate-700/60 text-cyan-100">
                          <td className="py-2 pr-3 font-semibold">{result.label}</td>
                          <td className="py-2 pr-3">{result.elapsedMs}</td>
                          <td className="py-2 pr-3">{result.steps}</td>
                          <td className="py-2 pr-3">{result.operations}</td>
                          <td className="py-2 pr-3">{result.comparisons}</td>
                          <td className="py-2 pr-3">{result.peakMemory}</td>
                          <td className="py-2 pr-3">{result.pathLength}</td>
                          <td className="py-2 pr-3">
                            {result.found ? (
                              <span className="text-emerald-300">Found</span>
                            ) : (
                              <span className="text-rose-300">No Path</span>
                            )}
                          </td>
                          <td className="py-2">
                            <button
                              onClick={() => {
                                const replaySteps = pathComparisonSteps[result.algorithm];
                                if (!replaySteps) return;
                                setSelectedAlgorithm(result.algorithm);
                                setSteps(replaySteps);
                                setSpeed(4);
                              }}
                              className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 border border-cyan-500/40 text-cyan-100"
                            >
                              Replay
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedAlgorithm === 'stack') {
      return (
        <div className="mb-6">
          <label htmlFor="stack-ops" className="block text-sm font-medium text-cyan-300 mb-2">
            Stack Operations (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              id="stack-ops"
              type="text"
              value={stackOps}
              onChange={(e) => setStackOps(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., push:5,push:3,pop,push:8"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Visualize
            </button>
          </div>
          <p className="text-xs text-purple-300 mt-1">
            Format: push:value, pop, peek
          </p>
        </div>
      );
    } else if (selectedAlgorithm === 'queue') {
      return (
        <div className="mb-6">
          <label htmlFor="queue-ops" className="block text-sm font-medium text-cyan-300 mb-2">
            Queue Operations (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              id="queue-ops"
              type="text"
              value={queueOps}
              onChange={(e) => setQueueOps(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., enqueue:5,enqueue:3,dequeue,enqueue:8"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Visualize
            </button>
          </div>
          <p className="text-xs text-purple-300 mt-1">
            Format: enqueue:value, dequeue, peek
          </p>
        </div>
      );
    } else if (selectedAlgorithm === 'linked-list') {
      return (
        <div className="mb-6">
          <label htmlFor="linked-list-ops" className="block text-sm font-medium text-cyan-300 mb-2">
            Linked List Operations (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              id="linked-list-ops"
              type="text"
              value={linkedListOps}
              onChange={(e) => setLinkedListOps(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., insert:5,insert:3,search:3,delete:5"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Visualize
            </button>
          </div>
          <p className="text-xs text-purple-300 mt-1">Format: insert:value, delete:value, search:value</p>
        </div>
      );
    } else if (selectedAlgorithm === 'binary-tree') {
      return (
        <div className="mb-6">
          <label htmlFor="tree-values" className="block text-sm font-medium text-cyan-300 mb-2">
            Tree Values (inserted as BST):
          </label>
          <div className="flex gap-2">
            <input
              id="tree-values"
              type="text"
              value={treeValues}
              onChange={(e) => setTreeValues(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., 8,3,10,1,6,14,4"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Build
            </button>
          </div>
        </div>
      );
    } else if (selectedAlgorithm === 'hash-table') {
      return (
        <div className="mb-6">
          <label htmlFor="hash-ops" className="block text-sm font-medium text-cyan-300 mb-2">
            Hash Table Operations (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              id="hash-ops"
              type="text"
              value={hashOps}
              onChange={(e) => setHashOps(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., set:10:100,get:10,delete:10"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Visualize
            </button>
          </div>
          <p className="text-xs text-purple-300 mt-1">Format: set:key:value, get:key, delete:key</p>
        </div>
      );
    } else if (selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs') {
      return (
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="graph-edges" className="block text-sm font-medium text-cyan-300 mb-2">
              Graph Edges (undirected):
            </label>
            <input
              id="graph-edges"
              type="text"
              value={graphEdges}
              onChange={(e) => setGraphEdges(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., 0-1,0-2,1-3,2-4"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={graphStart}
              onChange={(e) => setGraphStart(e.target.value)}
              className="w-32 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Start"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Traverse
            </button>
          </div>
          <p className="text-xs text-purple-300">Format: from-to (e.g., 0-1), comma-separated</p>
        </div>
      );
    } else if (selectedAlgorithm === 'dijkstra') {
      return (
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="weighted-edges" className="block text-sm font-medium text-cyan-300 mb-2">
              Weighted Edges:
            </label>
            <input
              id="weighted-edges"
              type="text"
              value={weightedEdges}
              onChange={(e) => setWeightedEdges(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., 0-1-4,0-2-1,2-1-2"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={graphStart}
              onChange={(e) => setGraphStart(e.target.value)}
              className="w-32 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Start"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Run
            </button>
          </div>
          <p className="text-xs text-purple-300">Format: from-to-weight (e.g., 0-1-4), comma-separated</p>
        </div>
      );
    } else if (selectedAlgorithm === 'linear-search' || selectedAlgorithm === 'binary-search') {
      return (
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="array-input" className="block text-sm font-medium text-cyan-300 mb-2">
              Array (comma-separated numbers):
            </label>
            <input
              id="array-input"
              type="text"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., 5,2,8,1,9,3"
            />
          </div>
          <div>
            <label htmlFor="target-input" className="block text-sm font-medium text-cyan-300 mb-2">
              Target value to search:
            </label>
            <div className="flex gap-2">
              <input
                id="target-input"
                type="text"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="e.g., 8"
              />
              <button
                onClick={handleVisualize}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
              >
                Search
              </button>
            </div>
          </div>
          {selectedAlgorithm === 'binary-search' && (
            <p className="text-xs text-purple-300">
              Note: Array will be automatically sorted for binary search
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className="mb-6">
          <label htmlFor="array-input" className="block text-sm font-medium text-cyan-300 mb-2">
            Enter array (comma-separated numbers):
          </label>
          <div className="flex gap-2">
            <input
              id="array-input"
              type="text"
              value={inputArray}
              onChange={(e) => setInputArray(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-cyan-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="e.g., 5,2,8,1,9,3"
            />
            <button
              onClick={handleVisualize}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-md font-semibold transition-all shadow-lg shadow-cyan-500/50"
            >
              Sort
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block font-semibold transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Algorithm Visualizer
          </h1>
          <p className="text-lg text-cyan-200">
            Select an algorithm and watch it execute step-by-step
          </p>
        </header>

        {/* Algorithm Selector */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/20 p-6 mb-6">
          <label htmlFor="algorithm-select" className="block text-sm font-medium text-cyan-300 mb-2">
            Select Algorithm:
          </label>
          <select
            id="algorithm-select"
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmType)}
            className="w-full px-4 py-2 bg-slate-700 border border-purple-500/50 text-cyan-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg"
          >
            <optgroup label="Sorting Algorithms">
              <option value="bubble-sort">Bubble Sort</option>
              <option value="selection-sort">Selection Sort</option>
              <option value="insertion-sort">Insertion Sort</option>
              <option value="merge-sort">Merge Sort</option>
              <option value="quick-sort">Quick Sort</option>
              <option value="heap-sort">Heap Sort</option>
            </optgroup>
            <optgroup label="Searching Algorithms">
              <option value="linear-search">Linear Search</option>
              <option value="binary-search">Binary Search</option>
            </optgroup>
            <optgroup label="Data Structures">
              <option value="stack">Stack (LIFO)</option>
              <option value="queue">Queue (FIFO)</option>
              <option value="linked-list">Linked List</option>
              <option value="binary-tree">Binary Tree</option>
              <option value="hash-table">Hash Table</option>
            </optgroup>
            <optgroup label="Graph Algorithms">
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
              <option value="dijkstra">Dijkstra&apos;s Algorithm</option>
            </optgroup>
            <optgroup label="Pathfinding (Grid 200x200)">
              <option value="pathfinding-bfs">Grid BFS</option>
              <option value="pathfinding-dijkstra">Grid Dijkstra</option>
              <option value="pathfinding-astar">Grid A*</option>
            </optgroup>
          </select>
        </div>

        {/* Visualization Section */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 p-6 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            {selectedAlgorithm.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h2>

          {/* Input Section */}
          {getInputComponent()}

          <div className="lg:grid lg:grid-cols-[800px_1fr] lg:gap-8 lg:items-start mb-6">
            <div className="w-[800px]">
              {getVisualizerComponent()}
            </div>
            <div className={`mt-4 lg:mt-0 min-w-0 ${getVisualizerHeightClass()}`}>
              <ExplanationPanel step={currentStep} isPlaying={isPlaying} selectedAlgorithm={selectedAlgorithm} />
            </div>
          </div>

          {/* Controls */}
          {steps.length > 0 ? (
            <PlaybackControls />
          ) : (
            <p className="text-sm text-cyan-200">
              Configure the grid and run a pathfinding algorithm to generate step-by-step playback.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
          <div className="max-w-[1400px] mx-auto text-cyan-200">Loading demo...</div>
        </main>
      }
    >
      <DemoPageContent />
    </Suspense>
  );
}
