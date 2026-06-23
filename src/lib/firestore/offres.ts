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
import type { Offre } from '../../types/offre';
import type { OffreInput } from '../../schemas/offre.schema';

const COLLECTION = 'offres';

export async function getOffre(id: string): Promise<Offre | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Offre;
}

export async function createOffre(input: OffreInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOffre(
  id: string,
  input: Partial<OffreInput>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOffre(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
