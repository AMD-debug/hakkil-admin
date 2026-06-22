import type { Timestamp } from 'firebase/firestore';
import type { LocalizedText } from './service';

export interface Membre {
  id: string;
  name: string;
  role: LocalizedText;
  photo: string;
  bio: LocalizedText;
  linkedin?: string;
  github?: string;
  facebook?: string;
  whatsapp?: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
