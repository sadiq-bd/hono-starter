import { z } from 'zod';

export const createTokenSchema = z.object({
  'X-App-Key': z.string().min(1, 'App key is required'),
  'X-App-Secret': z.string().optional(),
});

export const createTokenBodySchema = z.object({
  'X-App-Key': z.string().optional(),
  'X-App-Secret': z.string().optional(),
}).passthrough();

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

export const removeTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

