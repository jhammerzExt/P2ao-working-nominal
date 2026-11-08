import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore,
  setLogLevel,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc, 
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
  type Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { signInAnonymously };
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const configObj = firebaseConfig as Record<string, any>;
const dbId = (configObj.firestoreDatabaseId && configObj.firestoreDatabaseId !== '(default)') 
  ? configObj.firestoreDatabaseId 
  : undefined;

// Suppress transient WebChannel transport reconnect warnings in sandbox iframe
try {
  setLogLevel('silent');
} catch (_) {}

// Modern Firestore initialization with forced long polling for instant iframe sandbox connectivity
let dbInstance: any;
try {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, dbId);
} catch (err) {
  try {
    dbInstance = getFirestore(app, dbId);
  } catch (err2) {
    dbInstance = getFirestore(app);
  }
}

export const db = dbInstance;

// Connection test with offline & unprovisioned database awareness (2.5s fast timeout fallback)
export async function testFirestoreConnection() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return;
  }
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 2500));
    await Promise.race([getDoc(doc(db, 'test', 'connection')), timeoutPromise]);
  } catch (error: any) {
    // Local persistent mode active
  }
}
testFirestoreConnection().catch(() => {});

/**
 * Measure live round-trip latency to Cloud Firestore in milliseconds
 */
export async function measureFirestoreLatency(): Promise<{ connected: boolean; latencyMs: number; error?: string }> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { connected: false, latencyMs: 0, error: 'Device Offline' };
  }
  
  const start = performance.now();
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 2500));
    await Promise.race([getDoc(doc(db, 'test', 'connection')), timeoutPromise]);
    const latencyMs = Math.max(1, Math.round(performance.now() - start));
    return { connected: true, latencyMs };
  } catch (error: any) {
    const latencyMs = Math.max(1, Math.round(performance.now() - start));
    return { connected: false, latencyMs, error: 'Local Persistent Mode' };
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Notice: ', JSON.stringify(errInfo));
}

export { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  type User,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
  doc
};
