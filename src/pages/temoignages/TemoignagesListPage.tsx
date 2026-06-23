import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import {
  deleteTemoignage,
  updateTemoignage,
} from '../../lib/firestore/temoignages';
import type { Temoignage } from '../../types/temoignage';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StarRating } from '../../components/ui/StarRating';
import { useToast } from '../../components/ui/toast-context';

export default function TemoignagesListPage() {
  const { data: items, loading } = useCollection<Temoignage>('temoignages', [
    orderBy('createdAt', 'desc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Temoignage | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTemoignage(toDelete.id);
      showToast('Témoignage supprimé');
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function toggleApprove(t: Temoignage) {
    try {
      await updateTemoignage(t.id, { approved: !t.approved });
      showToast(t.approved ? 'Mis en attente' : 'Approuvé');
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Témoignages</h1>
        <Link to="/temoignages/new">
          <Button>
            <Plus size={16} />
            Nouveau témoignage
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-body">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-body">Aucun témoignage.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink">{t.clientName}</p>
                  {t.company && (
                    <p className="text-sm text-body">{t.company}</p>
                  )}
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {t.approved ? 'Approuvé' : 'En attente'}
                </span>
              </div>
              <StarRating value={t.rating} size={16} />
              <p className="line-clamp-3 text-sm text-body">{t.content.fr}</p>
              <div className="flex items-center justify-end gap-1 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  title={t.approved ? 'Mettre en attente' : 'Approuver'}
                  onClick={() => toggleApprove(t)}
                  className={`rounded p-2 ${
                    t.approved
                      ? 'text-amber-600 hover:bg-amber-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {t.approved ? <X size={16} /> : <Check size={16} />}
                </button>
                <Link
                  to={`/temoignages/${t.id}/edit`}
                  title="Modifier"
                  className="rounded p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => setToDelete(t)}
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
        title="Supprimer le témoignage"
        message={`Voulez-vous vraiment supprimer le témoignage de « ${toDelete?.clientName} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
