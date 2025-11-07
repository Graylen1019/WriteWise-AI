import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  aiSuggestion: text("ai_suggestion"),
  createdAt: timestamp("created_at").default(sql`now()`),
});
