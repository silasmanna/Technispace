/**
 * Firestore CRUD helpers for Technispace
 * Falls back silently when Firebase is not configured.
 */
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from './firebase';

// ── helpers ──────────────────────────────────────────────────────────────────

function guard() {
  return isConfigured && db !== null;
}

// ── PROPERTIES ────────────────────────────────────────────────────────────────

export async function saveProperty(propertyData) {
  if (!guard()) return null;
  const ref = await addDoc(collection(db, 'properties'), {
    ...propertyData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProperty(propertyId, updates) {
  if (!guard()) return;
  await updateDoc(doc(db, 'properties', propertyId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePropertyDoc(propertyId) {
  if (!guard()) return;
  await deleteDoc(doc(db, 'properties', propertyId));
}

export async function fetchProperties(filters = {}) {
  if (!guard()) return null;
  let q = collection(db, 'properties');
  if (filters.landlordId) {
    q = query(q, where('landlordId', '==', filters.landlordId));
  }
  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchPropertyById(id) {
  if (!guard()) return null;
  const snap = await getDoc(doc(db, 'properties', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── USERS ────────────────────────────────────────────────────────────────────

export async function saveUser(userId, userData) {
  if (!guard()) return;
  await updateDoc(doc(db, 'users', userId), {
    ...userData,
    updatedAt: serverTimestamp(),
  }).catch(async () => {
    // Document may not exist yet — use setDoc equivalent via updateDoc fallback
    const { setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function fetchUser(userId) {
  if (!guard()) return null;
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── INQUIRIES ─────────────────────────────────────────────────────────────────

export async function saveInquiry(data) {
  if (!guard()) return null;
  const ref = await addDoc(collection(db, 'inquiries'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchInquiries(filters = {}) {
  if (!guard()) return null;
  let q = collection(db, 'inquiries');
  if (filters.landlordId) {
    q = query(q, where('landlordId', '==', filters.landlordId));
  }
  if (filters.tenantId) {
    q = query(q, where('tenantId', '==', filters.tenantId));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
