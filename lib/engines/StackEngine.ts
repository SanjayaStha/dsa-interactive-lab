/**
 * Stack Data Structure Engine
 * Implements step-by-step stack operations (push, pop) with LIFO visualization
 */

import { AlgorithmStep } from '@/types';
import { BaseAlgorithmEngine } from './BaseAlgorithmEngine';

type StackOperation = 
  | { type: 'push'; value: number }
  | { type: 'pop' }
  | { type: 'peek' };

export class StackEngine extends BaseAlgorithmEngine {
  private operations: StackOperation[] = [];

  /**
   * Initialize with operations to perform
   */
  initialize(algorithm: any, input: StackOperation[]): void {
    this.operations = input;
    super.initialize(algorithm, []);
  }

  /**
   * Generate all steps for stack operations
   */
  generateSteps(): AlgorithmStep[] {
    this.steps = [];
    const stack: number[] = [];

    // Initial state
    const initialState = this.createStackState(stack);
    this.steps.push(
      this.createStep(
        'highlight',
        'Stack initialized (empty)',
        0,
        [],
        initialState,
        initialState,
        'A stack is a LIFO (Last-In-First-Out) data structure. Elements are added and removed from the top. Think of it like a stack of plates.',
        { size: 0, top: null, isEmpty: true }
      )
    );

    // Execute operations
    for (let i = 0; i < this.operations.length; i++) {
      const op = this.operations[i];

      if (op.type === 'push') {
        const beforePush = this.createStackState(stack);
        stack.push(op.value);
        this.incrementOperations();

        const afterPush = this.createStackState(stack);
        this.steps.push(
          this.createStep(
            'insert',
            `Push ${op.value} onto stack`,
            2,
            [stack.length - 1],
            beforePush,
            afterPush,
            `Adding ${op.value} to the top of the stack. The operation stack.push(${op.value}) adds the element to the end of the array. The new top index is ${stack.length - 1}.`,
            { operation: 'push', value: op.value, 'new top': op.value, 'top index': stack.length - 1, size: stack.length }
          )
        );

        // Highlight top element
        const topState = this.createStackState(stack, { top: stack.length - 1 });
        this.steps.push(
          this.createStep(
            'highlight',
            `Top of stack is now ${op.value}`,
            3,
            [stack.length - 1],
            topState,
            topState,
            `The top pointer now points to ${op.value} at index ${stack.length - 1}. This is the element that will be removed if we call pop().`,
            { top: op.value, 'top index': stack.length - 1, stack: `[${stack.join(', ')}]` }
          )
        );
      } else if (op.type === 'pop') {
        if (stack.length === 0) {
          const underflowState = this.createStackState(stack, { underflow: true });
          this.steps.push(
            this.createStep(
              'highlight',
              'Stack underflow! Cannot pop from empty stack',
              5,
              [],
              underflowState,
              underflowState,
              'Attempting to pop from an empty stack causes an underflow error. Always check if the stack is empty before popping!',
              { error: 'Stack Underflow', size: 0, isEmpty: true }
            )
          );
        } else {
          const beforePop = this.createStackState(stack);
          const poppedValue = stack.pop()!;
          this.incrementOperations();

          const afterPop = this.createStackState(stack);
          this.steps.push(
            this.createStep(
              'delete',
              `Pop ${poppedValue} from stack`,
              6,
              [stack.length],
              beforePop,
              afterPop,
              `Removing the top element ${poppedValue} from the stack. We store it in a temporary variable: temp = ${poppedValue}, then remove it from the array. The stack size decreases from ${beforePop.data.length} to ${stack.length}.`,
              { operation: 'pop', 'popped value': poppedValue, 'previous size': beforePop.data.length, 'new size': stack.length, 'previous top': poppedValue }
            )
          );

          if (stack.length > 0) {
            const newTopState = this.createStackState(stack, { top: stack.length - 1 });
            this.steps.push(
              this.createStep(
                'highlight',
                `Top of stack is now ${stack[stack.length - 1]}`,
                7,
                [stack.length - 1],
                newTopState,
                newTopState,
                `After popping ${poppedValue}, the new top element is ${stack[stack.length - 1]} at index ${stack.length - 1}. This is now the most recently added element.`,
                { 'new top': stack[stack.length - 1], 'top index': stack.length - 1, stack: `[${stack.join(', ')}]` }
              )
            );
          }
        }
      } else if (op.type === 'peek') {
        if (stack.length === 0) {
          const emptyState = this.createStackState(stack);
          this.steps.push(
            this.createStep(
              'highlight',
              'Stack is empty, nothing to peek',
              9,
              [],
              emptyState,
              emptyState,
              'Peek operation on an empty stack returns null or undefined. The stack has no elements to view.',
              { operation: 'peek', result: null, isEmpty: true, size: 0 }
            )
          );
        } else {
          const peekState = this.createStackState(stack, { peeking: true });
          this.steps.push(
            this.createStep(
              'highlight',
              `Peek: Top element is ${stack[stack.length - 1]}`,
              10,
              [stack.length - 1],
              peekState,
              peekState,
              `Peek lets us view the top element (${stack[stack.length - 1]}) without removing it. The stack remains unchanged. Use peek when you need to check what's on top without modifying the stack.`,
              { operation: 'peek', 'top value': stack[stack.length - 1], 'top index': stack.length - 1, size: stack.length }
            )
          );
        }
      }
    }

    // Final state
    const finalState = this.createStackState(stack, { complete: true });
    this.steps.push(
      this.createStep(
        'highlight',
        `Operations complete. Stack size: ${stack.length}`,
        12,
        Array.from({ length: stack.length }, (_, i) => i),
        finalState,
        finalState
      )
    );

    return this.steps;
  }

  private createStackState(stack: number[], metadata: Record<string, any> = {}) {
    return {
      type: 'stack' as const,
      data: [...stack],
      metadata,
    };
  }

  protected createState(data: any, metadata: Record<string, any> = {}) {
    return this.createStackState(data, metadata);
  }
}
