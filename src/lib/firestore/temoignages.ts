import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Temoignage } from '../../types/temoignage';
import type { TemoignageInput } from '../../schemas/temoignage.schema';

const COLLECTION = 'temoignages';

export async function getTemoignage(id: string): Promise<Temoignage | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Temoignage;
}

export async function createTemoignage(
  input: TemoignageInput,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTemoignage(
  id: string,
  input: Partial<TemoignageInput>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTemoignage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
