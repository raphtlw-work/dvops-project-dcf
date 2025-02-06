import * as schema from "../schema/db"
import { drizzle } from "drizzle-orm/node-postgres"

export const getConnectionString = () => process.env.POSTGRES_CONNECTION_URL!

export const db = drizzle(getConnectionString(), {
  schema
})