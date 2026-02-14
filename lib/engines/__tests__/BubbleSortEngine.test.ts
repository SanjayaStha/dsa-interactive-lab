/**
 * Unit tests for BubbleSortEngine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BubbleSortEngine } from '../BubbleSortEngine';
import { Algorithm } from '@/types';

describe('BubbleSortEngine', () => {
  let engine: BubbleSortEngine;
  let mockAlgorithm: Algorithm;

  beforeEach(() => {
    engine = new BubbleSortEngine();
    mockAlgorithm = {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      category: 'sorting',
      pseudocode: ['for i', 'for j', 'compare', 'swap'],
      implementations: {
        python: '',
        java: '',
        javascript: '',
        cpp: '',
      },
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
        explanation: 'Test',
      },
      spaceComplexity: {
        best: 'O(1)',
        average: 'O(1)',
        worst: 'O(1)',
        explanation: 'Test',
      },
    };
  });

  it('should initialize correctly', () => {
    const input = [5, 2, 8, 1];
    engine.initialize(mockAlgorithm, input);
    expect(engine.getAllSteps()).toHaveLength(0);
  });

  it('should generate steps for sorting', () => {
    const input = [5, 2, 8, 1];
    engine.initialize(mockAlgorithm, input);
    const steps = engine.generateSteps();
    
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].description).toContain('Starting');
    expect(steps[steps.length - 1].description).toContain('sorted');
  });

  it('should produce sorted array', () => {
    const input = [5, 2, 8, 1, 9, 3];
    engine.initialize(mockAlgorithm, input);
    const steps = engine.generateSteps();
    
    const finalStep = steps[steps.length - 1];
    const sortedArray = finalStep.afterState.data;
    
    // Check if sorted
    for (let i = 0; i < sortedArray.length - 1; i++) {
      expect(sortedArray[i]).toBeLessThanOrEqual(sortedArray[i + 1]);
    }
    
    // Check same elements
    expect(sortedArray.sort()).toEqual([...input].sort());
  });

  it('should track metrics correctly', () => {
    const input = [3, 1, 2];
    engine.initialize(mockAlgorithm, input);
    engine.generateSteps();
    
    const metrics = engine.getMetrics();
    expect(metrics.totalOperations).toBeGreaterThan(0);
    expect(metrics.totalComparisons).toBeGreaterThan(0);
    expect(metrics.executionSteps).toBeGreaterThan(0);
  });

  it('should handle empty array', () => {
    const input: number[] = [];
    engine.initialize(mockAlgorithm, input);
    const steps = engine.generateSteps();
    
    expect(steps.length).toBeGreaterThan(0);
  });

  it('should handle single element array', () => {
    const input = [5];
    engine.initialize(mockAlgorithm, input);
    const steps = engine.generateSteps();
    
    const finalStep = steps[steps.length - 1];
    expect(finalStep.afterState.data).toEqual([5]);
  });

  it('should handle already sorted array', () => {
    const input = [1, 2, 3, 4, 5];
    engine.initialize(mockAlgorithm, input);
    const steps = engine.generateSteps();
    
    const finalStep = steps[steps.length - 1];
    expect(finalStep.afterState.data).toEqual([1, 2, 3, 4, 5]);
  });
});
