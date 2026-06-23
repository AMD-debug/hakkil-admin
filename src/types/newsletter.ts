import type { Timestamp } from 'firebase/firestore';

export interface NewsletterEntry {
  id: string;
  email: string;
  createdAt?: Timestamp;
}
