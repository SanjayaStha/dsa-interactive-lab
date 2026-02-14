/**
 * Types for Animation Controller and Playback Management
 */

import { AlgorithmStep } from './algorithm';

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'completed';

/**
 * Current state of animation playback
 */
export interface PlaybackState {
  status: PlaybackStatus;
  currentStepIndex: number;
  totalSteps: number;
  speed: number; // 0.25x to 4x
}

/**
 * Animation Controller interface for managing playback
 */
export interface AnimationController {
  /**
   * Start playing the animation
   */
  play(): void;
  
  /**
   * Pause the animation
   */
  pause(): void;
  
  /**
   * Move to the next step
   */
  stepForward(): void;
  
  /**
   * Move to the previous step
   */
  stepBackward(): void;
  
  /**
   * Reset to the beginning
   */
  reset(): void;
  
  /**
   * Set playback speed
   */
  setSpeed(speed: number): void;
  
  /**
   * Get current playback state
   */
  getPlaybackState(): PlaybackState;
  
  /**
   * Get current step
   */
  getCurrentStep(): AlgorithmStep | null;
  
  /**
   * Subscribe to step changes
   */
  onStepChange(callback: (step: AlgorithmStep) => void): () => void;
  
  /**
   * Subscribe to playback state changes
   */
  onPlaybackStateChange(callback: (state: PlaybackState) => void): () => void;
}

/**
 * Zustand store type for animation state management
 */
export interface AnimationStore {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  playbackStatus: PlaybackStatus;
  speed: number;
  
  // Actions
  setSteps: (steps: AlgorithmStep[]) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  setCurrentStepIndex: (index: number) => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  getCurrentStep: () => AlgorithmStep | null;
}
