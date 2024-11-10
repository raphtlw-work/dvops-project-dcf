// Assuming you already have express and db imported
import { eq } from "drizzle-orm"
import express from "express"
import jwt from "jsonwebtoken"
import { usersTable } from "../schema/db.js" // Your users table schema
import { db } from "./db.js" // Your Drizzle ORM instance

export const chenxinRouter = express.Router()

const app = express()

app.get("/user/profile", async (req, res) => {
    if (!req.headers.authorization) {
      res.status(403).json({ error: "No token found" })
      return
    }
  
    const token = req.headers.authorization.split(" ")[1]
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
      const user = payload.user as typeof usersTable.$inferSelect
      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, user.id))
  
      if (dbUser.length === 0) {
        res.status(404).json({ error: "User not found" })
        return
      }
  
      const { username, email } = dbUser[0]
      res.status(200).json({ success: true, username, email })
    } catch (e) {
      res.status(401).json({ error: "Invalid token" })
    }
  })
  
  app.put("/user/profile", async (req, res) => {
    if (!req.headers.authorization) {
      res.status(403).json({ error: "No token found" })
      return
    }
  
    const token = req.headers.authorization.split(" ")[1]
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
      const user = payload.user as typeof usersTable.$inferSelect
      const { username, email } = req.body
  
      const dbUser = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, user.id))
  
      if (dbUser.length === 0) {
        res.status(404).json({ error: "User not found" })
        return
      }
  
      await db
        .update(usersTable)
        .set({ username, email })
        .where(eq(usersTable.id, user.id))
  
      res.status(200).json({ success: true, username, email })
    } catch (e) {
      res.status(401).json({ error: "Invalid token" })
    }
  })