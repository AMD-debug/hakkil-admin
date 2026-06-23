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
import type { Realisation } from '../../types/realisation';
import type { RealisationInput } from '../../schemas/realisation.schema';

const COLLECTION = 'realisations';

export async function getRealisation(id: string): Promise<Realisation | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Realisation;
}

export async function createRealisation(
  input: RealisationInput,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateRealisation(
  id: string,
  input: RealisationInput,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRealisation(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
