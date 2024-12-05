import "dotenv/config"

import { defineConfig } from "cypress"
import { usersTable } from "./build/schema/db"
import { db } from "./build/util/db"

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async clearDB() {
          const result = await db.delete(usersTable)
          return result
        },
      })
    },
  },
})
