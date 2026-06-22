import { useMemo, useState } from 'react';
import { orderBy } from 'firebase/firestore';
import { Mail, MailOpen, Trash2, X } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { setMessageRead, deleteMessage } from '../../lib/firestore/messages';
import type { Message } from '../../types/message';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/toast-context';

function formatDate(ts?: { toDate: () => Date }): string {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function MessagesListPage() {
  const { data, loading } = useCollection<Message>('messages', [
    orderBy('createdAt', 'desc'),
  ]);
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Message | null>(null);
  const [toDelete, setToDelete] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Non-lus en premier.
  const messages = useMemo(
    () => [...data].sort((a, b) => Number(a.read) - Number(b.read)),
    [data],
  );

  async function openMessage(m: Message) {
    setSelected(m);
    if (!m.read) {
      try {
        await setMessageRead(m.id, true);
      } catch {
        /* silencieux */
      }
    }
  }

  async function toggleRead(m: Message) {
    try {
      await setMessageRead(m.id, !m.read);
    } catch {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMessage(toDelete.id);
      showToast('Message supprimé');
      if (selected?.id === toDelete.id) setSelected(null);
      setToDelete(null);
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Messages</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? (
          <p className="px-4 py-8 text-center text-body">Chargement…</p>
        ) : messages.length === 0 ? (
          <p className="px-4 py-8 text-center text-body">Aucun message.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-gray-50 ${
                  m.read ? '' : 'bg-brand/5'
                }`}
                onClick={() => openMessage(m)}
              >
                <span className={m.read ? 'text-gray-300' : 'text-brand'}>
                  {m.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate ${m.read ? 'text-ink' : 'font-semibold text-ink'}`}
                    >
                      {m.name}
                    </p>
                    <span className="shrink-0 text-xs text-body/60">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-body">{m.subject}</p>
                </div>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToDelete(m);
                  }}
                  className="rounded p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Détail */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {selected.subject}
                </h2>
                <p className="text-sm text-body">
                  {selected.name} ·{' '}
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-brand hover:underline"
                  >
                    {selected.email}
                  </a>
                </p>
                <p className="text-xs text-body/60">
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm text-body">
              {selected.message}
            </p>
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <Button variant="secondary" onClick={() => toggleRead(selected)}>
                Marquer comme {selected.read ? 'non lu' : 'lu'}
              </Button>
              <Button variant="danger" onClick={() => setToDelete(selected)}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer le message"
        message={`Supprimer le message de « ${toDelete?.name} » ?`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
