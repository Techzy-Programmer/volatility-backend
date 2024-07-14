import { parseHiveList } from '../plugin-handlers/hive-list';
import { parseCmdLine } from '../plugin-handlers/cmd-line';
import { parseNetScan } from '../plugin-handlers/net-scan';
import { parsePsList } from '../plugin-handlers/ps-list';
import { executeVol } from '../executor';
import { genRandom } from '../helper';
import { Hono } from 'hono';
import { db } from '../db';

export const analyzeHandler = new Hono();

const plugins: Record<string, string> = {
  "hiveList": "windows.registry.hivelist.HiveList",
  "cmdLine": "windows.cmdline.CmdLine",
  "netScan": "windows.netscan.NetScan",
  "malfind": "windows.malfind.Malfind",
  "psList": "windows.pslist.PsList"
};

const pluginsFn: Record<string, Function> = {
  "hiveList": parseHiveList,
  "cmdLine": parseCmdLine,
  "netScan": parseNetScan,
  "psList": parsePsList
}

analyzeHandler.post('/api/analyze', async (c) => {
  const { fileId, plugin } = await c.req.json();
  const id = c.req.query("userId");
  const analysisId = genRandom();

  console.log("Handling");

  if (!plugins[plugin]) return c.json({
    message: "invalid_plugin",
    status: "fail",
  });

  await db.ref(`users/${id}/analyses/${analysisId}`).set('in_progress');

  executeVol(fileId, plugins[plugin], pluginsFn[plugin]).then(async (val) => {
    console.log("Val", val);
    await db.ref(`users/${id}/analyses/${analysisId}`).set('completed');
    await db.ref(`users/${id}/analysisData/${plugin}`).update({
      [analysisId]: {
          ...(val as Record<string, any>),
          __timestamp: Date.now()
        }
    });
  })
  .catch(async er => {
    console.log(er);
    await db.ref(`users/${id}/analyses/${analysisId}`).set('failed');
  });

  return c.json({ status: "analysis_started", analysisId });
});
