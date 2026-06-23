import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deletePartenaire } from '../../lib/firestore/partenaires';
import type { Partenaire } from '../../types/partenaire';
import { cldThumb } from '../../lib/cloudinary';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

export default function PartenairesListPage() {
  const { data: items, loading } = useCollection<Partenaire>('partenaires', [
    orderBy('order', 'asc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Partenaire | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deletePartenaire(toDelete.id);
      showToast('Partenaire supprimé');
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
        <h1 className="text-2xl font-bold text-ink">Partenaires / Clients</h1>
        <Link to="/partenaires/new">
          <Button>
            <Plus size={16} />
            Nouveau partenaire
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-body">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-body">Aucun partenaire.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5"
            >
              {p.logo ? (
                <img
                  src={cldThumb(p.logo, 160)}
                  alt={p.name}
                  className="h-16 w-full object-contain"
                />
              ) : (
                <div className="h-16 w-full rounded bg-gray-100" />
              )}
              <p className="truncate text-sm font-medium text-ink">{p.name}</p>
              <div className="flex gap-1">
                <Link
                  to={`/partenaires/${p.id}/edit`}
                  title="Modifier"
                  className="rounded p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => setToDelete(p)}
                  className="rounded p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer le partenaire"
        message={`Supprimer « ${toDelete?.name} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
