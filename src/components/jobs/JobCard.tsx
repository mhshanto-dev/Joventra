import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Job } from '../../types';
import { formatSalary, formatRelativeDate } from '../../lib/utils';
import { MapPin, DollarSign, Clock, Building2, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api-client';
import { toast } from 'sonner';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSaveToggle?: (jobId: string, saved: boolean) => void;
  showApplyButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  onSaveToggle,
  showApplyButton = true,
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [saved, setSaved] = React.useState(isSaved);
  const [saving, setSaving] = React.useState(false);

  const company = typeof job.companyId === 'object' ? job.companyId : null;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please log in as a Job Seeker to bookmark jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'seeker') {
      toast.error('Only job seekers can bookmark opportunities');
      return;
    }

    try {
      setSaving(true);
      if (saved) {
        await apiClient.delete(`/saved-jobs/unsave/${job._id || job.id}`);
        setSaved(false);
        toast.success('Job removed from bookmarks');
        if (onSaveToggle) onSaveToggle(job._id || job.id, false);
      } else {
        await apiClient.post(`/saved-jobs/save/${job._id || job.id}`);
        setSaved(true);
        toast.success('Job saved to your bookmarks!');
        if (onSaveToggle) onSaveToggle(job._id || job.id, true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update saved job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      
      {/* Top row: Company Avatar + Title + Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <Link 
                to={`/companies/${company?.slug || company?._id || ''}`}
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors block"
              >
                {company?.name || 'Verified Company'}
              </Link>
              <Link 
                to={`/jobs/${job._id || job.id}`} 
                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            disabled={saving}
            className={`p-2 rounded-xl transition-all ${
              saved 
                ? 'bg-brand-50 text-brand-600 hover:bg-brand-100' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-600' : ''}`} />
          </button>
        </div>

        {/* Badges / Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
            {job.jobType}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            {job.category}
          </span>
          {job.isRemote && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              Remote
            </span>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {job.location?.city ? `${job.location.city}, ${job.location.country}` : 'Remote / Global'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-semibold text-slate-900 truncate">
              {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Date + Action */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatRelativeDate(job.createdAt)}
        </span>

        {showApplyButton && (
          <Link
            to={`/jobs/${job._id || job.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

    </div>
  );
};
