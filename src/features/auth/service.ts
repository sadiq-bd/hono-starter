import { Context } from 'hono';
import database from '../../database/factory';
import utils from '../../core/utils';
import { eq } from 'drizzle-orm';
import { apps, authTokens } from '../../database/schema';
import { AppError } from '../../core/errors';

export const TOKEN_EXPIRATION_DAYS = 30;

export async function createToken(c: Context, appKey: string, appSecret?: string) {
  const db = database();
  const appsRows = await db
    .select()
    .from(apps)
    .where(eq(apps.key, appKey))
    .limit(1);

  const app = appsRows[0];
  if (!app) throw new AppError('Invalid app key', 400);

  if (app.secret && app.secret !== appSecret) {
    throw new AppError('Secret mismatch', 400);
  }

  const token = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  const ip = utils.getIpAddress();
  const uag = c.req.header('User-Agent') || 'Unknown';
  const expiration = new Date(Date.now() + 86400 * 1000 * TOKEN_EXPIRATION_DAYS).toISOString();

  await db.insert(authTokens).values({
    app_id: app.id,
    token,
    refresh_token: refreshToken,
    ip_address: ip,
    user_agent: uag,
    expiration
  } as typeof authTokens.$inferInsert);

  return { token, refresh_token: refreshToken, expiration };
}

export async function refreshToken(c: Context, rToken: string) {
  const db = database();
  const rows = await db
    .select()
    .from(authTokens)
    .where(eq(authTokens.refresh_token, rToken))
    .limit(1);

  const oldToken = rows[0];
  if (!oldToken) throw new AppError('Invalid refresh_token', 400);

  const newToken = crypto.randomUUID();
  const newRefreshToken = crypto.randomUUID();
  const expiration = new Date(Date.now() + 86400 * 1000 * TOKEN_EXPIRATION_DAYS).toISOString();

  await db
    .update(authTokens)
    .set({ token: newToken, refresh_token: newRefreshToken, expiration })
    .where(eq(authTokens.id, oldToken.id));

  return { token: newToken, refresh_token: newRefreshToken, expiration };
}

export async function removeToken(c: Context, tokenVal: string) {
  const db = database();
  const rows = await db
    .select()
    .from(authTokens)
    .where(eq(authTokens.token, tokenVal))
    .limit(1);

  const tokenData = rows[0];
  if (!tokenData) throw new AppError('Invalid token', 400);

  await db
    .delete(authTokens)
    .where(eq(authTokens.token, tokenData.token));

  return true;
}
