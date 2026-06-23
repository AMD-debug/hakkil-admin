import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import {
  deleteRealisation,
  updateRealisation,
} from '../../lib/firestore/realisations';
import type { Realisation } from '../../types/realisation';
import type { RealisationInput } from '../../schemas/realisation.schema';
import { cldThumb } from '../../lib/cloudinary';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

function toInput(r: Realisation): RealisationInput {
  return {
    title: r.title,
    description: r.description,
    category: r.category,
    slug: r.slug,
    images: r.images,
    coverImage: r.coverImage,
    clientName: r.clientName,
    liveUrl: r.liveUrl ?? '',
    tags: r.tags,
    published: r.published,
  };
}

export default function RealisationsListPage() {
  const { data: items, loading } = useCollection<Realisation>('realisations', [
    orderBy('createdAt', 'desc'),
  ]);
  const { showToast } = useToast();
  const [category, setCategory] = useState('');
  const [toDelete, setToDelete] = useState<Realisation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items],
  );
  const filtered = category
    ? items.filter((i) => i.category === category)
    : items;

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteRealisation(toDelete.id);
      showToast('Réalisation supprimée');
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function togglePublish(r: Realisation) {
    try {
      await updateRealisation(r.id, { ...toInput(r), published: !r.published });
      showToast(r.published ? 'Dépubliée' : 'Publiée');
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink">Réalisations</h1>
        <div className="flex items-center gap-3">
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <Link to="/realisations/new">
            <Button>
              <Plus size={16} />
              Nouvelle réalisation
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Aperçu</th>
              <th className="px-4 py-3 font-medium">Titre (FR)</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
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
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-body">
                  Aucune réalisation.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  {r.coverImage ? (
                    <img
                      src={cldThumb(r.coverImage, 80)}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-100" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{r.title.fr}</td>
                <td className="px-4 py-3 text-body">{r.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {r.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title={r.published ? 'Dépublier' : 'Publier'}
                      onClick={() => togglePublish(r)}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      {r.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link
                      to={`/realisations/${r.id}/edit`}
                      title="Modifier"
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Supprimer"
                      onClick={() => setToDelete(r)}
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
        title="Supprimer la réalisation"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.title.fr} » ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
