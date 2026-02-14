/**
 * Types for Visualization Layer
 */

import { AlgorithmStep, DataStructureType } from './algorithm';

/**
 * Core Visualizer interface for rendering data structures
 */
export interface Visualizer {
  /**
   * Render the current state
   */
  render(step: AlgorithmStep): void;
  
  /**
   * Animate transition between states
   */
  animate(fromStep: AlgorithmStep, toStep: AlgorithmStep, duration: number): Promise<void>;
  
  /**
   * Highlight specific elements
   */
  highlight(indices: number[], color: string): void;
  
  /**
   * Clear the visualization
   */
  clear(): void;
}

/**
 * Factory for creating visualizers based on data structure type
 */
export interface VisualizerFactory {
  /**
   * Create a visualizer for the specified data structure type
   */
  createVisualizer(type: DataStructureType): Visualizer;
}

/**
 * Tree node structure for tree visualizations
 */
export interface TreeNode {
  value: any;
  left?: TreeNode;
  right?: TreeNode;
}

/**
 * Graph node structure for graph visualizations
 */
export interface GraphNode {
  id: string;
  value: any;
  x?: number;
  y?: number;
}

/**
 * Graph edge structure for graph visualizations
 */
export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  directed?: boolean;
}

/**
 * Graph data structure for visualization
 */
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Linked list node structure
 */
export interface LinkedListNode {
  value: any;
  next?: LinkedListNode;
  prev?: LinkedListNode; // for doubly linked lists
}
