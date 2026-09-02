import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { PublicLayout } from './components/layout/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { BrowseJobsPage } from './pages/public/BrowseJobsPage';

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
        <Route path="/jobs/:jobId" element={<div className="p-8 text-center text-slate-500">Job Details Page</div>} />
        <Route path="/companies" element={<div className="p-8 text-center text-slate-500">Companies Directory Page</div>} />
        <Route path="/companies/:id" element={<div className="p-8 text-center text-slate-500">Company Profile Page</div>} />
        <Route path="/pricing" element={<div className="p-8 text-center text-slate-500">Pricing Page</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-slate-600">404 Not Found</div>} />
    </Routes>
  );
}
