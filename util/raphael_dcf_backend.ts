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
})
