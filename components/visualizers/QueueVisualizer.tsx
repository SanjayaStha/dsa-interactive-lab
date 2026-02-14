'use client';

/**
 * Queue Visualizer Component
 * Renders queue data structure with FIFO visualization
 */

import { useEffect, useRef } from 'react';
import { AlgorithmStep } from '@/types';

interface QueueVisualizerProps {
  step: AlgorithmStep | null;
  width?: number;
  height?: number;
}

export function QueueVisualizer({ step, width = 800, height = 300 }: QueueVisualizerProps) {
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

    const cellWidth = 80;
    const cellHeight = 60;
    const maxVisible = Math.floor((width - 100) / cellWidth);
    const visibleData = data.slice(0, maxVisible);
    const startX = (width - cellWidth * visibleData.length) / 2;
    const startY = height / 2 - cellHeight / 2;

    // Draw queue elements (from front to rear)
    visibleData.forEach((value: number, index: number) => {
      const x = startX + index * cellWidth;

      // Determine cell color - NEON COLORS
      let fillColor = '#334155'; // slate-700
      let strokeColor = '#06b6d4'; // cyan-500
      let strokeWidth = 2;
      let glowColor = 'rgba(6, 182, 212, 0.5)';

      if (step.affectedIndices.includes(index)) {
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
      ctx.fillRect(x, startY, cellWidth, cellHeight);

      // Draw cell border
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(x, startY, cellWidth, cellHeight);

      // Reset shadow for text
      ctx.shadowBlur = 0;

      // Draw value
      ctx.fillStyle = step.affectedIndices.includes(index) ? '#0f172a' : '#06b6d4';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), x + cellWidth / 2, startY + cellHeight / 2);

      // Draw index label
      ctx.fillStyle = '#a78bfa'; // purple-400
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`[${index}]`, x + cellWidth / 2, startY + cellHeight + 15);

      // Mark front element
      if (index === 0) {
        ctx.fillStyle = '#34d399'; // emerald-400
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FRONT', x + cellWidth / 2, startY - 15);
        
        // Draw arrow with glow
        ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + cellWidth / 2, startY - 5);
        ctx.lineTo(x + cellWidth / 2 - 5, startY - 10);
        ctx.moveTo(x + cellWidth / 2, startY - 5);
        ctx.lineTo(x + cellWidth / 2 + 5, startY - 10);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Mark rear element
      if (index === visibleData.length - 1) {
        ctx.fillStyle = '#f472b6'; // pink-400
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('REAR', x + cellWidth / 2, startY + cellHeight + 35);
        
        // Draw arrow with glow
        ctx.shadowColor = 'rgba(244, 114, 182, 0.8)';
        ctx.shadowBlur = 8;
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + cellWidth / 2, startY + cellHeight + 25);
        ctx.lineTo(x + cellWidth / 2 - 5, startY + cellHeight + 20);
        ctx.moveTo(x + cellWidth / 2, startY + cellHeight + 25);
        ctx.lineTo(x + cellWidth / 2 + 5, startY + cellHeight + 20);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Draw direction arrow
    if (visibleData.length > 1) {
      ctx.strokeStyle = '#a78bfa'; // purple-400
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      const arrowY = startY + cellHeight + 60;
      ctx.beginPath();
      ctx.moveTo(startX, arrowY);
      ctx.lineTo(startX + cellWidth * visibleData.length, arrowY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(startX + cellWidth * visibleData.length, arrowY);
      ctx.lineTo(startX + cellWidth * visibleData.length - 10, arrowY - 5);
      ctx.lineTo(startX + cellWidth * visibleData.length - 10, arrowY + 5);
      ctx.closePath();
      ctx.fillStyle = '#a78bfa';
      ctx.fill();

      ctx.fillStyle = '#a78bfa';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Enqueue →', startX + (cellWidth * visibleData.length) / 2, arrowY + 20);
    }

    // Draw step description
    ctx.fillStyle = '#06b6d4'; // cyan-500
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(step.description, width / 2, 30);

    // Draw queue info
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
