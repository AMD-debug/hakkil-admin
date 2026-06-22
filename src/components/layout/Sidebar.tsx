import { NavLink } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  Newspaper,
  Users,
  MessageSquareQuote,
  Mail,
  Images,
} from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import type { Message } from '../../types/message';

const NAV = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/services', label: 'Services', icon: Wrench },
  { to: '/realisations', label: 'Réalisations', icon: FolderKanban },
  { to: '/articles', label: 'Articles', icon: Newspaper },
  { to: '/equipe', label: 'Équipe', icon: Users },
  { to: '/temoignages', label: 'Témoignages', icon: MessageSquareQuote },
  { to: '/messages', label: 'Messages', icon: Mail },
  { to: '/medias', label: 'Médias', icon: Images },
];

export function Sidebar() {
  const { data: messages } = useCollection<Message>('messages', [
    orderBy('createdAt', 'desc'),
  ]);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <span className="text-lg font-bold text-ink">
          Hakkil <span className="text-brand">Admin</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            {to === '/messages' && unread > 0 && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
