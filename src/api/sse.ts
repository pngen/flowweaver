import { IncomingMessage, ServerResponse } from 'http';
import { subscribeToRunEvents } from '../engine/events';

export async function createSseHandler(req: IncomingMessage, res: ServerResponse) {
  const runId = req.url?.split('/')[3];

  if (!runId) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing run ID');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const unsubscribe = subscribeToRunEvents(runId, (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
}