import { Context } from 'hono';

// Simplified config loader using Cloudflare bindings
export function getConfig(c: Context) {
  return {
    env: c.env as CloudflareBindings,
    // Add additional config properties here if needed
  };
}
