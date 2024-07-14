import crypto from "crypto";

export function genRandom(length = 6) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, length); // return required number of characters
}

export function removeRedundant(stdOut: string) {
  const lines = stdOut.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("Volatility") && line.includes("Framework")) {
      lines.splice(0, i + 4);
      return lines.join("\n");
    }
  }

  return null;
}

export function parseLine(ln: string) {
  return ln
    .trim()
    .split(" ")
    .filter(s => s != "");
}
