interface ProcessInfo {
  Process: string;
  Args: string;
  PID: number;
}

export function parseCmdLine(data: string): ProcessInfo[] {
  const lines = data.trim().split('\n');
  const result: ProcessInfo[] = [];

  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/(\d+)\s+(\S+)\s+(.+)/);
    if (!match) continue;

    result.push({
      PID: parseInt(match[1]),
      Process: match[2],
      Args: match[3]
    });
  }

  return result;
}
