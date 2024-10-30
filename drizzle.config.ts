import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import { getConnectionString } from "./util/db.ts"

export default defineConfig({
  out: "./drizzle",
  schema: "./schema/db.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getConnectionString(),
  },
})
