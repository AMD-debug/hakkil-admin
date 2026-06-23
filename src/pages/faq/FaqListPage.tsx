import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deleteFaq, updateFaq } from '../../lib/firestore/faq';
import type { FaqItem } from '../../types/faq';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

export default function FaqListPage() {
  const { data: items, loading } = useCollection<FaqItem>('faq', [
    orderBy('order', 'asc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<FaqItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteFaq(toDelete.id);
      showToast('Question supprimée');
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function togglePublish(f: FaqItem) {
    try {
      await updateFaq(f.id, { published: !f.published });
      showToast(f.published ? 'Dépubliée' : 'Publiée');
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">FAQ</h1>
        <Link to="/faq/new">
          <Button>
            <Plus size={16} />
            Nouvelle question
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Question (FR)</th>
              <th className="px-4 py-3 font-medium">Ordre</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-body">
                  Chargement…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-body">
                  Aucune question.
                </td>
              </tr>
            )}
            {items.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ink">
                  {f.question.fr}
                </td>
                <td className="px-4 py-3 text-body">{f.order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {f.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title={f.published ? 'Dépublier' : 'Publier'}
                      onClick={() => togglePublish(f)}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      {f.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link
                      to={`/faq/${f.id}/edit`}
                      title="Modifier"
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Supprimer"
                      onClick={() => setToDelete(f)}
                      className="rounded p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer la question"
        message={`Supprimer « ${toDelete?.question.fr} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
