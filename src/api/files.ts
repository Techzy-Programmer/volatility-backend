import { Hono } from 'hono';
import { db } from '../db';

export const fileHandler = new Hono();

fileHandler.get('/api/files', async (c) => {
  try {
    const req = c.req;
    const userId = req.query("userId");
    const snapshot = await db.ref(`users/${userId}/files`).once('value');

    if (snapshot.exists()) {
      return c.json({ status: 'success', files: Object.keys(snapshot.val()) });
    } else {
      return c.json({ status: 'no_files_uploaded' }, 400);
    }
  } catch (error) {
    return c.json({ status: 'error', error: (error as unknown as Error).message }, 500);
  }
});
