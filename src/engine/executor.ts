import { RunRequest, WorkflowDefinition } from './schema';
import { topologicalSort } from './dag';
import { RunStateMachine } from './state';
import { TaskState } from './types';
import { getWorkflowById, storeRun } from '../persistence/store';
import { generateIdempotencyKey } from '../engine/idempotency';
import { emitRunEvent } from './events';

export async function registerWorkflow(workflow: WorkflowDefinition): Promise<string> {
  // In a real implementation, this would persist the workflow
  return workflow.id;
}

export async function startRun(request: RunRequest): Promise<string> {
  const workflow = await getWorkflowById(request.workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${request.workflowId}`);
  }

  const idempotencyKey = request.idempotencyKey || generateIdempotencyKey();
  // In a real implementation, check for existing run with same key

  const sortedTasks = topologicalSort(workflow.tasks);
  const runId = `run_${Date.now()}`;

  const runState = new RunStateMachine(runId, workflow.id);

  for (const task of sortedTasks) {
    runState.addTask(task.id, task.handler);
  }

  await storeRun(runId, runState.getState());

  // Emit initial event
  emitRunEvent(runId, { type: 'run_started', payload: { runId } });

  // Start execution
  processNextTask(runId, sortedTasks);

  return runId;
}

export async function getRunStatus(runId: string): Promise<any> {
  const runState = await storeRun(runId);
  if (!runState) {
    throw new Error(`Run not found: ${runId}`);
  }
  return runState;
}

async function processNextTask(runId: string, sortedTasks: any[]) {
  // In a real implementation, this would schedule tasks based on dependencies
  const runState = await storeRun(runId);
  if (!runState) return;

  for (const task of sortedTasks) {
    const taskState = runState.tasks.find((t: TaskState) => t.id === task.id);
    if (taskState && taskState.status === 'pending') {
      // Simulate task execution
      setTimeout(() => {
        executeTask(runId, task.id);
      }, 100);
      break;
    }
  }
}

async function executeTask(runId: string, taskId: string) {
  const runState = await storeRun(runId);
  if (!runState) return;

  // Update task status to running
  const taskState = runState.tasks.find((t: TaskState) => t.id === taskId);
  if (taskState) {
    taskState.status = 'running';
    taskState.startedAt = new Date();
    await storeRun(runId, runState);

    // Simulate work
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        taskState.status = 'completed';
        taskState.completedAt = new Date();
      } else {
        taskState.status = 'failed';
        taskState.lastError = 'Simulated failure';
        taskState.attempts += 1;
      }

      storeRun(runId, runState);
      emitRunEvent(runId, { type: 'task_completed', payload: { taskId, status: taskState.status } });

      // Continue processing next tasks
      processNextTask(runId, []);
    }, 500);
  }
}