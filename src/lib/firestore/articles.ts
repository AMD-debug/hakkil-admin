import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Article } from '../../types/article';
import type { ArticleInput } from '../../schemas/article.schema';

const COLLECTION = 'articles';

export async function getArticle(id: string): Promise<Article | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Article;
}

export async function createArticle(input: ArticleInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    // publishedAt fixé à la première publication.
    publishedAt: input.published ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
  wasPublished: boolean,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...input,
    // On (re)fixe publishedAt seulement au passage de brouillon → publié.
    ...(input.published && !wasPublished
      ? { publishedAt: serverTimestamp() }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
