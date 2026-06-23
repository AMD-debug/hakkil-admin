import type { Timestamp } from 'firebase/firestore';

export interface Partenaire {
  id: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
