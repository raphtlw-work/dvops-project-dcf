import { eq } from "drizzle-orm"
import express from "express"
import jwt from "jsonwebtoken"
import { usersTable } from "../schema/db"
import { db } from "./db"

export const gameRouter = express.Router()

gameRouter.post("/flip", async (req, res) => {
  if (!req.headers.authorization) {
    res.status(403).json({ error: "No token found" })
    return
  }

  const token = req.headers.authorization.split(" ")[1]
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as string

  const user = JSON.parse(payload)

  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
  const amount = req.body.amount

  if (amount < 0 || amount > 100) {
    res.status(400).json({ error: "Amount must be between 0 and 100 credits" })
    return
  }

  const coinFlipResult = Math.random() < 0.5 ? "win" : "lose"
  const user = JSON.parse(payload)

  const dbUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.id))

  if (dbUser.length === 0) {
    res.status(404).json({ error: "User not found" })
    return
  }

  const currentBalance = dbUser[0].balance
  const newBalance = coinFlipResult === "win" ? currentBalance + amount : currentBalance - amount

  await db
    .update(usersTable)
    .set({ balance: newBalance })
    .where(eq(usersTable.id, user.id))

  res.status(200).json({ result: coinFlipResult, newBalance })
})