import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { formatRelativeDate, formatSalary } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  Briefcase, 
  PlusCircle, 
  Users, 
  Trash2, 
  Power, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle,
  Zap
} from 'lucide-react';

export const ManageJobsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('All');

  const { data: usageData, refetch: refetchUsage } = useQuery({
    queryKey: ['recruiter-plan-usage'],
    queryFn: async () => {
      const res = await apiClient.get('/recruiter/plan-usage');
      return res.data.data;
    },
  });

  const { data: jobs = [], isLoading, refetch: refetchJobs } = useQuery<Job[]>({
    queryKey: ['recruiter-my-jobs', filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus !== 'All') params.append('status', filterStatus);
      const res = await apiClient.get(`/jobs/my-jobs?${params.toString()}`);
      return res.data.data || [];
    },
  });

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await apiClient.patch(`/jobs/${jobId}/status`, { status: newStatus });
      toast.success(`Job post marked as ${newStatus}`);
      refetchJobs();
      refetchUsage();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      return;
    }
    try {
      await apiClient.delete(`/jobs/${jobId}`);
      toast.success('Job listing deleted successfully');
      refetchJobs();
      refetchUsage();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Recruitment Pipeline</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Job Postings ({jobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor active vacancies, toggle listing availability, and review incoming candidate applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {usageData && (
            <div className="px-4 py-2 rounded-2xl bg-brand-50 border border-brand-100 text-xs font-bold text-brand-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" />
              <span>Active Quota: {usageData.activeJobsCount} / {usageData.maxActiveJobs}</span>
            </div>
          )}

          <Link
            to="/dashboard/recruiter/jobs/new"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'active', 'closed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st} Listings
          </button>
        ))}
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
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No job posts found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Create your first job listing to start receiving candidate applications.
            </p>
            <Link
              to="/dashboard/recruiter/jobs/new"
              className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm"
            >
              Post a Job Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-6">Category & Type</th>
                  <th className="py-4 px-6">Applicants</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Posted Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id || job.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Title */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link to={`/jobs/${job._id || job.id}`} className="hover:text-brand-600 text-sm">
                        {job.title}
                      </Link>
                      <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">
                        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                    </td>

                    {/* Category & Type */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800">{job.category}</span>
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                        {job.jobType} {job.isRemote && '• Remote'}
                      </span>
                    </td>

                    {/* Applicants */}
                    <td className="py-4 px-6">
                      <Link
                        to={`/dashboard/recruiter/jobs/${job._id || job.id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold border border-brand-200/60 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-brand-600" />
                        {job.applicationCount || 0} Candidates
                      </Link>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        job.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                    </td>

                    {/* Posted Date */}
                    <td className="py-4 px-6 text-slate-500">
                      {formatRelativeDate(job.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(job._id || job.id, job.status)}
                        className={`p-2 rounded-xl border transition-colors ${
                          job.status === 'active'
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                        title={job.status === 'active' ? 'Close Listing' : 'Reopen Listing'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id || job.id)}
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Listing"
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
      </div>

    </div>
  );
};
