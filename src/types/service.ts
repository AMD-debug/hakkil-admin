import type { Timestamp } from 'firebase/firestore';

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface Service {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  longDescription?: LocalizedText;
  icon: string;
  slug: string;
  order: number;
  published: boolean;
  coverImage?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
