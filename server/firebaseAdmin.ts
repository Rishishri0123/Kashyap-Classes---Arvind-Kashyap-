import fs from 'fs';
import path from 'path';
import type express from 'express';
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

interface AppletFirebaseConfig {
  projectId: string;
  firestoreDatabaseId?: string;
}

function loadAppletFirebaseConfig(): AppletFirebaseConfig {
  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as AppletFirebaseConfig;
  }
  return {
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
    firestoreDatabaseId:
      process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID,
  };
}

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

export function getFirebaseAdminApp(): App {
  if (cachedApp) return cachedApp;

  const config = loadAppletFirebaseConfig();
  const projectId = config.projectId || process.env.FIREBASE_PROJECT_ID || undefined;

  if (getApps().length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (serviceAccountJson) {
    const parsed = JSON.parse(serviceAccountJson);
    cachedApp = initializeApp({
      credential: cert(parsed),
      projectId: parsed.project_id || projectId,
    });
    return cachedApp;
  }

  cachedApp = initializeApp(projectId ? { projectId } : undefined);
  return cachedApp;
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb(): Firestore {
  if (cachedDb) return cachedDb;
  const app = getFirebaseAdminApp();
  const config = loadAppletFirebaseConfig();
  const dbId = config.firestoreDatabaseId?.trim();

  cachedDb = dbId && dbId !== '(default)' ? getFirestore(app, dbId) : getFirestore(app);
  return cachedDb;
}

export async function verifyBearerToken(req: express.Request): Promise<DecodedIdToken> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Missing Authorization Bearer token. Please sign in first.');
    (err as Error & { statusCode?: number }).statusCode = 401;
    throw err;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    const err = new Error('Empty Firebase ID token.');
    (err as Error & { statusCode?: number }).statusCode = 401;
    throw err;
  }

  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    const err = new Error('Invalid or expired Firebase session. Please sign in again.');
    (err as Error & { statusCode?: number }).statusCode = 401;
    throw err;
  }
}

export async function isAdminDecodedToken(decoded: DecodedIdToken): Promise<boolean> {
  const defaultEmails = ['rishishrivastav16@gmail.com'];
  const envEmails = (process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmails = new Set([...defaultEmails, ...envEmails]);

  const envUids = new Set(
    (process.env.ADMIN_UIDS || '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)
  );

  if (envUids.has(decoded.uid)) return true;
  if (decoded.email && decoded.email_verified && allowedEmails.has(decoded.email.toLowerCase())) {
    return true;
  }

  try {
    const adminSnap = await getAdminDb().collection('admins').doc(decoded.uid).get();
    return adminSnap.exists;
  } catch {
    return false;
  }
}

export function extractErrorMessage(err: unknown): { status: number; message: string } {
  const e = err as { statusCode?: number; code?: number | string; message?: string };
  if (e?.statusCode) {
    return { status: e.statusCode, message: e.message || 'Request failed' };
  }
  const msg = e?.message || String(err);
  if (e?.code === 7 || msg.includes('PERMISSION_DENIED')) {
    return {
      status: 503,
      message:
        'Server Firestore Admin SDK lacks IAM permissions (PERMISSION_DENIED). Configure FIREBASE_SERVICE_ACCOUNT_JSON or grant Cloud Datastore User role on your Firebase project.',
    };
  }
  return { status: 500, message: msg || 'Internal server error' };
}
