import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import {
  Wrench,
  FolderKanban,
  Newspaper,
  Users,
  MessageSquareQuote,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { useCollection } from '../hooks/useCollection';
import type { Service } from '../types/service';
import type { Realisation } from '../types/realisation';
import type { Article } from '../types/article';
import type { Membre } from '../types/membre';
import type { Temoignage } from '../types/temoignage';
import type { Message } from '../types/message';

function StatCard({
  to,
  icon: Icon,
  count,
  label,
}: {
  to: string;
  icon: LucideIcon;
  count: number;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-2xl font-bold text-ink">{count}</p>
          <p className="text-sm text-body">{label}</p>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const byDate = [orderBy('createdAt', 'desc')];
  const { data: services } = useCollection<Service>('services', [
    orderBy('order', 'asc'),
  ]);
  const { data: realisations } = useCollection<Realisation>(
    'realisations',
    byDate,
  );
  const { data: articles } = useCollection<Article>('articles', byDate);
  const { data: equipe } = useCollection<Membre>('equipe', [
    orderBy('order', 'asc'),
  ]);
  const { data: temoignages } = useCollection<Temoignage>(
    'temoignages',
    byDate,
  );
  const { data: messages } = useCollection<Message>('messages', byDate);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-body">
        Bienvenue dans l'administration de Hakkil Digital.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          to="/services"
          icon={Wrench}
          count={services.length}
          label="Services"
        />
        <StatCard
          to="/realisations"
          icon={FolderKanban}
          count={realisations.length}
          label="Réalisations"
        />
        <StatCard
          to="/articles"
          icon={Newspaper}
          count={articles.length}
          label="Articles"
        />
        <StatCard
          to="/equipe"
          icon={Users}
          count={equipe.length}
          label="Membres d'équipe"
        />
        <StatCard
          to="/temoignages"
          icon={MessageSquareQuote}
          count={temoignages.length}
          label="Témoignages"
        />
        <StatCard
          to="/messages"
          icon={Mail}
          count={messages.length}
          label={unread > 0 ? `Messages (${unread} non lus)` : 'Messages'}
        />
      </div>
    </div>
  );
}
