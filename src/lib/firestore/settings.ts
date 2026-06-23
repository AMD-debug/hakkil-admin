import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { SiteSettings } from '../../types/settings';

// Document unique des paramètres du site : settings/contact
const ref = () => doc(db, 'settings', 'contact');

export async function getSettings(): Promise<SiteSettings> {
  const snap = await getDoc(ref());
  return snap.exists() ? (snap.data() as SiteSettings) : {};
}

export async function saveSettings(data: SiteSettings): Promise<void> {
  await setDoc(
    ref(),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
