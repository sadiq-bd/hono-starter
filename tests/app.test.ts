import { describe, expect, it } from 'bun:test';
import app from '../src/app';

describe('Global App Router', () => {
  it('Should successfully return a 404 for unknown routes', async () => {
    // We send a mock request to the Hono instance
    const req = new Request('http://localhost/unknown-route');
    // We don't need to spin up a server, Hono app.request() handles it!
    const res = await app.request(req, {} as any);
    
    expect(res.status).toBe(404);
    
    const body = await res.json();
    expect(body).toEqual({ status: 'error', message: 'Not found' });
  });
});
