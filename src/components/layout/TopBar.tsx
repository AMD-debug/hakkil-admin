import { useState } from 'react';
import { LogOut, Rocket } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { requestPublish } from '../../lib/firestore/publish';
import { useToast } from '../ui/toast-context';

export function TopBar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [publishing, setPublishing] = useState(false);

  async function onPublish() {
    setPublishing(true);
    try {
      await requestPublish();
      showToast(
        'Publication demandée — le site sera à jour dans quelques minutes.',
      );
    } catch {
      showToast('Erreur lors de la demande de publication', 'error');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6">
      <button
        type="button"
        onClick={onPublish}
        disabled={publishing}
        title="Mettre à jour le site public avec vos derniers changements"
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        <Rocket size={16} />
        {publishing ? 'Publication…' : 'Publier le site'}
      </button>
      <span className="text-sm text-body">{user?.email}</span>
      <button
        type="button"
        onClick={() => logout()}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </header>
  );
}
