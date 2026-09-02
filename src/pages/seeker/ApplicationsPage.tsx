import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Application } from '../../types';
import { formatRelativeDate } from '../../lib/utils';
import { 
  FileText, 
  Building2, 
  Clock, 
  ExternalLink, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const STATUS_FILTERS = [
  'All',
  'applied',
  'under_review',
  'shortlisted',
  'offered',
  'rejected',
];

export const ApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{
    data: Application[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ['seeker-applications', { statusFilter, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await apiClient.get(`/applications/my-applications?${params.toString()}`);
      return response.data;
    },
  });

  const applications = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'offered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Offer Received
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Shortlisted
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Applied
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Candidate Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Applications ({pagination.total})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor real-time progress and interview milestones across all your applications.
          </p>
        </div>

        {/* Filter by status */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-xs font-bold py-2 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="offered">Offered</option>
            <option value="rejected">Declined</option>
          </select>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              You haven't submitted any job applications under this status yet.
            </p>
            <Link
              to="/dashboard/seeker/jobs"
              className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700"
            >
              Search Open Roles
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Job Position</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Date Applied</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => {
                  const job = app.jobId;
                  const company = app.companyId;

                  return (
                    <tr key={app._id || app.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Title */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {job ? (
                          <Link to={`/jobs/${job._id || job.id}`} className="hover:text-brand-600 transition-colors">
                            {job.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400">Position Closed</span>
                        )}
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                          {job?.jobType || 'Full-time'}
                        </span>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {company?.logoUrl ? (
                              <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-700">{company?.name || 'Company'}</span>
                        </div>
                      </td>

                      {/* Date Applied */}
                      <td className="py-4 px-6 text-slate-500">
                        {formatRelativeDate(app.appliedAt)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        {job && (
                          <Link
                            to={`/jobs/${job._id || job.id}`}
                            className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700"
                          >
                            View Job
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
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
