import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  numeric,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  balance: numeric({ precision: 7, scale: 2 }).notNull().default("100.00"),
  password: varchar({ length: 255 }).notNull(),
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  games: many(gamesTable),
}))

export const gamesTable = pgTable("games", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id"),
  amount: numeric({ precision: 7, scale: 2 }).notNull().unique(),
  win: boolean(),
})

export const gamesRelations = relations(gamesTable, ({ one }) => ({
  invitee: one(usersTable, {
    fields: [gamesTable.userId],
    references: [usersTable.id],
  }),
}))
