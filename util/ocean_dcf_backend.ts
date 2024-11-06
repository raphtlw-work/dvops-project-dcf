// Assuming you already have express and db imported
import { eq } from "drizzle-orm"
import express from "express"
import { usersTable } from "../schema/db.js" // Your users table schema
import { db } from "./db.js" // Your Drizzle ORM instance

export const oceanRouter = express.Router()

// Route to update user balance
oceanRouter.post("/balance", async (req, res) => {
  const { userId, balance } = req.body

  // Check if userId and balance are provided
  if (!userId || typeof balance !== "string") {
    res.status(400).json({ error: "Invalid userId or balance" })
    return
  }

  try {
    // Update the user's balance in the database
    const updatedUser = await db
      .update(usersTable)
      .set({ balance }) // Set the new balance
      .where(eq(usersTable.id, userId)) // Find the user by ID
      .execute()

    if (updatedUser.rowCount === 0) {
      res.status(404).json({ error: "User not found" })
      return
    }

    // Return the updated balance
    res.json({
      userId,
      balance,
    })
    return
  } catch (err) {
    console.error("Error updating balance:", err)
    res.status(500).json({ error: "Failed to update balance" })
    return
  }
})
