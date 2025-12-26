// Stub for Postgres adapter
export class PostgresPersistence {
  async storeRun(runId: string, state: any) {
    // Implementation would go here
    console.log('Storing run in Postgres:', runId);
  }

  async getRun(runId: string) {
    // Implementation would go here
    return null;
  }
}