import "dotenv/config"

import { defineConfig } from "cypress"
import { GenerateCtrfReport } from "cypress-ctrf-json-reporter"
import { sql } from "drizzle-orm"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async clearDB() {
          // prettier-ignore
          const query = sql<string>`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE`

          const tables = await this.db.execute(query) // retrieve tables

          for (let table of tables) {
            const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`)
            await this.db.execute(query) // Truncate (clear all the data) the table
          }
        },
      })
      new GenerateCtrfReport({ on })
    },
  },
})
