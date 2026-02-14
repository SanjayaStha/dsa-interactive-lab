'use client';

/**
 * Playback Controls Component
 * Provides play, pause, step forward/backward, reset, and speed controls
 */

import { useAnimationStore } from '@/lib/stores/animationStore';
import { useEffect } from 'react';

export function PlaybackControls() {
  const {
    playbackStatus,
    currentStepIndex,
    steps,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
  } = useAnimationStore();

  // Auto-advance when playing
  useEffect(() => {
    if (playbackStatus !== 'playing') return;

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        stepForward();
      } else {
        pause();
      }
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [playbackStatus, currentStepIndex, steps.length, speed, stepForward, pause]);

  const isPlaying = playbackStatus === 'playing';
  const isCompleted = playbackStatus === 'completed';
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= steps.length - 1;

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-cyan-500/30">
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={reset}
          disabled={isAtStart && !isPlaying}
          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500/80 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-md transition-all shadow-md"
          title="Reset"
        >
          ⏮ Reset
        </button>

        <button
          onClick={stepBackward}
          disabled={isAtStart || isPlaying}
          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500/80 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-md transition-all shadow-md"
          title="Step Backward"
        >
          ⏪ Back
        </button>

        <button
          onClick={isPlaying ? pause : play}
          disabled={isCompleted}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-md transition-all font-semibold shadow-lg shadow-cyan-500/50"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={stepForward}
          disabled={isAtEnd || isPlaying}
          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500/80 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-md transition-all shadow-md"
          title="Step Forward"
        >
          Forward ⏩
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-cyan-300">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>Status: {playbackStatus}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/30"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-4">
        <label htmlFor="speed" className="text-sm font-medium text-cyan-300">
          Speed: {speed}x
        </label>
        <input
          id="speed"
          type="range"
          min="0.25"
          max="4"
          step="0.25"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="flex-1"
        />
        <div className="flex gap-1">
          <button
            onClick={() => setSpeed(0.5)}
            className="px-2 py-1 text-xs bg-purple-600/80 hover:bg-purple-500/80 text-white rounded"
          >
            0.5x
          </button>
          <button
            onClick={() => setSpeed(1)}
            className="px-2 py-1 text-xs bg-purple-600/80 hover:bg-purple-500/80 text-white rounded"
          >
            1x
          </button>
          <button
            onClick={() => setSpeed(2)}
            className="px-2 py-1 text-xs bg-purple-600/80 hover:bg-purple-500/80 text-white rounded"
          >
            2x
          </button>
        </div>
      </div>
    </div>
  );
}
