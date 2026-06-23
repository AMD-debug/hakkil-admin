import type { Timestamp } from 'firebase/firestore';
import type { LocalizedText } from './service';

export interface Article {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText; // HTML riche (TipTap)
  coverImage: string;
  slug: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
