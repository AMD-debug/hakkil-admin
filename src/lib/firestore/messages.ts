import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'messages';

// Les messages sont créés par le formulaire de contact public (pas depuis l'admin).
// Ici on ne gère que la lecture (lu/non-lu) et la suppression.

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
