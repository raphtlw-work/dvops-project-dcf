import { eq } from "drizzle-orm";
import express from "express";
import jwt from "jsonwebtoken";
import { gamesTable, usersTable } from "../schema/db";
import { db } from "./db";

export const aslamRouter = express.Router();

// Define the payload type with `user` property
interface JwtPayloadWithUser extends jwt.JwtPayload {
  user: {
    id: number;
  };
}

// Coin Flip Route
aslamRouter.post("/coinflip", async (req, res) => {
  const { choice } = req.body;

  if (!req.headers.authorization) {
    res.status(403).json({ error: "No token found" });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  let payload: JwtPayloadWithUser;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithUser;
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return
  }

  const userId = payload.user.id;

  // Fetch user and balance
  const userRecord = await db
    .select({ balance: usersTable.balance })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .execute();

  if (userRecord.length === 0) {
    res.status(404).json({ error: "User not found" });
    return
  }

  const currentBalance = parseFloat(userRecord[0].balance);
  if (currentBalance <= 0) {
    res.status(400).json({ error: "Insufficient balance to play" });
    return
  }

  // Simulate coin flip
  const flipResult = Math.random() < 0.5 ? "heads" : "tails";
  let newBalance = 0;
  let win = false;
  let message = "";

  if (choice === flipResult) {
    newBalance = currentBalance * 2;
    win = true;
    message = "Congratulations! You won, and your balance doubled.";
  } else {
    message = "You lost! Your credit is now zero.";
  }

  try {
    await db.transaction(async (trx) => {
      await trx
        .update(usersTable)
        .set({ balance: newBalance.toString() })
        .where(eq(usersTable.id, userId))
        .execute();

      await trx
        .insert(gamesTable)
        .values({
          userId,
          amount: newBalance.toString(),
          win,
        })
        .execute();
    });

    res.status(200).json({ balance: newBalance, message });
    return
  } catch (error) {
    console.error("Error updating balance or recording game:", error);
    res.status(500).json({ error: "Failed to update balance and record game" });
    return
  }
});

