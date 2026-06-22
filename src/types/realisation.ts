import type { Timestamp } from 'firebase/firestore';
import type { LocalizedText } from './service';

export interface Realisation {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  images: string[];
  coverImage: string;
  slug: string;
  clientName?: string;
  liveUrl?: string;
  tags: string[];
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
