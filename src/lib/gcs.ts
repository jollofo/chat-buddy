import 'server-only';
import { Storage } from '@google-cloud/storage';

let storage: Storage | null = null;

function getStorage() {
  if (!storage) {
    storage = new Storage({ projectId: process.env.GCP_PROJECT_ID });
  }
  return storage;
}

function getBucket() {
  const name = process.env.GCS_BUCKET;
  if (!name) throw new Error('GCS_BUCKET is not set');
  return getStorage().bucket(name);
}

export async function saveJsonl(path: string, objects: any[]) {
  const bucket = getBucket(); // resolved only when called
  const file = bucket.file(path);
  const stream = file.createWriteStream({ resumable: true, contentType: 'application/json' });
  for (const obj of objects) stream.write(JSON.stringify(obj) + '\n');
  await new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', (err: Error) => reject(err));
    stream.end();
  });
}
