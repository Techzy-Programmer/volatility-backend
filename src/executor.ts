import { exec } from "child_process";
import { removeRedundant } from "./helper";

export function executeVol(file: string, plugin: string, proc: Function) {
  return new Promise((res, rej) => {
    const command = `python c:\\volatility\\vol.py -f uploads/${file}.mem ${plugin}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error, stderr);
        rej(stderr);
        return;
      }
    
      const parsedStdOut = removeRedundant(stdout);
      res(proc(parsedStdOut));
    });
  });
}
