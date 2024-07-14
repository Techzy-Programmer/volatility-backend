import { genRandom } from '../helper';
import { Hono } from 'hono';
import fs from 'fs';
import { db } from '../db';

export const uploadHandler = new Hono();

uploadHandler.post('/api/memory-dump', async (c) => {
  const userId = c.req.query("userId");
  const fileId = genRandom();

  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

  const body = await c.req.json();
  const base64Data = body["file"]; // Assuming "file" contains the base64 string

  if (!base64Data) {
    return c.json({
      message: "File data is missing",
      status: "fail"
    });
  }

  // Remove the base64 header if it exists
  const base64HeaderIndex = base64Data.indexOf(',');
  const base64String = base64HeaderIndex !== -1 ? base64Data.substring(base64HeaderIndex + 1) : base64Data;

  // Decode base64 string
  const buffer = Buffer.from(base64String, 'base64');

  // Write the buffer to a file
  fs.writeFileSync(`uploads/${fileId}.7z`, buffer);
  await db.ref(`users/${userId}/files`).set({
    [fileId]: 1
  })

  return c.json({ status: "success", message: 'Dump uploaded', fileId });
});
