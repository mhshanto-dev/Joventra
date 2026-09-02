import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeDate } from '../../lib/utils';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  Building2, 
  PlusCircle, 
  BarChart3, 
  ArrowRight, 
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const RecruiterHomePage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ['recruiter-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/recruiter/stats');
      return res.data.data;
    },
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ['recruiter-chart-data'],
    queryFn: async () => {
      const res = await apiClient.get('/recruiter/analytics/applicants');
      return res.data.data || [];
    },
  });

  const { data: recentApplications = [] } = useQuery({
    queryKey: ['recruiter-recent-applications'],
    queryFn: async () => {
      const res = await apiClient.get('/recruiter/recent-applications');
      return res.data.data || [];
    },
  });

  const { data: company } = useQuery({
    queryKey: ['recruiter-company'],
    queryFn: async () => {
      const res = await apiClient.get('/companies/my/profile');
      return res.data.data;
    },
  });

  const stats = statsData || {
    totalJobPosts: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Recruiter Workspace</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name}! 🏢
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Review candidate applications, publish new job vacancies, and manage company verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/dashboard/recruiter/jobs/new"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* 1. Recruiter Stats Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalJobPosts}</p>
            <p className="text-xs text-slate-500 font-medium">Total Job Posts</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.activeJobs}</p>
            <p className="text-xs text-slate-500 font-medium">Active Listings</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.totalApplicants}</p>
            <p className="text-xs text-slate-500 font-medium">Total Applicants</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.closedJobs}</p>
            <p className="text-xs text-slate-500 font-medium">Closed Positions</p>
          </div>
        </div>

      </div>

      {/* 2. Middle Row: Company Card + Recharts Applicant Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Company Status Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-600" /> Organization Profile
              </span>
              <Link
                to="/dashboard/recruiter/company"
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Manage Company
              </Link>
            </div>

            {company ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{company.name}</h3>
                    <p className="text-xs text-slate-500">{company.industry}</p>
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1.5 ${
                      company.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : company.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {company.status === 'approved' ? '✓ Approved' : company.status === 'pending' ? '⏳ Pending Verification' : 'Declined'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {company.description || 'No description added yet.'}
                </p>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">No Company Registered Yet</p>
                <p className="text-[11px] text-slate-500">Register your company profile to start posting jobs.</p>
                <Link
                  to="/dashboard/recruiter/company"
                  className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm"
                >
                  Register Company
                </Link>
              </div>
            )}
          </div>

          {company && (
            <Link
              to="/dashboard/recruiter/company"
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              Edit Company Info
            </Link>
          )}
        </div>

        {/* Recharts Bar Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Applicant Volume by Job Listing
            </h3>
            <span className="text-xs text-slate-500">Last 30 Days</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="title" tick={{ fontSize: 10, fill: '#64748b' }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Bar dataKey="applicants" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs">
                <div>
                  <p className="font-semibold text-slate-600">No applicant metrics available</p>
                  <p>Post a job to begin tracking candidate application volume.</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total candidate flow: <strong className="text-slate-900">{stats.totalApplicants}</strong></span>
            <Link to="/dashboard/recruiter/jobs" className="font-bold text-brand-600 hover:underline">
              Manage Job Posts →
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Recent Applications Feed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Users className="w-5 h-5 text-brand-600" />
            Latest Candidate Submissions
          </div>
          <Link
            to="/dashboard/recruiter/jobs"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            Review by Job Post <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-1">
            <p className="font-semibold text-slate-600">No recent candidate submissions</p>
            <p>New applicants will appear here immediately upon submission.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 space-y-1">
            {recentApplications.map((app: any) => (
              <div key={app._id} className="pt-3 pb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={app.seekerId?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.seekerId?.name}`}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{app.seekerId?.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Applied for <strong className="text-slate-800">{app.jobId?.title}</strong> • {formatRelativeDate(app.appliedAt)}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/dashboard/recruiter/jobs/${app.jobId?._id}/applicants`}
                  className="px-4 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200/60 transition-colors flex-shrink-0"
                >
                  Review Candidate
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
