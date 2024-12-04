// Assuming you already have express and db imported
import { eq } from "drizzle-orm"
import express from "express"
import jwt from "jsonwebtoken"
import { usersTable } from "../schema/db.js" // Your users table schema
import { db } from "./db.js" // Your Drizzle ORM instance

export const oceanRouter = express.Router()

// Route to update user balance
oceanRouter.post("/user/balance", async (req, res) => {
  try {
    const { balance } = req.body

    if (!req.headers.authorization) {
      res.status(403).json({ error: "No token found" })
      return
    }

    const token = req.headers.authorization.split(" ")[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = payload.user as typeof usersTable.$inferSelect
    const dbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user.id))

    console.log(user)
    console.log(dbUser)

    if (dbUser.length === 0) {
      res.status(404).json({ error: "User not found" })
      return
    }

    try {
      // Update the user's balance in the database
      const updatedUser = await db
        .update(usersTable)
        .set({ balance }) // Set the new balance
        .where(eq(usersTable.id, dbUser[0].id)) // Find the user by ID
        .execute()

      if (updatedUser.rowCount === 0) {
        res.status(404).json({ error: "User not found" })
        return
      }

      // Return the updated balance
      res.json({ balance })
      return
    } catch (err) {
      console.error("Error updating balance:", err)
      res.status(500).json({ error: "Failed to update balance" })
      return
    }
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({error: "Invalid token"})
      return
    }
  }
})
