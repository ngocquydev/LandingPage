import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const consultationRequests = sqliteTable("consultation_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  message: text("message").notNull(),
  plan: text("plan"),
  extras: text("extras").notNull(),
  estimate: integer("estimate"),
  createdAt: integer("created_at").notNull(),
});
