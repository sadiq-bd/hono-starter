import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const apps = sqliteTable("apps", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull().unique(),
  key: text().notNull(),
  secret: text(),
  created_at: text().default(sql`CURRENT_TIMESTAMP`)
    .$defaultFn(() => new Date().toISOString()),
});

export const authTokens = sqliteTable("auth_tokens", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  app_id: integer().notNull().references(() => apps.id),
  token: text().notNull().unique(),
  refresh_token: text().notNull(),
  ip_address: text().notNull(),
  user_agent: text().notNull(),
  expiration: text().notNull(),
  created_at: text().default(sql`CURRENT_TIMESTAMP`)
    .$defaultFn(() => new Date().toISOString()),
});

export const basicAuthCredentials = sqliteTable("basic_auth_credentials", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  user: text().notNull().unique(),
  password: text().notNull(),
});
