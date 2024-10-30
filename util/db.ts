import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../schema/db.ts"

export const getConnectionString = () =>
  `postgresql://postgres:${process.env.POSTGRES_PASSWORD}@localhost:5432/postgres`

export const db = drizzle(getConnectionString(), {
  schema,
})
