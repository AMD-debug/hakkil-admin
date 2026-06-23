import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ServicesListPage from './pages/services/ServicesListPage';
import ServiceFormPage from './pages/services/ServiceFormPage';
import RealisationsListPage from './pages/realisations/RealisationsListPage';
import RealisationFormPage from './pages/realisations/RealisationFormPage';
import ArticlesListPage from './pages/articles/ArticlesListPage';
import ArticleFormPage from './pages/articles/ArticleFormPage';
import EquipeListPage from './pages/equipe/EquipeListPage';
import MembreFormPage from './pages/equipe/MembreFormPage';
import TemoignagesListPage from './pages/temoignages/TemoignagesListPage';
import TemoignageFormPage from './pages/temoignages/TemoignageFormPage';
import MessagesListPage from './pages/messages/MessagesListPage';
import OffresListPage from './pages/offres/OffresListPage';
import OffreFormPage from './pages/offres/OffreFormPage';
import PartenairesListPage from './pages/partenaires/PartenairesListPage';
import PartenaireFormPage from './pages/partenaires/PartenaireFormPage';
import FaqListPage from './pages/faq/FaqListPage';
import FaqFormPage from './pages/faq/FaqFormPage';
import NewsletterListPage from './pages/newsletter/NewsletterListPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/services" element={<ServicesListPage />} />
        <Route path="/services/new" element={<ServiceFormPage />} />
        <Route path="/services/:id/edit" element={<ServiceFormPage />} />
        <Route path="/realisations" element={<RealisationsListPage />} />
        <Route path="/realisations/new" element={<RealisationFormPage />} />
        <Route
          path="/realisations/:id/edit"
          element={<RealisationFormPage />}
        />
        <Route path="/articles" element={<ArticlesListPage />} />
        <Route path="/articles/new" element={<ArticleFormPage />} />
        <Route path="/articles/:id/edit" element={<ArticleFormPage />} />
        <Route path="/equipe" element={<EquipeListPage />} />
        <Route path="/equipe/new" element={<MembreFormPage />} />
        <Route path="/equipe/:id/edit" element={<MembreFormPage />} />
        <Route path="/temoignages" element={<TemoignagesListPage />} />
        <Route path="/temoignages/new" element={<TemoignageFormPage />} />
        <Route path="/temoignages/:id/edit" element={<TemoignageFormPage />} />
        <Route path="/messages" element={<MessagesListPage />} />
        <Route path="/offres" element={<OffresListPage />} />
        <Route path="/offres/new" element={<OffreFormPage />} />
        <Route path="/offres/:id/edit" element={<OffreFormPage />} />
        <Route path="/partenaires" element={<PartenairesListPage />} />
        <Route path="/partenaires/new" element={<PartenaireFormPage />} />
        <Route path="/partenaires/:id/edit" element={<PartenaireFormPage />} />
        <Route path="/faq" element={<FaqListPage />} />
        <Route path="/faq/new" element={<FaqFormPage />} />
        <Route path="/faq/:id/edit" element={<FaqFormPage />} />
        <Route path="/newsletter" element={<NewsletterListPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
