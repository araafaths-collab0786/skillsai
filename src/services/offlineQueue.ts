/**
 * SkillLens AI - Offline-First Capture Queue Engine
 * Strictly implements Section 6A using IndexedDB (idb) with exponential backoff & idempotent sync
 */
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { OfflineQueueItem, IntakeMethod } from '@/packages/shared/src/types';

interface SkillLensDB extends DBSchema {
  captureQueue: {
    key: string;
    value: OfflineQueueItem;
    indexes: { 'by-state': string; 'by-timestamp': number };
  };
}

const DB_NAME = 'skilllens-offline-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SkillLensDB>> | null = null;

function getDB(): Promise<IDBPDatabase<SkillLensDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SkillLensDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('captureQueue')) {
          const store = db.createObjectStore('captureQueue', { keyPath: 'id' });
          store.createIndex('by-state', 'state');
          store.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Enqueues a captured document locally
 */
export async function enqueueCapture(params: {
  intakeMethod: IntakeMethod;
  blobDataUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  cropCorners?: Array<{ x: number; y: number }>;
}): Promise<OfflineQueueItem> {
  const db = await getDB();
  const id = generateUUID();
  const submissionId = generateUUID();

  const item: OfflineQueueItem = {
    id,
    submissionId,
    intakeMethod: params.intakeMethod,
    blobDataUrl: params.blobDataUrl,
    fileName: params.fileName,
    fileSize: params.fileSize,
    mimeType: params.mimeType,
    cropCorners: params.cropCorners,
    timestamp: Date.now(),
    state: navigator.onLine ? 'queued' : 'captured',
    retryCount: 0,
  };

  await db.put('captureQueue', item);
  return item;
}

/**
 * Retrieves all items in the capture queue
 */
export async function getQueueItems(): Promise<OfflineQueueItem[]> {
  const db = await getDB();
  return db.getAllFromIndex('captureQueue', 'by-timestamp');
}

/**
 * Deletes an item from the local queue and removes its image blob
 */
export async function deleteQueueItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('captureQueue', id);
}

/**
 * Updates item state and sync results
 */
export async function updateQueueItem(
  id: string,
  updates: Partial<OfflineQueueItem>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get('captureQueue', id);
  if (existing) {
    await db.put('captureQueue', { ...existing, ...updates });
  }
}

/**
 * Calculates exponential backoff delay in ms
 */
export function getBackoffDelayMs(retryCount: number): number {
  const intervals = [5000, 15000, 45000, 90000, 180000];
  return intervals[Math.min(retryCount, intervals.length - 1)];
}
