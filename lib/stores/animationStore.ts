/**
 * Animation Store using Zustand
 * Manages animation playback state and controls
 */

import { create } from 'zustand';
import { AnimationStore } from '@/types';

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  steps: [],
  currentStepIndex: 0,
  playbackStatus: 'idle',
  speed: 1,

  setSteps: (steps) => {
    set({ 
      steps, 
      currentStepIndex: 0, 
      playbackStatus: 'idle' 
    });
  },

  play: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex >= steps.length - 1) {
      set({ playbackStatus: 'completed' });
    } else {
      set({ playbackStatus: 'playing' });
    }
  },

  pause: () => {
    set({ playbackStatus: 'paused' });
  },

  stepForward: () => {
    const { currentStepIndex, steps, playbackStatus } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ 
        currentStepIndex: currentStepIndex + 1,
        playbackStatus: playbackStatus === 'playing' ? 'playing' : 'paused'
      });
    } else {
      set({ playbackStatus: 'completed' });
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ 
        currentStepIndex: currentStepIndex - 1,
        playbackStatus: 'paused'
      });
    }
  },

  setCurrentStepIndex: (index) => {
    const { steps, playbackStatus } = get();
    if (steps.length === 0) {
      set({ currentStepIndex: 0, playbackStatus: 'idle' });
      return;
    }

    const clampedIndex = Math.max(0, Math.min(steps.length - 1, index));
    const nextStatus =
      clampedIndex >= steps.length - 1
        ? 'completed'
        : playbackStatus === 'completed'
          ? 'paused'
          : playbackStatus;

    set({
      currentStepIndex: clampedIndex,
      playbackStatus: nextStatus,
    });
  },

  reset: () => {
    set({ 
      currentStepIndex: 0, 
      playbackStatus: 'idle' 
    });
  },

  setSpeed: (speed) => {
    // Clamp speed between 0.25x and 4x
    const clampedSpeed = Math.max(0.25, Math.min(4, speed));
    set({ speed: clampedSpeed });
  },

  getCurrentStep: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      return steps[currentStepIndex];
    }
    return null;
  },
}));
