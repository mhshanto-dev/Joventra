import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeDate } from '../../lib/utils';
import { 
  Users, 
  Building2, 
  Briefcase, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export const AdminHomePage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/stats');
      return res.data.data;
    },
  });

  const { data: userGrowth = [] } = useQuery({
    queryKey: ['admin-user-growth'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/analytics/user-growth');
      return res.data.data || [];
    },
  });

  const { data: categoryStats = [] } = useQuery({
    queryKey: ['admin-category-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/analytics/categories');
      return res.data.data || [];
    },
  });

  const { data: pendingCompanies = [] } = useQuery({
    queryKey: ['admin-pending-companies'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/companies?status=pending&limit=5');
      return res.data.data || [];
    },
  });

  const stats = statsData || {
    totalUsers: 0,
    totalCompanies: 0,
    pendingCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalRevenue: 0,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Superadmin Console</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Operations & Metrics 🛡️
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Monitor platform health, verify pending companies, moderate job posts, and track subscription revenues.
          </p>
        </div>

        {stats.pendingCompanies > 0 && (
          <Link
            to="/dashboard/admin/companies"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            {stats.pendingCompanies} Pending Approvals
          </Link>
        )}
      </div>

      {/* 1. Admin Top Stats Row (5 Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">{stats.totalUsers}</p>
            <p className="text-[11px] text-slate-500 font-medium">Total Users</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">{stats.totalCompanies}</p>
            <p className="text-[11px] text-slate-500 font-medium">Organizations</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">{stats.totalJobs}</p>
            <p className="text-[11px] text-slate-500 font-medium">Published Jobs</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">{stats.totalApplications}</p>
            <p className="text-[11px] text-slate-500 font-medium">Applications</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-3.5 col-span-2 lg:col-span-1">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">${stats.totalRevenue}</p>
            <p className="text-[11px] text-slate-500 font-medium">Total Revenue</p>
          </div>
        </div>

      </div>

      {/* 2. Recharts Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* User Growth Line/Area Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              30-Day Platform User Growth
            </h3>
            <span className="text-xs text-slate-500 font-medium">New Registrations</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-3">
            {userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
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
                  <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrowthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No user growth records in this timeframe.
              </div>
            )}
          </div>
        </div>

        {/* Job Postings by Category Bar Chart */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" />
              Job Postings by Category
            </h3>
            <span className="text-xs text-slate-500 font-medium">Industry Distribution</span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-3">
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 9, fill: '#64748b' }} angle={-20} textAnchor="end" />
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
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No category breakdown records available.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Pending Company Approvals Queue */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Building2 className="w-5 h-5 text-brand-600" />
            Organizations Awaiting Verification
          </div>
          <Link
            to="/dashboard/admin/companies"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            Review All Companies <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingCompanies.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            All submitted companies are reviewed and up to date.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 space-y-1">
            {pendingCompanies.map((comp: any) => (
              <div key={comp._id || comp.id} className="pt-3 pb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{comp.name}</h4>
                    <p className="text-[11px] text-slate-500">{comp.industry} • Registered {formatRelativeDate(comp.createdAt)}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard/admin/companies"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex-shrink-0"
                >
                  Review Application
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
