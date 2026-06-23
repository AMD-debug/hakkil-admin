import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Les inscrits proviennent du site public ; l'admin ne fait que consulter/supprimer.
export async function deleteNewsletterEntry(id: string): Promise<void> {
  await deleteDoc(doc(db, 'newsletter', id));
}
