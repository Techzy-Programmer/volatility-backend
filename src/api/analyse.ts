import { parseHiveList } from '../plugin-handlers/hive-list';
import { parseCmdLine } from '../plugin-handlers/cmd-line';
import { parseNetScan } from '../plugin-handlers/net-scan';
import { parsePsList } from '../plugin-handlers/ps-list';
import { executeVol } from '../executor';
import { genRandom } from '../helper';
import { Hono } from 'hono';

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
  const analysisId = genRandom();

  if (!plugins[plugin]) return c.json({
    message: "invalid_plugin",
    status: "fail",
  });

  executeVol(fileId, plugin, pluginsFn[plugin]).then((val) => {
    // 
  })
  .catch(er => {
    // 
  });

  c.json({ status: "analysis_started", analysisId });
});
