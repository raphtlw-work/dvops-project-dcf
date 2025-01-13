import "dotenv/config"

import { getConnectionString } from "@/util/db"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle",
  schema: "./schema/db.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getConnectionString(),
  },
})
