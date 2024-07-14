import { Hono } from 'hono';
import { db } from '../db';

export const analysesHandler = new Hono();

analysesHandler.get('/api/analyses', async (c) => {
  try {
    const userId = c.req.query("userId"); // Assuming userId is passed as a query parameter
    const snapshot = await db.ref(`users/${userId}/analysisData`).once('value');

    if (snapshot.exists()) {
      return c.json({ analyses: snapshot.val() });
    } else {
      return c.json({ analyses: [] });
    }
  } catch (error) {
    return c.json({ status: 'error', error: (error as unknown as Error).message });
  }
});
