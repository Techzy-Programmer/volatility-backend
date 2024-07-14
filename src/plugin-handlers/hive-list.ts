interface FileInfo {
  FileFullPath: string;
  FileOutput: string;
  Offset: string;
}

export function parseHiveList(data: string): FileInfo[] {
  const lines = data.trim().split('\n');
  const headers = lines[0].trim().split(/\s+/);

  const result: FileInfo[] = [];

  const regex = /^(0x[0-9a-fA-F]+)\s+(.+?)\s+(.+)$/;

  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(regex);
    if (match) {
      const fileInfo: FileInfo = {
        Offset: match[1],
        FileFullPath: match[2],
        FileOutput: match[3]
      };
      result.push(fileInfo);
    }
  }

  return result;
}
