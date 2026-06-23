import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deleteOffre, updateOffre } from '../../lib/firestore/offres';
import type { Offre } from '../../types/offre';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

export default function OffresListPage() {
  const { data: offres, loading } = useCollection<Offre>('offres', [
    orderBy('order', 'asc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Offre | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteOffre(toDelete.id);
      showToast('Offre supprimée');
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function togglePublish(o: Offre) {
    try {
      await updateOffre(o.id, { published: !o.published });
      showToast(o.published ? 'Offre dépubliée' : 'Offre publiée');
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Offres / Packs</h1>
        <Link to="/offres/new">
          <Button>
            <Plus size={16} />
            Nouvelle offre
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pack (FR)</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Ordre</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-body">
                  Chargement…
                </td>
              </tr>
            )}
            {!loading && offres.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-body">
                  Aucune offre.
                </td>
              </tr>
            )}
            {offres.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ink">
                  <span className="inline-flex items-center gap-1.5">
                    {o.highlighted && (
                      <Star size={14} className="fill-brand text-brand" />
                    )}
                    {o.title.fr}
                  </span>
                </td>
                <td className="px-4 py-3 text-body">{o.price}</td>
                <td className="px-4 py-3 text-body">{o.order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      o.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {o.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title={o.published ? 'Dépublier' : 'Publier'}
                      onClick={() => togglePublish(o)}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      {o.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link
                      to={`/offres/${o.id}/edit`}
                      title="Modifier"
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Supprimer"
                      onClick={() => setToDelete(o)}
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
        title="Supprimer l'offre"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.title.fr} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
