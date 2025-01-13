import { gamesTable, usersTable } from "@/schema/db"
import { db } from "@/util/db"
import { eq } from "drizzle-orm"
import express from "express"
import jwt from "jsonwebtoken"

export const aslamRouter = express.Router()

// Define the payload type with `user` property
interface JwtPayloadWithUser extends jwt.JwtPayload {
  user: {
    id: number
  }
}

// Coin Flip Route
aslamRouter.post("/coinflip", async (req, res) => {
  const { choice } = req.body

  if (!req.headers.authorization) {
    res.status(403).json({ error: "No token found" })
    return
  }

  const token = req.headers.authorization.split(" ")[1]
  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET!,
  ) as JwtPayloadWithUser
  const userId = payload.user.id

  // Fetch user and balance
  const userRecord = await db
    .select({ balance: usersTable.balance })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .execute()

  if (userRecord.length === 0) {
    res.status(404).json({ error: "User not found" })
    return
  }

  const currentBalance = parseFloat(userRecord[0].balance)
  if (currentBalance <= 0) {
    res.status(400).json({ error: "Insufficient balance to play" })
    return
  }

  // Simulate coin flip
  const flipResult = Math.random() < 0.5 ? "heads" : "tails"
  let newBalance
  let win = false
  let message = ""

  if (choice === flipResult) {
    newBalance = currentBalance * 2
    win = true
    message = "Congratulations! You won, and your balance doubled."
  } else {
    newBalance = 0
    message = "You lost! your credit is now zero."
  }

  // Update user's balance and record game result
  try {
    await db.transaction(async (trx) => {
      await trx
        .update(usersTable)
        .set({ balance: `${newBalance}` })
        .where(eq(usersTable.id, userId))

      await trx.insert(gamesTable).values({
        userId: userId,
        amount: `${newBalance}`,
        win: win,
      })
    })

    res.json({ balance: newBalance, message })
  } catch (error) {
    console.error("Error updating balance or recording game:", error)
    res.status(500).json({ error: "Failed to update balance and record game" })
  }
})
