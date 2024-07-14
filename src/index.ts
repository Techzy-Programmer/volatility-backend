import { db } from './db';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { fileHandler } from './api/files';
import { resultHandler } from './api/result';
import { statusHandler } from './api/status';
import { uploadHandler } from './api/upload';
import { analyzeHandler } from './api/analyse';
import { analysesHandler } from './api/analyses';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: '*',
    maxAge: 600,
    credentials: true,
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  })
);

app.get('/hello', (c) => c.json({ message: 'Hello, World!' }));
app.route("/", analysesHandler);
app.route("/", analyzeHandler);
app.route("/", resultHandler);
app.route("/", statusHandler);
app.route("/", uploadHandler);
app.route("/", fileHandler);

app.use('*', async (c, next) => {
  const user = c.req.query("userId");
  const snap = await db.ref(`users/${user}`).once("value");

  if (!snap.exists()) {
    db.ref(`users/${user}`).set({
      analysisData: {
        "hiveList": {},
        "cmdLine": {},
        "netScan": {},
        "malfind": {},
        "psList": {}
      },
      analyses: {},
      files: {}
    });
  }

  await next();
});

serve({
  fetch: app.fetch,
  port: 8282,
});
