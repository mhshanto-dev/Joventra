import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { useAuthStore } from '../../stores/authStore';
import { formatRelativeDate } from '../../lib/utils';
import { 
  Bookmark, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  User, 
  ArrowRight, 
  Clock, 
  Building2, 
  PieChart as PieIcon,
  Bell,
  Search
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const SeekerHomePage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ['seeker-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/seeker/stats');
      return res.data.data;
    },
  });

  const { data: appStats } = useQuery({
    queryKey: ['seeker-app-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/applications/stats');
      return res.data.data;
    },
  });

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['seeker-recent-activity'],
    queryFn: async () => {
      const res = await apiClient.get('/seeker/recent-activity');
      return res.data.data || [];
    },
  });

  const { data: seekerProfile } = useQuery({
    queryKey: ['seeker-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/users/seeker-profile');
      return res.data.data;
    },
  });

  const stats = statsData || {
    savedJobsCount: 0,
    applicationsSubmitted: 0,
    interviewsScheduled: 0,
    offersReceived: 0,
  };

  const chartData = [
    { name: 'Applied', value: appStats?.applied || 0, color: '#3b82f6' },
    { name: 'Under Review', value: appStats?.under_review || 0, color: '#f59e0b' },
    { name: 'Shortlisted', value: appStats?.shortlisted || 0, color: '#10b981' },
    { name: 'Offered', value: appStats?.offered || 0, color: '#8b5cf6' },
    { name: 'Rejected', value: appStats?.rejected || 0, color: '#f43f5e' },
  ].filter(item => item.value > 0);

  const hasChartData = chartData.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Candidate Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Track your open applications, manage saved jobs, and explore new recommendations.
          </p>
        </div>

        <Link
          to="/dashboard/seeker/jobs"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          Find Jobs
        </Link>
      </div>

      {/* 1. Stats Row (4 Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.savedJobsCount}</p>
            <p className="text-xs text-slate-500 font-medium">Saved Bookmarks</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.applicationsSubmitted}</p>
            <p className="text-xs text-slate-500 font-medium">Applied Jobs</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.interviewsScheduled}</p>
            <p className="text-xs text-slate-500 font-medium">Shortlisted / Interviews</p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{stats.offersReceived}</p>
            <p className="text-xs text-slate-500 font-medium">Job Offers Received</p>
          </div>
        </div>

      </div>

      {/* 2. Middle Row: Candidate Profile Card + Recharts Application Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-600" /> Candidate Profile
              </span>
              <Link
                to="/dashboard/seeker/settings"
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Edit Profile
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover border border-brand-500/20 bg-slate-50"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="inline-block text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100 mt-1">
                  Job Seeker
                </span>
              </div>
            </div>

            {seekerProfile?.headline && (
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{seekerProfile.headline}"
              </p>
            )}

            {seekerProfile?.skills && seekerProfile.skills.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {seekerProfile.skills.slice(0, 6).map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {skill}
                    </span>
                  ))}
                  {seekerProfile.skills.length > 6 && (
                    <span className="text-[11px] text-slate-400 font-medium self-center">
                      +{seekerProfile.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/dashboard/seeker/settings"
            className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            Update Resume & Skills
          </Link>
        </div>

        {/* Recharts Pie Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-600" />
              Application Status Distribution
            </h3>
            <span className="text-xs text-slate-500 font-medium">Real-time ATS Pipeline</span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center pt-2">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center space-y-2 text-slate-400">
                <p className="text-sm font-semibold">No application data yet</p>
                <p className="text-xs">Submit your first job application to see pipeline analytics!</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total submitted: <strong className="text-slate-900">{stats.applicationsSubmitted}</strong></span>
            <Link to="/dashboard/seeker/applications" className="font-bold text-brand-600 hover:underline">
              View Applications Table →
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Recent Activity Feed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Bell className="w-5 h-5 text-brand-600" />
            Recent Activity & Application Alerts
          </div>
          <Link
            to="/dashboard/seeker/applications"
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            All Applications <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-1">
            <p className="font-semibold text-slate-600">No recent notifications</p>
            <p>Apply to jobs to receive status updates here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 space-y-1">
            {recentActivity.map((act: any) => (
              <div key={act.id} className="pt-3 pb-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
                    {act.companyLogo ? (
                      <img src={act.companyLogo} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Building2 className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {act.message}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatRelativeDate(act.date)}
                    </span>
                  </div>
                </div>

                {act.jobId && (
                  <Link
                    to={`/jobs/${act.jobId}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex-shrink-0"
                  >
                    View Job
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
