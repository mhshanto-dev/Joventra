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
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Seeker Pages
import { SeekerHomePage } from './pages/seeker/SeekerHomePage';
import { SeekerJobsPage } from './pages/seeker/SeekerJobsPage';
import { SavedJobsPage } from './pages/seeker/SavedJobsPage';
import { ApplicationsPage } from './pages/seeker/ApplicationsPage';
import { SeekerBillingPage } from './pages/seeker/SeekerBillingPage';
import { SeekerSettingsPage } from './pages/seeker/SeekerSettingsPage';

// Recruiter Pages
import { RecruiterHomePage } from './pages/recruiter/RecruiterHomePage';
import { MyCompanyPage } from './pages/recruiter/MyCompanyPage';
import { ManageJobsPage } from './pages/recruiter/ManageJobsPage';
import { PostJobPage } from './pages/recruiter/PostJobPage';
import { ViewApplicantsPage } from './pages/recruiter/ViewApplicantsPage';
import { RecruiterBillingPage } from './pages/recruiter/RecruiterBillingPage';
import { RecruiterSettingsPage } from './pages/recruiter/RecruiterSettingsPage';

// Admin Pages
import { AdminHomePage } from './pages/admin/AdminHomePage';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { ManageCompaniesPage } from './pages/admin/ManageCompaniesPage';
import { ManageAdminJobsPage } from './pages/admin/ManageAdminJobsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

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

      {/* Google OAuth callback — must be outside PublicOnlyRoute */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Seeker Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['seeker']} />}>
        <Route path="/dashboard/seeker" element={<DashboardLayout />}>
          <Route index element={<SeekerHomePage />} />
          <Route path="jobs" element={<SeekerJobsPage />} />
          <Route path="saved" element={<SavedJobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="billing" element={<SeekerBillingPage />} />
          <Route path="settings" element={<SeekerSettingsPage />} />
        </Route>
      </Route>

      {/* Recruiter Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route path="/dashboard/recruiter" element={<DashboardLayout />}>
          <Route index element={<RecruiterHomePage />} />
          <Route path="company" element={<MyCompanyPage />} />
          <Route path="jobs" element={<ManageJobsPage />} />
          <Route path="jobs/new" element={<PostJobPage />} />
          <Route path="jobs/:jobId/applicants" element={<ViewApplicantsPage />} />
          <Route path="billing" element={<RecruiterBillingPage />} />
          <Route path="settings" element={<RecruiterSettingsPage />} />
        </Route>
      </Route>

      {/* Admin Dashboard Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<DashboardLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="companies" element={<ManageCompaniesPage />} />
          <Route path="jobs" element={<ManageAdminJobsPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
