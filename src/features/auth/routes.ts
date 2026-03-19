import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createTokenBodySchema, refreshTokenSchema, removeTokenSchema } from './schemas';
import * as authService from './service';
import utils from '../../core/utils';

const authRoutes = new Hono<{ Bindings: CloudflareBindings }>();

authRoutes.post('/create', zValidator('json', createTokenBodySchema), async (c) => {
  const body = c.req.valid('json');
  // Fallback to headers if not in body
  const appKey = (body['X-App-Key'] as string) || c.req.header('X-App-Key');
  const appSecret = (body['X-App-Secret'] as string) || c.req.header('X-App-Secret');

  if (!appKey) {
    return utils.jsonError('X-App-Key is required in body or headers', {}, 400);
  }

  const result = await authService.createToken(c, appKey, appSecret);
  return utils.jsonSuccess('Token created', { data: result });
});

authRoutes.post('/refresh', zValidator('json', refreshTokenSchema), async (c) => {
  const body = c.req.valid('json');
  const result = await authService.refreshToken(c, body.refresh_token);
  return utils.jsonSuccess('Token refreshed', { data: result });
});

authRoutes.delete('/remove', zValidator('json', removeTokenSchema), async (c) => {
  const body = c.req.valid('json');
  await authService.removeToken(c, body.token);
  return utils.jsonSuccess('Token removed');
});

export default authRoutes;
