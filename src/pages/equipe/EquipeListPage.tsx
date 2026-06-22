import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deleteMembre } from '../../lib/firestore/equipe';
import type { Membre } from '../../types/membre';
import { cldThumb } from '../../lib/cloudinary';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

export default function EquipeListPage() {
  const { data: items, loading } = useCollection<Membre>('equipe', [
    orderBy('order', 'asc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Membre | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMembre(toDelete.id);
      showToast('Membre supprimé');
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
        <h1 className="text-2xl font-bold text-ink">Équipe</h1>
        <Link to="/equipe/new">
          <Button>
            <Plus size={16} />
            Nouveau membre
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-body">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-body">Aucun membre.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
            >
              {m.photo ? (
                <img
                  src={cldThumb(m.photo, 128)}
                  alt={m.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{m.name}</p>
                <p className="truncate text-sm text-body">{m.role.fr}</p>
                <p className="text-xs text-body/60">Ordre : {m.order}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  to={`/equipe/${m.id}/edit`}
                  title="Modifier"
                  className="rounded p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => setToDelete(m)}
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
        title="Supprimer le membre"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.name} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
