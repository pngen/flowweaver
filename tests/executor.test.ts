import { startRun, registerWorkflow } from '../src/engine/executor';
import { WorkflowDefinition } from '../src/engine/schema';

describe('Executor', () => {
  it('should register workflow correctly', async () => {
    const workflow: WorkflowDefinition = {
      id: 'test-workflow',
      tasks: [
        { id: 'task1', name: 'Task 1', handler: 'handler1' }
      ]
    };

    const result = await registerWorkflow(workflow);
    expect(result).toBe('test-workflow');
  });

  it('should start a run with valid workflow', async () => {
    // Mock the workflow store to return our test workflow
    jest.mock('../src/persistence/store', () => ({
      getWorkflowById: jest.fn().mockResolvedValue({
        id: 'test-workflow',
        tasks: [
          { id: 'task1', name: 'Task 1', handler: 'handler1' }
        ]
      }),
      storeRun: jest.fn()
    }));

    const runRequest = {
      workflowId: 'test-workflow'
    };

    // This test is mostly to ensure no exceptions are thrown
    await expect(startRun(runRequest)).resolves.toBeDefined();
  });
});