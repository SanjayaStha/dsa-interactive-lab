/**
 * Types for User Progress Tracking
 */

/**
 * A single practice attempt
 */
export interface PracticeAttempt {
  moduleId: string;
  exerciseId: string;
  timestamp: Date;
  success: boolean;
  timeSpent: number; // in seconds
}

/**
 * Skill level metrics
 */
export interface SkillLevel {
  dataStructures: number; // 0-100
  algorithms: number; // 0-100
  overall: number; // 0-100
}

/**
 * Complete user progress data
 */
export interface UserProgress {
  userId: string;
  completedModules: string[];
  completedDataStructures: string[];
  completedAlgorithms: string[];
  practiceAttempts: PracticeAttempt[];
  skillLevel: SkillLevel;
}

/**
 * Progress Tracker interface
 */
export interface ProgressTracker {
  getProgress(userId: string): Promise<UserProgress>;
  updateProgress(userId: string, update: Partial<UserProgress>): Promise<void>;
  calculateSkillLevel(progress: UserProgress): SkillLevel;
  getSuccessRate(userId: string): number;
}

/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}
