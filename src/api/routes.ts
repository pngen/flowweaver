import { IncomingMessage, ServerResponse } from 'http';
import { registerWorkflow, startRun, getRunStatus } from '../engine/executor';
import { parseJsonBody } from '../util/json';
import { WorkflowDefinition, RunRequest } from '../engine/schema';

export async function handleRoutes(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const method = req.method;

  try {
    if (method === 'POST' && url.pathname === '/workflows') {
      const body = await parseJsonBody(req);
      const workflow = WorkflowDefinition.parse(body);
      const id = await registerWorkflow(workflow);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id }));
    } else if (method === 'POST' && url.pathname === '/runs') {
      const body = await parseJsonBody(req);
      const runRequest = RunRequest.parse(body);
      const runId = await startRun(runRequest);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: runId }));
    } else if (method === 'GET' && url.pathname.startsWith('/runs/')) {
      const runId = url.pathname.split('/')[3];
      const status = await getRunStatus(runId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
}