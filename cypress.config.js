import "dotenv/config"

import { defineConfig } from "cypress"
import { GenerateCtrfReport } from "cypress-ctrf-json-reporter"
import { sql } from "drizzle-orm"
import { db } from "./cypress/build/util/db"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async clearDB() {
          const result = await db.execute(sql`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
          `)

          return result
        },
      })
      new GenerateCtrfReport({ on })
    },
  },
})
