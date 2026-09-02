import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { PublicOnlyRoute } from './components/shared/PublicOnlyRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { BrowseJobsPage } from './pages/public/BrowseJobsPage';
import { JobDetailsPage } from './pages/public/JobDetailsPage';
import { CompaniesPage } from './pages/public/CompaniesPage';
import { CompanyProfilePage } from './pages/public/CompanyProfilePage';
import { PricingPage } from './pages/public/PricingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Seeker Pages
import { SeekerHomePage } from './pages/seeker/SeekerHomePage';
import { SeekerJobsPage } from './pages/seeker/SeekerJobsPage';
import { SavedJobsPage } from './pages/seeker/SavedJobsPage';

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

      {/* Auth Pages */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Seeker Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['seeker']} />}>
        <Route path="/dashboard/seeker" element={<DashboardLayout />}>
          <Route index element={<SeekerHomePage />} />
          <Route path="jobs" element={<SeekerJobsPage />} />
          <Route path="saved" element={<SavedJobsPage />} />
          <Route path="applications" element={<div className="p-8 text-center text-slate-500 font-bold">Seeker Applications</div>} />
          <Route path="billing" element={<div className="p-8 text-center text-slate-500 font-bold">Seeker Billing</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-slate-500 font-bold">Seeker Settings</div>} />
        </Route>
      </Route>

      {/* Recruiter Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route path="/dashboard/recruiter" element={<DashboardLayout />}>
          <Route index element={<div className="p-8 text-center text-slate-500 font-bold">Recruiter Home Page</div>} />
          <Route path="company" element={<div className="p-8 text-center text-slate-500 font-bold">My Company</div>} />
          <Route path="jobs" element={<div className="p-8 text-center text-slate-500 font-bold">Manage Jobs</div>} />
          <Route path="jobs/new" element={<div className="p-8 text-center text-slate-500 font-bold">Post a Job</div>} />
          <Route path="jobs/:jobId/applicants" element={<div className="p-8 text-center text-slate-500 font-bold">View Applicants</div>} />
          <Route path="billing" element={<div className="p-8 text-center text-slate-500 font-bold">Recruiter Billing</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-slate-500 font-bold">Recruiter Settings</div>} />
        </Route>
      </Route>

      {/* Admin Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<DashboardLayout />}>
          <Route index element={<div className="p-8 text-center text-slate-500 font-bold">Admin Home Page</div>} />
          <Route path="users" element={<div className="p-8 text-center text-slate-500 font-bold">Manage Users</div>} />
          <Route path="companies" element={<div className="p-8 text-center text-slate-500 font-bold">Manage Companies</div>} />
          <Route path="jobs" element={<div className="p-8 text-center text-slate-500 font-bold">Manage Jobs</div>} />
          <Route path="payments" element={<div className="p-8 text-center text-slate-500 font-bold">Payments & Subscriptions</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-slate-500 font-bold">Admin Settings</div>} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-slate-600">404 Not Found</div>} />
    </Routes>
  );
}
