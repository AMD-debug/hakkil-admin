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
import type { FaqItem } from '../../types/faq';
import type { FaqInput } from '../../schemas/faq.schema';

const COLLECTION = 'faq';

export async function getFaq(id: string): Promise<FaqItem | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FaqItem;
}

export async function createFaq(input: FaqInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateFaq(
  id: string,
  input: Partial<FaqInput>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFaq(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
