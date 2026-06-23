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
import type { Partenaire } from '../../types/partenaire';
import type { PartenaireInput } from '../../schemas/partenaire.schema';

const COLLECTION = 'partenaires';

export async function getPartenaire(id: string): Promise<Partenaire | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Partenaire;
}

export async function createPartenaire(
  input: PartenaireInput,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePartenaire(
  id: string,
  input: PartenaireInput,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePartenaire(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
