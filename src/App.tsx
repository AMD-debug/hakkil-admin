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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
