import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Company } from '../../types';
import { formatRelativeDate } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  Globe, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ManageCompaniesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<{
    data: Company[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ['admin-companies', { search, statusFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'All') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '10');

      const res = await apiClient.get(`/admin/companies?${params.toString()}`);
      return res.data;
    },
  });

  const companies = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleUpdateStatus = async (companyId: string, status: 'approved' | 'rejected') => {
    try {
      await apiClient.patch(`/admin/companies/${companyId}/status`, { status });
      toast.success(`Company verification set to ${status.toUpperCase()}! Notification sent to recruiter.`);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update company status');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this organization?')) {
      return;
    }
    try {
      await apiClient.delete(`/admin/companies/${companyId}`);
      toast.success('Company removed');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete company');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Company Moderation</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Companies ({pagination.total})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review employer verification requests, approve verified startups, and maintain the company directory.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No registered companies found matching this status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Industry</th>
                  <th className="py-4 px-6">Location / Size</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Logo & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {c.logoUrl ? (
                            <img src={c.logoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                          {c.website && (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-brand-600 hover:underline flex items-center gap-0.5"
                            >
                              Website <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {c.industry}
                    </td>

                    {/* Location & Size */}
                    <td className="py-4 px-6 text-slate-500">
                      <p className="text-slate-800 font-medium">{c.location?.city ? `${c.location.city}, ${c.location.country}` : 'Global'}</p>
                      <p className="text-[10px]">{c.employeeCount || '10-50'} team members</p>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {c.status === 'approved' ? '✓ Approved' : c.status === 'pending' ? '⏳ Pending' : 'Declined'}
                      </span>
                    </td>

                    {/* Submitted */}
                    <td className="py-4 px-6 text-slate-500">
                      {formatRelativeDate(c.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      {c.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(c._id || c.id, 'approved')}
                          className="p-2 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Approve Company"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {c.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(c._id || c.id, 'rejected')}
                          className="p-2 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Reject Company"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteCompany(c._id || c.id)}
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Company"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
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
