import { TaskId, Task } from './types';

export function topologicalSort(tasks: Task[]): Task[] {
  const visited = new Set<TaskId>();
  const sorted: Task[] = [];
  const visiting = new Set<TaskId>();

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      visit(task, tasks, visited, sorted, visiting);
    }
  }

  return sorted;
}

function visit(
  task: Task,
  allTasks: Task[],
  visited: Set<TaskId>,
  sorted: Task[],
  visiting: Set<TaskId>
) {
  if (visiting.has(task.id)) {
    throw new Error(`Cycle detected in workflow: ${task.id}`);
  }

  if (visited.has(task.id)) return;

  visiting.add(task.id);

  const dependencies = task.dependencies || [];
  for (const depId of dependencies) {
    const depTask = allTasks.find(t => t.id === depId);
    if (!depTask) {
      throw new Error(`Dependency not found: ${depId}`);
    }
    visit(depTask, allTasks, visited, sorted, visiting);
  }

  visiting.delete(task.id);
  visited.add(task.id);
  sorted.push(task);
}