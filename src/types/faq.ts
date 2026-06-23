import type { Timestamp } from 'firebase/firestore';
import type { LocalizedText } from './service';

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
  order: number;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
