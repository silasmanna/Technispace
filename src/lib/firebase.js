import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured (env vars are set)
const isConfigured = Object.values(firebaseConfig).every(
  v => v && !v.includes('your_')
);

let app = null;
let db = null;
let auth = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.warn('[Technispace] Firebase init failed — using local state fallback.', err.message);
  }
} else {
  console.info(
    '[Technispace] Firebase not configured. Add your credentials to .env to enable persistence.\n' +
    'Running in local-state (demo) mode.'
  );
}

export { db, auth, isConfigured };
export default app;
