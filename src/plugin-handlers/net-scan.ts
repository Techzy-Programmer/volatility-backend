interface ConnectionInfo {
  Proto: string;
  LocalAddr: string;
  LocalPort: number;
  ForeignAddr: string;
  ForeignPort: number;
  State: string;
  Created: string;
}

export function parseNetScan(data: string): ConnectionInfo[] {
  const lines = data.trim().split('\n');
  const headers = lines[0].trim().split(/\s+/);
  const result: ConnectionInfo[] = [];
  headers.shift();

  const regex = /^0x([0-9a-f]+)\s+(UDPv4|UDPv6|TCPv4|TCPv6)\s+(\S+)\s+(\d+)\s+([\d.:*]+)\s+(\d+)\s+(\S+)\s+(\S+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{6})$/;

  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(regex);
    if (!match) continue;

    const connectionInfo: ConnectionInfo = {
      ForeignPort: parseInt(match[6]),
      LocalPort: parseInt(match[4]),
      ForeignAddr: match[5],
      State: match[7] || '',
      LocalAddr: match[3],
      Proto: match[2],
      Created: match[9]
    };

    result.push(connectionInfo);
  }

  return result;
}
