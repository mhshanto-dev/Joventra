import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { ApplyModal } from '../../components/jobs/ApplyModal';
import { useAuthStore } from '../../stores/authStore';
import { formatSalary, formatRelativeDate } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  Bookmark, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: job, isLoading, refetch } = useQuery<Job>({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${jobId}`);
      return response.data.data;
    },
  });

  const { data: similarJobs = [] } = useQuery<Job[]>({
    queryKey: ['similar-jobs', jobId],
    queryFn: async () => {
      if (!job?._id && !job?.id) return [];
      const response = await apiClient.get(`/jobs/similar/${job._id || job.id}`);
      return response.data.data || [];
    },
    enabled: !!job,
  });

  // Check saved status if seeker logged in
  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'seeker' && job) {
      apiClient.get(`/saved-jobs/check/${job._id || job.id}`)
        .then(res => setIsSaved(res.data.isSaved))
        .catch(() => {});
    }
  }, [isAuthenticated, user, job]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm font-medium">Loading opportunity details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-slate-500 text-sm">The opportunity you are looking for has expired or was removed.</p>
        <Link to="/jobs" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs">
          Browse Active Jobs
        </Link>
      </div>
    );
  }

  const company = typeof job.companyId === 'object' ? job.companyId : null;

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.info('Please log in or register to submit your application');
      navigate('/login');
      return;
    }

    if (user?.role !== 'seeker') {
      toast.error('Only job seekers can apply for open positions');
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save jobs');
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await apiClient.delete(`/saved-jobs/unsave/${job._id || job.id}`);
        setIsSaved(false);
        toast.success('Removed from bookmarks');
      } else {
        await apiClient.post(`/saved-jobs/save/${job._id || job.id}`);
        setIsSaved(true);
        toast.success('Saved to bookmarks!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${company?.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all listings
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Link
                  to={`/companies/${company?.slug || company?._id || ''}`}
                  className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
                >
                  {company?.name}
                </Link>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location?.city ? `${job.location.city}, ${job.location.country}` : 'Remote'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Posted {formatRelativeDate(job.createdAt)}
                </span>
                <span>•</span>
                <span className="text-brand-600 font-medium">
                  {job.applicationCount || 0} applicants
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2 md:pt-0">
            <button
              onClick={handleBookmarkToggle}
              className={`p-3 rounded-2xl border transition-all ${
                isSaved
                  ? 'bg-brand-50 border-brand-200 text-brand-600'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Job'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-brand-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              title="Share Opportunity"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleApplyClick}
              className="px-7 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              Apply Now
            </button>
          </div>

        </div>

        {/* Highlights Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Compensation</span>
            <p className="text-sm font-extrabold text-slate-900">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Job Type</span>
            <p className="text-sm font-extrabold text-slate-900">{job.jobType}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Workplace</span>
            <p className="text-sm font-extrabold text-slate-900">{job.isRemote ? 'Remote Friendly' : 'On-Site'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Deadline</span>
            <p className="text-sm font-extrabold text-slate-900">{new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Description + Company Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Job Description Sections */}
        <div className="lg:col-span-2 space-y-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          
          {/* Responsibilities */}
          <div className="space-y-3.5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" />
              Role Responsibilities
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {job.responsibilities}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-3.5 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" />
              Required Skills & Experience
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {job.requirements}
            </div>
          </div>

          {/* Benefits */}
          {job.benefits && (
            <div className="space-y-3.5 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                Benefits & Perks
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {job.benefits}
              </div>
            </div>
          )}

          {/* Apply CTA Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Interested in this position?</p>
              <p className="text-xs text-slate-500">Applications are reviewed within 48 hours.</p>
            </div>

            <button
              onClick={handleApplyClick}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Application
            </button>
          </div>

        </div>

        {/* Right Column: Company Sidebar Overview */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {company?.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{company?.name}</h4>
                <p className="text-xs text-slate-500">{company?.industry}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {company?.description || 'A verified innovative company building modern solutions for global customers.'}
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold">{company?.location?.city ? `${company.location.city}, ${company.location.country}` : 'Global'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Company Size:</span>
                <span className="font-semibold">{company?.employeeCount || '10-50'} employees</span>
              </div>
              {company?.website && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Website:</span>
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-brand-600 font-semibold flex items-center gap-1 hover:underline">
                    Visit Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <Link
              to={`/companies/${company?.slug || company?._id || ''}`}
              className="w-full block text-center py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              View Company Profile & Jobs
            </Link>
          </div>
        </aside>

      </div>

      {/* Similar Jobs Recommendation */}
      {similarJobs.length > 0 && (
        <section className="space-y-6 pt-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Similar Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarJobs.map((simJob) => (
              <JobCard key={simJob._id || simJob.id} job={simJob} />
            ))}
          </div>
        </section>
      )}

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onApplied={() => refetch()}
      />

    </div>
  );
};
