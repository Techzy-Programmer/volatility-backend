import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';

// Function to read a chunk of a file
const readFileChunk = (filePath, start, end) => {
  const stream = fs.createReadStream(filePath, { start, end });
  const chunks = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

// Function to create and compress a chunk using JSZip
const createAndCompressChunk = async (chunk, index) => {
  const zip = new JSZip();
  zip.file(`chunk-${index}`, chunk);
  return await zip.generateAsync({ type: 'nodebuffer' });
};

// Function to upload a chunk to the server
const uploadChunk = async (index, name, chunk) => {
  const formData = new FormData();
  formData.append('chunk', chunk, `chunk-${index}.zip`);

  const response = await fetch(`http://127.0.0.1:8282/api/upload-do?id=${index}&name=${name}`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.text();
  console.log(`Chunk ${index} upload response:`, data, response.status);
};

// Function to complete the upload
const completeUpload = async (name) => {
  const response = await fetch(`http://localhost:8282/api/complete-upload?name=${name}`);
  const data = await response.json();
  console.log('Complete upload response:', data);
};

// Main function to read, create, compress, and upload chunks in parallel
const main = async () => {
  const filePath = '../dumps/few-proc-data.mem';
  const fileName = path.basename(filePath);
  const stats = fs.statSync(filePath);
  const chunkSize = Math.ceil(stats.size / 4); // Ensure exactly 4 chunks

  // Create, compress, and upload chunks in parallel
  const uploadPromises = [];

  for (let i = 0; i < 4; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize - 1, stats.size - 1);
    const chunk = await readFileChunk(filePath, start, end);
    const compressedChunk = await createAndCompressChunk(chunk, i);
    uploadPromises.push(uploadChunk(i, fileName, new Blob([compressedChunk], { type: 'application/zip' })));
  }
  
  await Promise.all(uploadPromises);

  // Complete the upload
  await completeUpload(fileName);
};

// Run the main function
main();
