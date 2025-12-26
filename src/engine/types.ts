export type TaskId = string;
export type WorkflowId = string;
export type RunId = string;

export interface Task {
  id: TaskId;
  name: string;
  handler: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  dependencies?: TaskId[];
}

export interface WorkflowDefinition {
  id: WorkflowId;
  tasks: Task[];
}

export interface RunRequest {
  workflowId: WorkflowId;
  idempotencyKey?: string;
  parameters?: Record<string, any>;
}

export type RunStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface RunState {
  id: RunId;
  workflowId: WorkflowId;
  status: RunStatus;
  tasks: TaskState[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskState {
  id: TaskId;
  status: 'pending' | 'running' | 'completed' | 'failed';
  attempts: number;
  lastError?: string;
  startedAt?: Date;
  completedAt?: Date;
}