import { TaskId } from '../engine/types';

export interface TaskHandler {
  (input: any): Promise<any>;
}

const handlers: Map<TaskId, TaskHandler> = new Map();

export function registerHandler(taskId: TaskId, handler: TaskHandler) {
  handlers.set(taskId, handler);
}

export function getHandler(taskId: TaskId): TaskHandler | undefined {
  return handlers.get(taskId);
}