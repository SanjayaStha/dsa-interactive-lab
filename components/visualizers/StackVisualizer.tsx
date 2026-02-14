'use client';

/**
 * Stack Visualizer Component
 * Renders stack data structure with LIFO visualization
 */

import { useEffect, useRef } from 'react';
import { AlgorithmStep } from '@/types';

interface StackVisualizerProps {
  step: AlgorithmStep | null;
  width?: number;
  height?: number;
}

export function StackVisualizer({ step, width = 800, height = 500 }: StackVisualizerProps) {
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
    if (!Array.isArray(data)) return;

    const cellWidth = 120;
    const cellHeight = 50;
    const startX = width / 2 - cellWidth / 2;
    const startY = height - 100;
    const maxVisible = Math.floor((height - 150) / cellHeight);

    // Draw stack base with neon glow
    ctx.strokeStyle = '#06b6d4'; // cyan-500
    ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX - 20, startY + cellHeight);
    ctx.lineTo(startX + cellWidth + 20, startY + cellHeight);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw "BOTTOM" label
    ctx.fillStyle = '#a78bfa'; // purple-400
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BOTTOM', width / 2, startY + cellHeight + 25);

    // Draw stack elements (from bottom to top)
    const visibleData = data.slice(-maxVisible);
    visibleData.forEach((value: number, index: number) => {
      const actualIndex = data.length - visibleData.length + index;
      const y = startY - (index + 1) * cellHeight;

      // Determine cell color - NEON COLORS
      let fillColor = '#334155'; // slate-700
      let strokeColor = '#06b6d4'; // cyan-500
      let strokeWidth = 2;
      let glowColor = 'rgba(6, 182, 212, 0.5)';

      if (step.affectedIndices.includes(actualIndex)) {
        if (step.type === 'insert') {
          fillColor = '#34d399'; // emerald-400 - neon green
          strokeColor = '#10b981'; // emerald-500
          strokeWidth = 3;
          glowColor = 'rgba(16, 185, 129, 0.8)';
        } else if (step.type === 'delete') {
          fillColor = '#f87171'; // red-400 - neon red
          strokeColor = '#ef4444'; // red-500
          strokeWidth = 3;
          glowColor = 'rgba(239, 68, 68, 0.8)';
        } else if (step.type === 'highlight') {
          fillColor = '#fde047'; // yellow-400 - neon yellow
          strokeColor = '#facc15'; // yellow-400
          strokeWidth = 3;
          glowColor = 'rgba(250, 204, 21, 0.8)';
        }
      }

      // Draw glow effect
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;

      // Draw cell background
      ctx.fillStyle = fillColor;
      ctx.fillRect(startX, y, cellWidth, cellHeight);

      // Draw cell border
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(startX, y, cellWidth, cellHeight);

      // Reset shadow for text
      ctx.shadowBlur = 0;

      // Draw value
      ctx.fillStyle = step.affectedIndices.includes(actualIndex) ? '#0f172a' : '#06b6d4';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), startX + cellWidth / 2, y + cellHeight / 2);

      // Draw index label
      ctx.fillStyle = '#a78bfa'; // purple-400
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`[${actualIndex}]`, startX - 10, y + cellHeight / 2);

      // Mark top element
      if (index === visibleData.length - 1) {
        ctx.fillStyle = '#f472b6'; // pink-400
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('← TOP', startX + cellWidth + 10, y + cellHeight / 2);
      }
    });

    // Draw step description
    ctx.fillStyle = '#06b6d4'; // cyan-500
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(step.description, width / 2, 30);

    // Draw stack info
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a78bfa'; // purple-400
    ctx.fillText(`Size: ${data.length}`, 20, height - 60);
    ctx.fillText(`Operations: ${step.metrics.operationCount}`, 20, height - 40);
    ctx.fillText(`Empty: ${data.length === 0 ? 'Yes' : 'No'}`, 20, height - 20);

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
