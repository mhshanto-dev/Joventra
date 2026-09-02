import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Globe, 
  Zap, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology & Engineering',
  'Design & Creative',
  'Sales & Marketing',
  'Finance & Accounting',
  'Customer Support',
  'Product & Operations',
  'Human Resources',
  'Healthcare'
];

export const SeekerJobsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isRemote, setIsRemote] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const { data: usageData, refetch: refetchUsage } = useQuery({
    queryKey: ['seeker-usage'],
    queryFn: async () => {
      const res = await apiClient.get('/seeker/plan-usage');
      return res.data.data;
    },
  });

  const { data, isLoading, refetch: refetchJobs } = useQuery<{
    data: Job[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ['seeker-jobs-search', { search, category, isRemote, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category !== 'All') params.append('category', category);
      if (isRemote) params.append('isRemote', 'true');
      params.append('page', page.toString());
      params.append('limit', '8');

      const response = await apiClient.get(`/jobs?${params.toString()}`);
      return response.data;
    },
  });

  const jobs = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 8, total: 0, totalPages: 1 };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner with Quota Usage Alert */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Opportunity Search</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse & Apply to Open Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit applications directly to verified hiring managers with one click.
          </p>
        </div>

        {usageData && (
          <div className="p-4 rounded-2xl bg-brand-50/80 border border-brand-100 flex items-center gap-4 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-950">
                Plan: <span className="text-brand-700">{usageData.plan}</span>
              </p>
              <p className="text-[11px] text-brand-800">
                Monthly Applications Used: <strong>{usageData.applicationsUsedThisMonth}</strong> / <strong>{usageData.maxApplicationsPerMonth}</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search & Filter Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, role, or keywords..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="text-xs font-semibold py-2.5 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full sm:w-auto"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => { setIsRemote(!isRemote); setPage(1); }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isRemote
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Remote Only
            </button>
          </div>

        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-56 bg-slate-200/70 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-800">No active positions match your criteria</p>
          <p className="text-xs text-slate-500">Try clearing keyword filters or adjusting category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                page === p
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page >= pagination.totalPages}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onApplied={() => {
            refetchUsage();
            refetchJobs();
          }}
        />
      )}

    </div>
  );
};
