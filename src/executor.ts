import { exec } from "child_process";
import { removeRedundant } from "./helper";

export function executeVol(file: string, plugin: string, proc: Function) {
  return new Promise((res, rej) => {
    const command = `python3 c:\\volatility\\vol.py -f ${file} ${plugin}`;

    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        rej(error);
        return;
      }
    
      const parsedStdOut = removeRedundant(stdout);
      res(proc(parsedStdOut));
    });
  });
}
