/**
 * Binary Tree Engine (BST insertion + traversals)
 */

import { Algorithm, AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export class BinaryTreeEngine extends BaseAlgorithmEngine {
  initialize(algorithm: Algorithm, input: number[]): void {
    if (!Array.isArray(input)) {
      throw new Error('Input must be an array of numbers');
    }
    super.initialize(algorithm, input);
  }

  generateSteps(): AlgorithmStep[] {
    if (!Array.isArray(this.input)) {
      throw new Error('Input must be an array');
    }

    this.steps = [];
    let root: TreeNode | null = null;

    const initial = this.createState([]);
    this.steps.push(
      this.createStep(
        'highlight',
        'Binary tree initialized (empty)',
        0,
        [],
        initial,
        initial,
        'Values are inserted as a Binary Search Tree for deterministic visualization.'
      )
    );

    const insert = (node: TreeNode | null, value: number): TreeNode => {
      if (!node) {
        return { value, left: null, right: null };
      }
      this.incrementComparisons();
      if (value < node.value) {
        node.left = insert(node.left, value);
      } else {
        node.right = insert(node.right, value);
      }
      return node;
    };

    const inorder = (node: TreeNode | null, acc: number[] = []): number[] => {
      if (!node) return acc;
      inorder(node.left, acc);
      acc.push(node.value);
      inorder(node.right, acc);
      return acc;
    };

    (this.input as number[]).forEach((value) => {
      const before = this.createState(inorder(root));
      root = insert(root, value);
      this.incrementOperations();
      const afterOrder = inorder(root);
      const after = this.createState(afterOrder);

      this.steps.push(
        this.createStep(
          'insert',
          `Insert ${value} into binary tree`,
          1,
          [afterOrder.indexOf(value)],
          before,
          after,
          undefined,
          { inserted: value, inorder: `[${afterOrder.join(', ')}]` }
        )
      );
    });

    const traversal = inorder(root);
    const finalState = this.createState(traversal, { traversal: 'inorder', complete: true });
    this.steps.push(
      this.createStep(
        'traverse',
        'In-order traversal complete',
        2,
        Array.from({ length: traversal.length }, (_, i) => i),
        finalState,
        finalState,
        undefined,
        { inorder: `[${traversal.join(', ')}]` }
      )
    );

    return this.steps;
  }

  protected createState(data: number[], metadata: Record<string, unknown> = {}) {
    return {
      type: 'tree' as const,
      data: [...data],
      metadata,
    };
  }
}
