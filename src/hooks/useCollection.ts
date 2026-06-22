import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook générique d'abonnement temps réel à une collection Firestore.
 * Renvoie les documents typés `{ id, ...data }`.
 */
export function useCollection<T>(
  path: string,
  constraints: QueryConstraint[] = [orderBy('order', 'asc')],
): CollectionState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // `loading` démarre à `true` ; `onSnapshot` le repasse à `false`.
    const q = query(collection(db, path), ...constraints);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(constraints)]);

  return { data, loading, error };
}
