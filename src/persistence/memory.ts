import { RunState } from '../engine/types';

const memoryStore: Map<string, RunState> = new Map();

export function storeRun(runId: string, state?: RunState): RunState | void {
  if (state) {
    memoryStore.set(runId, state);
  } else {
    return memoryStore.get(runId);
  }
}

export function getWorkflowById(id: string): any | null {
  // In a real implementation, this would fetch from memory
  return null;
}