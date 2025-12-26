import http from 'http';
import { handleRoutes } from './routes';
import { createSseHandler } from './sse';

export async function startServer(port = 3000) {
  const server = http.createServer(async (req, res) => {
    if (req.url?.startsWith('/events/')) {
      await createSseHandler(req, res);
      return;
    }

    await handleRoutes(req, res);
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return server;
}