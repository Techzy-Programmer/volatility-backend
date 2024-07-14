import { Hono } from 'hono';
import { db } from '../db';

export const resultHandler = new Hono();

resultHandler.get('/api/analysis/:analysisId/results', async (c) => {
  try {
    const req = c.req;
    const userId = req.query("userId");
    const plugin = req.query("plugin");
    const analysisId = req.param("analysisId");
    const snapshot = await db.ref(`users/${userId}/analysisData/${plugin}/${analysisId}`).once('value');

    if (snapshot.exists()) {
      const analysedData = Object.values(snapshot.val()) as string[];
      return c.json({ status: 'success', analysedData });
    } else {
      return c.json({ status: 'not_found' }, 404);
    }
  } catch (error) {
    return c.json({ status: 'error', error: (error as unknown as Error).message }, 500);
  }
});
