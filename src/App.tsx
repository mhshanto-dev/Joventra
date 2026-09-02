import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { PublicLayout } from './components/layout/PublicLayout';
import { PublicOnlyRoute } from './components/shared/PublicOnlyRoute';
import { HomePage } from './pages/public/HomePage';
import { BrowseJobsPage } from './pages/public/BrowseJobsPage';
import { JobDetailsPage } from './pages/public/JobDetailsPage';
import { CompaniesPage } from './pages/public/CompaniesPage';
import { CompanyProfilePage } from './pages/public/CompanyProfilePage';
import { PricingPage } from './pages/public/PricingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

export default function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<BrowseJobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:id" element={<CompanyProfilePage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>

      {/* Auth Pages (Only accessible when not logged in) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-slate-600">404 Not Found</div>} />
    </Routes>
  );
}
