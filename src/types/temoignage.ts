import type { Timestamp } from 'firebase/firestore';
import type { LocalizedText } from './service';

export interface Temoignage {
  id: string;
  clientName: string;
  company?: string;
  content: LocalizedText;
  rating: number; // 1 à 5
  approved: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
