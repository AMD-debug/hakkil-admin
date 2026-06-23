import type { Timestamp } from 'firebase/firestore';
import type { LocalizedText } from './service';

export interface Offre {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  price: string; // ex. "500 000 GNF" ou "Sur devis"
  features: { fr: string[]; en: string[] };
  highlighted: boolean; // pack mis en avant
  order: number;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
