import { parentPort } from 'worker_threads';

if (!parentPort) {
  throw new Error('Worker must be run as a thread');
}

parentPort.on('message', async (taskData) => {
  try {
    // Simulate task execution
    await new Promise(resolve => setTimeout(resolve, 100));
    
    parentPort!.postMessage({ success: true, result: `Processed ${taskData}` });
  } catch (error) {
    parentPort!.postMessage({ success: false, error: error.message });
  }
});