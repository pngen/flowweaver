import { topologicalSort } from '../src/engine/dag';
import { Task } from '../src/engine/types';

describe('DAG Topological Sort', () => {
  it('should sort tasks in correct order', () => {
    const tasks: Task[] = [
      { id: 'task1', name: 'Task 1', handler: 'handler1' },
      { id: 'task2', name: 'Task 2', handler: 'handler2', dependencies: ['task1'] },
      { id: 'task3', name: 'Task 3', handler: 'handler3', dependencies: ['task2'] }
    ];

    const sorted = topologicalSort(tasks);
    expect(sorted.map(t => t.id)).toEqual(['task1', 'task2', 'task3']);
  });

  it('should throw on cycle detection', () => {
    const tasks: Task[] = [
      { id: 'task1', name: 'Task 1', handler: 'handler1', dependencies: ['task2'] },
      { id: 'task2', name: 'Task 2', handler: 'handler2', dependencies: ['task1'] }
    ];

    expect(() => topologicalSort(tasks)).toThrow('Cycle detected');
  });

  it('should handle tasks with no dependencies', () => {
    const tasks: Task[] = [
      { id: 'task1', name: 'Task 1', handler: 'handler1' },
      { id: 'task2', name: 'Task 2', handler: 'handler2' }
    ];

    const sorted = topologicalSort(tasks);
    expect(sorted.map(t => t.id)).toEqual(['task1', 'task2']);
  });
});