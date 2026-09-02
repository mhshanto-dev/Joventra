import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { formatSalary, formatRelativeDate } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  Bookmark, 
  Trash2, 
  Send, 
  Building2, 
  MapPin, 
  DollarSign, 
  ExternalLink,
  Search
} from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const { data: savedJobs = [], isLoading, refetch } = useQuery<Job[]>({
    queryKey: ['seeker-saved-jobs'],
    queryFn: async () => {
      const response = await apiClient.get('/saved-jobs');
      return response.data.data || [];
    },
  });

  const handleRemove = async (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await apiClient.delete(`/saved-jobs/unsave/${jobId}`);
      toast.success('Job removed from saved bookmarks');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove job');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Bookmarked Opportunities</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Jobs ({savedJobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review your bookmarked opportunities and apply whenever you're ready.
          </p>
        </div>

        <Link
          to="/dashboard/seeker/jobs"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          Find More Jobs
        </Link>
      </div>

      {/* Saved Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-slate-200/70 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved jobs yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Bookmark interesting roles from the job search to review and compare them later.
          </p>
          <Link
            to="/dashboard/seeker/jobs"
            className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm hover:bg-brand-700"
          >
            Browse Available Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => {
            const company = typeof job.companyId === 'object' ? job.companyId : null;

            return (
              <div
                key={job._id || job.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-500/40 p-5 sm:p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {company?.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">{company?.name || 'Verified Company'}</span>
                    <Link
                      to={`/jobs/${job._id || job.id}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors block line-clamp-1"
                    >
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location?.city ? `${job.location.city}, ${job.location.country}` : 'Remote'}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">
                        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                      <span>•</span>
                      <span className="text-brand-600 font-medium">{job.jobType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                  <button
                    onClick={(e) => handleRemove(job._id || job.id, e)}
                    className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/jobs/${job._id || job.id}`}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => setSelectedJobForApply(job)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onApplied={() => refetch()}
        />
      )}

    </div>
  );
};
