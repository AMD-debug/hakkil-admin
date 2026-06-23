import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Demande la republication du site vitrine : écrit un drapeau dans
 * `settings/publish`. Une GitHub Action vérifie ce drapeau et rebuild+redéploie
 * le site (lecture du contenu au build). Réservé aux admins (règles Firestore).
 */
export async function requestPublish(): Promise<void> {
  await setDoc(doc(db, 'settings', 'publish'), {
    requestedAt: serverTimestamp(),
    by: auth.currentUser?.email ?? null,
  });
}
