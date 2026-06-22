import { NavLink } from 'react-router-dom';
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
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
