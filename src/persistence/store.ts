import { RunState } from '../engine/types';

const runStore: Map<string, RunState> = new Map();
const workflowStore: Map<string, any> = new Map();

export async function storeRun(runId: string, state?: RunState): Promise<RunState | void> {
  if (state) {
    runStore.set(runId, state);
  } else {
    return runStore.get(runId);
  }
}

export async function getWorkflowById(id: string): Promise<any | null> {
  return workflowStore.get(id) || null;
}