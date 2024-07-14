import { Hono } from 'hono';
import { db } from '../db';

export const statusHandler = new Hono();

statusHandler.get('/api/analysis/:analysisId/status', async (c) => {
  try {
    const userId = c.req.query("userId");
    const analysisId = c.req.param("analysisId");
    const snapshot = await db.ref(`users/${userId}/analyses/${analysisId}`).once('value');

    if (snapshot.exists()) {
      return c.json({ status: snapshot.val() });
    } else {
      return c.json({ status: 'not_found' }, 404);
    }
  } catch (error) {
    return c.json({ status: 'error', error: "Internal server error" }, 500);
  }
});
