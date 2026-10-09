import type { PrivateFile } from '../types';

// Private files live in IndexedDB (database tx_files) as real Blobs, so they can be
// large and are shown with blob: URLs. localStorage only holds small JSON.
const DB = 'tx_files';
const STORE = 'files';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const s = req.result.createObjectStore(STORE, { keyPath: 'id' });
      s.createIndex('owner', 'owner');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
      }),
  );
}

export const listFiles = (owner: string) =>
  run<PrivateFile[]>('readonly', (s) => s.index('owner').getAll(owner) as IDBRequest<PrivateFile[]>).then((l) => l.sort((a, b) => b.at.localeCompare(a.at)));

export const addFile = (owner: string, f: File) => {
  const rec: PrivateFile = { id: crypto.randomUUID(), owner, name: f.name, type: f.type || 'application/octet-stream', size: f.size, at: new Date().toISOString(), blob: f };
  return run('readwrite', (s) => s.put(rec)).then(() => rec);
};

export const deleteFile = (id: string) => run('readwrite', (s) => s.delete(id));

export function formatSize(n: number): string {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1024 / 1024).toFixed(1) + ' MB';
}
