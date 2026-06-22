import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deleteArticle } from '../../lib/firestore/articles';
import type { Article } from '../../types/article';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

export default function ArticlesListPage() {
  const { data: items, loading } = useCollection<Article>('articles', [
    orderBy('createdAt', 'desc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteArticle(toDelete.id);
      showToast('Article supprimé');
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
        <h1 className="text-2xl font-bold text-ink">Articles</h1>
        <Link to="/articles/new">
          <Button>
            <Plus size={16} />
            Nouvel article
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Titre (FR)</th>
              <th className="px-4 py-3 font-medium">Auteur</th>
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
                  Aucun article.
                </td>
              </tr>
            )}
            {items.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ink">{a.title.fr}</td>
                <td className="px-4 py-3 text-body">{a.author}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      a.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {a.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/articles/${a.id}/edit`}
                      title="Modifier"
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Supprimer"
                      onClick={() => setToDelete(a)}
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
        title="Supprimer l'article"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.title.fr} » ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
