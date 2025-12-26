import { Worker } from 'worker_threads';
import path from 'path';

export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];

  constructor(private numWorkers: number, private workerPath: string) {
    this.init();
  }

  private init() {
    for (let i = 0; i < this.numWorkers; i++) {
      const worker = new Worker(this.workerPath);
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  public async runTask(taskData: any): Promise<any> {
    if (this.availableWorkers.length === 0) {
      throw new Error('No available workers');
    }

    const worker = this.availableWorkers.pop()!;
    return new Promise((resolve, reject) => {
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.postMessage(taskData);

      // Return worker to pool when done
      worker.once('exit', () => {
        this.availableWorkers.push(worker);
      });
    });
  }
}