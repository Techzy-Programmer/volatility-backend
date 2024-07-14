interface ProcessInfo {
  PID: number;
  PPID: number;
  ImageFileName: string;
  Threads: number;
  Handles: number;
  SessionId: number;
  Wow64: boolean;
  CreateTime: string;
  ExitTime: string | null;
}

export function parsePsList(data: string): ProcessInfo[] {
  const regex = /(\d+)\s+(\d+)\s+(\S+)\s+([0-9a-fx]+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(True|False)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d+)\s+(\S+)\s+(\S+)/;
  const lines = data.trim().split('\n');
  const result: ProcessInfo[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    const matches = line.match(regex);

    if (matches && matches.length === 12) {
      const processInfo: ProcessInfo = {
        PID: parseInt(matches[1], 10),
        PPID: parseInt(matches[2], 10),
        ImageFileName: matches[3],
        Threads: parseInt(matches[6], 10),
        Handles: parseInt(matches[5], 10),
        SessionId: parseInt(matches[7], 10),
        Wow64: matches[8] === 'True',
        CreateTime: matches[9],
        ExitTime: matches[10] !== 'N/A' ? matches[10] : null
      };
      result.push(processInfo);
    }
  }

  return result;
}
