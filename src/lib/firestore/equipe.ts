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
import type { Membre } from '../../types/membre';
import type { MembreInput } from '../../schemas/membre.schema';

const COLLECTION = 'equipe';

export async function getMembre(id: string): Promise<Membre | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Membre;
}

export async function createMembre(input: MembreInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMembre(
  id: string,
  input: MembreInput,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMembre(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
