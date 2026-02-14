'use client';

/**
 * Array Visualizer Component
 * Renders array data structures with highlighting and animations
 */

import { useEffect, useRef } from 'react';
import { AlgorithmStep } from '@/types';

interface ArrayVisualizerProps {
  step: AlgorithmStep | null;
  width?: number;
  height?: number;
}

export function ArrayVisualizer({ step, width = 800, height = 300 }: ArrayVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !step) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, width, height);

    const data = step.afterState.data;
    if (!Array.isArray(data) || data.length === 0) return;

    const cellWidth = Math.min(60, (width - 40) / data.length);
    const cellHeight = 60;
    const startX = (width - cellWidth * data.length) / 2;
    const startY = height / 2 - cellHeight / 2;

    // Draw array elements
    data.forEach((value: number, index: number) => {
      const x = startX + index * cellWidth;
      const y = startY;

      // Determine cell color based on step type and affected indices - NEON COLORS
      let fillColor = '#334155'; // slate-700
      let strokeColor = '#06b6d4'; // cyan-500
      let strokeWidth = 2;
      let glowColor = 'rgba(6, 182, 212, 0.5)'; // cyan glow

      if (step.affectedIndices.includes(index)) {
        if (step.type === 'compare') {
          fillColor = '#fde047'; // yellow-400 - neon yellow
          strokeColor = '#facc15'; // yellow-400
          strokeWidth = 3;
          glowColor = 'rgba(250, 204, 21, 0.8)';
        } else if (step.type === 'swap') {
          fillColor = '#f87171'; // red-400 - neon red
          strokeColor = '#ef4444'; // red-500
          strokeWidth = 3;
          glowColor = 'rgba(239, 68, 68, 0.8)';
        } else if (step.type === 'highlight') {
          fillColor = '#34d399'; // emerald-400 - neon green
          strokeColor = '#10b981'; // emerald-500
          strokeWidth = 3;
          glowColor = 'rgba(16, 185, 129, 0.8)';
        }
      }

      // Draw glow effect
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;

      // Draw cell background
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, cellWidth, cellHeight);

      // Draw cell border
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(x, y, cellWidth, cellHeight);

      // Reset shadow for text
      ctx.shadowBlur = 0;

      // Draw value
      ctx.fillStyle = step.affectedIndices.includes(index) ? '#0f172a' : '#06b6d4'; // dark text on bright, cyan on dark
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), x + cellWidth / 2, y + cellHeight / 2);

      // Draw index
      ctx.fillStyle = '#a78bfa'; // purple-400
      ctx.font = '14px monospace';
      ctx.fillText(index.toString(), x + cellWidth / 2, y + cellHeight + 20);
    });

    // Draw step description
    ctx.fillStyle = '#06b6d4'; // cyan-500
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(step.description, width / 2, 30);

    // Draw metrics
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a78bfa'; // purple-400
    ctx.fillText(`Operations: ${step.metrics.operationCount}`, 20, height - 60);
    ctx.fillText(`Comparisons: ${step.metrics.comparisonCount}`, 20, height - 40);
    ctx.fillText(`Memory: ${step.metrics.memoryUsage}`, 20, height - 20);

  }, [step, width, height]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-cyan-500/30 rounded-lg bg-slate-800 shadow-lg shadow-cyan-500/20"
      />
    </div>
  );
}
