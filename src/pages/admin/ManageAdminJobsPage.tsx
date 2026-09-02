import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { formatRelativeDate, formatSalary } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Trash2, 
  Power, 
  ExternalLink, 
  Building2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const ManageAdminJobsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<{
    data: Job[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ['admin-manage-jobs', { search, category, status, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category !== 'All') params.append('category', category);
      if (status !== 'All') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', '10');

      const res = await apiClient.get(`/admin/jobs?${params.toString()}`);
      return res.data;
    },
  });

  const jobs = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await apiClient.patch(`/jobs/${jobId}/status`, { status: newStatus });
      toast.success(`Job marked as ${newStatus.toUpperCase()}`);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this job post?')) {
      return;
    }
    try {
      await apiClient.delete(`/admin/jobs/${jobId}`);
      toast.success('Job posting removed from platform');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Job Moderation</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage All Job Listings ({pagination.total})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Moderate job content, close expired vacancies, and maintain clean directory quality.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'active', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => { setStatus(st); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                status === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No job postings found matching this search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Created</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((j) => {
                  const company = typeof j.companyId === 'object' ? j.companyId : null;

                  return (
                    <tr key={j._id || j.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Title */}
                      <td className="py-4 px-6">
                        <Link to={`/jobs/${j._id || j.id}`} className="font-bold text-slate-900 hover:text-brand-600 text-sm">
                          {j.title}
                        </Link>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {formatSalary(j.salaryMin, j.salaryMax, j.currency)} • {j.jobType}
                        </span>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company?.logoUrl ? (
                              <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-700">{company?.name || 'Company'}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {j.category}
                      </td>

                      {/* Applicants */}
                      <td className="py-4 px-6">
                        <span className="inline-block font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-100">
                          {j.applicationCount || 0} applied
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          j.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {j.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="py-4 px-6 text-slate-500">
                        {formatRelativeDate(j.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(j._id || j.id, j.status)}
                          className={`p-2 rounded-xl border transition-colors ${
                            j.status === 'active'
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={j.status === 'active' ? 'Close Job' : 'Reopen Job'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteJob(j._id || j.id)}
                          className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
