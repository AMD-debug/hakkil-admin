import { Link } from 'react-router-dom';
import { orderBy } from 'firebase/firestore';
import { Wrench, FolderKanban, Newspaper } from 'lucide-react';
import { useCollection } from '../hooks/useCollection';
import type { Service } from '../types/service';
import type { Realisation } from '../types/realisation';
import type { Article } from '../types/article';

export default function DashboardPage() {
  const { data: services } = useCollection<Service>('services', [
    orderBy('order', 'asc'),
  ]);
  const { data: realisations } = useCollection<Realisation>('realisations', [
    orderBy('createdAt', 'desc'),
  ]);
  const { data: articles } = useCollection<Article>('articles', [
    orderBy('createdAt', 'desc'),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-body">
        Bienvenue dans l'administration de Hakkil Digital.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/services"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Wrench size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-ink">{services.length}</p>
              <p className="text-sm text-body">Services</p>
            </div>
          </div>
        </Link>

        <Link
          to="/realisations"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <FolderKanban size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-ink">
                {realisations.length}
              </p>
              <p className="text-sm text-body">Réalisations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/articles"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Newspaper size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-ink">{articles.length}</p>
              <p className="text-sm text-body">Articles</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
