import { useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { Trash2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deleteNewsletterEntry } from '../../lib/firestore/newsletter';
import type { NewsletterEntry } from '../../types/newsletter';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

function formatDate(ts?: { toDate: () => Date }): string {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function NewsletterListPage() {
  const { data, loading } = useCollection<NewsletterEntry>('newsletter', [
    orderBy('createdAt', 'desc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<NewsletterEntry | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteNewsletterEntry(toDelete.id);
      showToast('Inscrit supprimé');
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Newsletter</h1>
        <span className="text-sm text-body">{data.length} inscrit(s)</span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Inscrit le</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-body">
                  Chargement…
                </td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-body">
                  Aucun inscrit.
                </td>
              </tr>
            )}
            {data.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ink">{n.email}</td>
                <td className="px-4 py-3 text-body">
                  {formatDate(n.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    title="Supprimer"
                    onClick={() => setToDelete(n)}
                    className="rounded p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer l'inscrit"
        message={`Supprimer « ${toDelete?.email} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
