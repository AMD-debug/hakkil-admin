import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6">
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
