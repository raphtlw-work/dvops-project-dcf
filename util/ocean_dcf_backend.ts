// Assuming you already have express and db imported
import express from 'express';
import { db } from './db.js';  // Your Drizzle ORM instance
import { usersTable } from '../schema/db.js'; // Your users table schema
import { eq } from 'drizzle-orm';

export const oceanRouter = express.Router();

// Route to update user balance
oceanRouter.post('/balance', async (req, res) => {
  const { userId, balance } = req.body;

  // Check if userId and balance are provided
  if (!userId || typeof balance !== 'number') {
    return res.status(400).json({ error: 'Invalid userId or balance' });
  }

  try {
    // Update the user's balance in the database
    const updatedUser = await db
      .update(usersTable)
      .set({ balance })  // Set the new balance
      .where(eq(usersTable.id, userId))  // Find the user by ID
      .execute();

    if (updatedUser.count === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated balance
    return res.json({
      userId,
      balance,
    });
  } catch (err) {
    console.error('Error updating balance:', err);
    return res.status(500).json({ error: 'Failed to update balance' });
  }
});
