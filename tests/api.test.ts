import { handleRoutes } from '../src/api/routes';
import http from 'http';

describe('API Routes', () => {
  it('should return 404 for unknown routes', async () => {
    const req = {
      url: '/unknown',
      method: 'GET',
      headers: {}
    } as any;

    const res = {
      writeHead: jest.fn(),
      end: jest.fn()
    } as any;

    await handleRoutes(req, res);
    expect(res.writeHead).toHaveBeenCalledWith(404, expect.anything());
  });
});