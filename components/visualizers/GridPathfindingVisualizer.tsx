'use client';

import { useEffect, useMemo, useRef, type MouseEvent } from 'react';
import { AlgorithmStep } from '@/types';

type Cell = [number, number];
type EditMode = 'wall' | 'erase' | 'start' | 'end';

interface GridData {
  rows: number;
  cols: number;
  start: Cell;
  end: Cell;
  walls: boolean[][];
  visitedOrder: Cell[];
  frontier: Cell[];
  current: Cell | null;
  finalPath: Cell[];
}

interface GridPathfindingVisualizerProps {
  rows: number;
  cols: number;
  walls: boolean[][];
  start: Cell;
  end: Cell;
  editMode: EditMode;
  step: AlgorithmStep | null;
  onToggleWall: (row: number, col: number, addWall: boolean) => void;
  onSetStart: (row: number, col: number) => void;
  onSetEnd: (row: number, col: number) => void;
  onPaintRandomWalls: (row: number, col: number) => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 720;

export function GridPathfindingVisualizer({
  rows,
  cols,
  walls,
  start,
  end,
  editMode,
  step,
  onToggleWall,
  onSetStart,
  onSetEnd,
  onPaintRandomWalls,
}: GridPathfindingVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);

  const cellSize = useMemo(
    () => Math.min(CANVAS_WIDTH / cols, CANVAS_HEIGHT / rows),
    [rows, cols]
  );

  const stepData = useMemo<GridData | null>(() => {
    if (!step || typeof step.afterState?.data !== 'object' || step.afterState.data === null) {
      return null;
    }

    const data = step.afterState.data as Partial<GridData>;
    if (!Array.isArray(data.walls) || !Array.isArray(data.visitedOrder) || !Array.isArray(data.finalPath)) {
      return null;
    }

    return {
      rows: data.rows ?? rows,
      cols: data.cols ?? cols,
      start: (data.start as Cell) ?? start,
      end: (data.end as Cell) ?? end,
      walls: data.walls,
      visitedOrder: data.visitedOrder as Cell[],
      frontier: (data.frontier ?? []) as Cell[],
      current: (data.current ?? null) as Cell | null,
      finalPath: data.finalPath as Cell[],
    };
  }, [step, rows, cols, start, end]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeWalls = stepData?.walls ?? walls;
    const activeStart = stepData?.start ?? start;
    const activeEnd = stepData?.end ?? end;

    const visitedSet = new Set((stepData?.visitedOrder ?? []).map(([r, c]) => `${r},${c}`));
    const frontierSet = new Set((stepData?.frontier ?? []).map(([r, c]) => `${r},${c}`));
    const finalPathSet = new Set((stepData?.finalPath ?? []).map(([r, c]) => `${r},${c}`));
    const currentCellKey = stepData?.current ? `${stepData.current[0]},${stepData.current[1]}` : '';

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const key = `${row},${col}`;

        let color = '#0f172a';

        if (activeWalls[row]?.[col]) {
          color = '#c19a6b';
        } else if (key === `${activeStart[0]},${activeStart[1]}`) {
          color = '#22c55e';
        } else if (key === `${activeEnd[0]},${activeEnd[1]}`) {
          color = '#ef4444';
        } else if (finalPathSet.has(key)) {
          color = '#f59e0b';
        } else if (key === currentCellKey) {
          color = '#f43f5e';
        } else if (frontierSet.has(key)) {
          color = '#a855f7';
        } else if (visitedSet.has(key)) {
          color = '#06b6d4';
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 0.3;

    for (let i = 0; i <= rows; i++) {
      const y = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    for (let i = 0; i <= cols; i++) {
      const x = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
  }, [cellSize, cols, rows, stepData, walls, start, end]);

  const getCellFromEvent = (event: MouseEvent<HTMLCanvasElement>): Cell | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return null;
    }

    return [row, col];
  };

  const applyEdit = (row: number, col: number) => {
    if (editMode === 'start') {
      onSetStart(row, col);
      return;
    }

    if (editMode === 'end') {
      onSetEnd(row, col);
      return;
    }

    if (editMode === 'erase') {
      onToggleWall(row, col, false);
      return;
    }

    onToggleWall(row, col, true);
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellFromEvent(event);
    if (!cell) return;

    isDraggingRef.current = true;
    applyEdit(cell[0], cell[1]);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const cell = getCellFromEvent(event);
    if (!cell) return;

    if (editMode === 'wall' || editMode === 'erase') {
      applyEdit(cell[0], cell[1]);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleDoubleClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellFromEvent(event);
    if (!cell) return;
    onPaintRandomWalls(cell[0], cell[1]);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-cyan-500/40 rounded-lg shadow-lg shadow-cyan-500/20 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-xs">
        <Legend color="bg-green-500" label="Start" />
        <Legend color="bg-red-500" label="End" />
        <Legend color="bg-amber-300" label="Wall" />
        <Legend color="bg-cyan-500" label="Visited" />
        <Legend color="bg-purple-500" label="Frontier" />
        <Legend color="bg-rose-500" label="Current" />
        <Legend color="bg-amber-500" label="Final Path" />
        <Legend color="bg-slate-900 border border-slate-500" label="Open" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1 text-cyan-200">
      <span className={`inline-block w-3 h-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}
