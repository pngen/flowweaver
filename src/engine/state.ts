import { RunState, TaskState, RunStatus } from './types';

export class RunStateMachine {
  private state: RunState;

  constructor(runId: string, workflowId: string) {
    this.state = {
      id: runId,
      workflowId,
      status: 'pending',
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  public getState(): RunState {
    return { ...this.state };
  }

  public setTaskStatus(taskId: string, status: TaskState['status'], error?: string) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = status;
    task.lastError = error;

    if (status === 'running') {
      task.startedAt = new Date();
    } else if (status === 'completed' || status === 'failed') {
      task.completedAt = new Date();
    }

    this.updateRunStatus();
    this.state.updatedAt = new Date();
  }

  public addTask(taskId: string, handler: string) {
    const newTask: TaskState = {
      id: taskId,
      status: 'pending',
      attempts: 0
    };

    this.state.tasks.push(newTask);
    this.state.updatedAt = new Date();
  }

  private updateRunStatus() {
    if (this.state.tasks.length === 0) {
      this.state.status = 'pending';
      return;
    }

    const allCompleted = this.state.tasks.every(t => t.status === 'completed' || t.status === 'failed');
    const anyFailed = this.state.tasks.some(t => t.status === 'failed');

    if (allCompleted) {
      this.state.status = anyFailed ? 'failed' : 'completed';
    } else {
      const running = this.state.tasks.some(t => t.status === 'running');
      this.state.status = running ? 'running' : 'pending';
    }
  }

  public incrementAttempts(taskId: string) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.attempts += 1;
      this.state.updatedAt = new Date();
    }
  }
}