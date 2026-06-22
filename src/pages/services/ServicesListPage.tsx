import { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { deleteService, updateService } from '../../lib/firestore/services';
import type { Service } from '../../types/service';
import type { ServiceInput } from '../../schemas/service.schema';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

function toInput(s: Service): ServiceInput {
  return {
    title: s.title,
    description: s.description,
    longDescription: s.longDescription,
    icon: s.icon,
    slug: s.slug,
    order: s.order,
    published: s.published,
  };
}

export default function ServicesListPage() {
  const { data: services, loading } = useCollection<Service>('services', [
    orderBy('order', 'asc'),
  ]);
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteService(toDelete.id);
      showToast('Service supprimé');
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  async function togglePublish(s: Service) {
    try {
      await updateService(s.id, { ...toInput(s), published: !s.published });
      showToast(s.published ? 'Service dépublié' : 'Service publié');
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Services</h1>
        <Link to="/services/new">
          <Button>
            <Plus size={16} />
            Nouveau service
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Titre (FR)</th>
              <th className="px-4 py-3 font-medium">Slug</th>
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
            {!loading && services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-body">
                  Aucun service. Créez-en un.
                </td>
              </tr>
            )}
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-ink">{s.title.fr}</td>
                <td className="px-4 py-3 text-body">{s.slug}</td>
                <td className="px-4 py-3 text-body">{s.order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title={s.published ? 'Dépublier' : 'Publier'}
                      onClick={() => togglePublish(s)}
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      {s.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <Link
                      to={`/services/${s.id}/edit`}
                      title="Modifier"
                      className="rounded p-2 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      title="Supprimer"
                      onClick={() => setToDelete(s)}
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
        title="Supprimer le service"
        message={`Voulez-vous vraiment supprimer « ${toDelete?.title.fr} » ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
