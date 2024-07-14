import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import JSZip from 'jszip';
import fs from 'fs';

const app = new Hono();

app.get('/hello', (c) => c.json({ message: 'Hello, World!' }));
// app.route("/", uploadHandler);

// Combine chunks after all are uploaded
const combineChunks = async (name: string) => {
  const zip = new JSZip();
  const chunks = [];

  for (let i = 0; i < 4; i++) {
    const chunkPath = `chunks/${name}-${i}.zip`;
    const chunk = fs.readFileSync(chunkPath);

    const decompressedChunk = JSZip.loadAsync(chunk)
      .then((zipFile) => zipFile.file(`chunk-${i}`)!
      .async('nodebuffer')
    );

    chunks.push(decompressedChunk);
    fs.unlinkSync(chunkPath); // Remove chunk file after reading
  }

  if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
  const writeStream = fs.createWriteStream(`uploads/dump-${name}.mem`);

  for (const chunk of chunks) {
    writeStream.write(chunk);
  }

  writeStream.end();
};

app.post('/api/upload', async (c) => {
  const index = Number(c.req.query("id"));
  const name = c.req.query("name") || "chunk";
  
  if (Number.isNaN(index)) return c.json({
    message: "Id parameter is invalid",
    status: "fail"
  });

  if (!fs.existsSync("chunks")) fs.mkdirSync("chunks");
  const chunk = (await c.req.parseBody())["chunk"] as File;
  fs.writeFileSync(`chunks/${name}-${index}.zip`, Buffer.from(await chunk.arrayBuffer()));

  c.json({ status: "success", message: 'Chunk uploaded' });
}).get('/api/complete-upload', async (c) => {
  await combineChunks(c.req.query("name") || "chunk");
  c.json({ status: "success", message: 'File upload successful' });
});


serve({
  fetch: app.fetch,
  port: 8282,
});
