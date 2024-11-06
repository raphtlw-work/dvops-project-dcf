import express from 'express';
import { db } from './db.js'; // Assuming db is the initialized Drizzle instance
import { usersTable } from '../schema/db.js'; // Import the usersTable
import { eq } from 'drizzle-orm';

export const oceanRouter = express.Router();

// Route to get user balance
oceanRouter.get('/balance', async (req, res) => {
  const userId = parseInt(req.query.userId as any);

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to get the user balance based on the userId
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1).execute();

    // Check if the user was found
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract balance from the user record
    const { balance } = user[0];

    // Return the balance as a response
    return res.json({
      userId,
      balance: parseFloat(balance), // Ensure the balance is in float format
    });
  } catch (err) {
    // Handle any potential database errors
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while retrieving the balance' });
  }
});
