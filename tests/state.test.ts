import { RunStateMachine } from '../src/engine/state';
import { RunStatus } from '../src/engine/types';

describe('Run State Machine', () => {
  it('should initialize with pending status', () => {
    const stateMachine = new RunStateMachine('run123', 'wf456');
    const state = stateMachine.getState();
    
    expect(state.status).toBe('pending');
    expect(state.tasks).toHaveLength(0);
  });

  it('should add tasks correctly', () => {
    const stateMachine = new RunStateMachine('run123', 'wf456');
    stateMachine.addTask('task1', 'handler1');

    const state = stateMachine.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe('task1');
    expect(state.tasks[0].status).toBe('pending');
  });

  it('should update task status correctly', () => {
    const stateMachine = new RunStateMachine('run123', 'wf456');
    stateMachine.addTask('task1', 'handler1');
    stateMachine.setTaskStatus('task1', 'running');

    const state = stateMachine.getState();
    expect(state.tasks[0].status).toBe('running');
  });

  it('should update run status based on task statuses', () => {
    const stateMachine = new RunStateMachine('run123', 'wf456');
    stateMachine.addTask('task1', 'handler1');
    stateMachine.addTask('task2', 'handler2');

    // Both pending
    let state = stateMachine.getState();
    expect(state.status).toBe('pending');

    // One running, one pending
    stateMachine.setTaskStatus('task1', 'running');
    state = stateMachine.getState();
    expect(state.status).toBe('running');

    // One completed, one running
    stateMachine.setTaskStatus('task2', 'completed');
    state = stateMachine.getState();
    expect(state.status).toBe('running');

    // Both completed
    stateMachine.setTaskStatus('task1', 'completed');
    state = stateMachine.getState();
    expect(state.status).toBe('completed');
  });

  it('should handle failed tasks correctly', () => {
    const stateMachine = new RunStateMachine('run123', 'wf456');
    stateMachine.addTask('task1', 'handler1');

    stateMachine.setTaskStatus('task1', 'failed', 'Some error');

    const state = stateMachine.getState();
    expect(state.status).toBe('failed');
    expect(state.tasks[0].lastError).toBe('Some error');
  });
});