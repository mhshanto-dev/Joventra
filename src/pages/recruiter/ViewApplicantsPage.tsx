import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Application, Job } from '../../types';
import { formatRelativeDate } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  Users, 
  ArrowLeft, 
  FileText, 
  Download, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Briefcase,
  Mail,
  Filter
} from 'lucide-react';

export const ViewApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [filterStatus, setFilterStatus] = useState('All');

  const { data: job } = useQuery<Job>({
    queryKey: ['recruiter-job-info', jobId],
    queryFn: async () => {
      const res = await apiClient.get(`/jobs/${jobId}`);
      return res.data.data;
    },
  });

  const { data: applicants = [], isLoading, refetch } = useQuery<Application[]>({
    queryKey: ['recruiter-job-applicants', jobId, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus !== 'All') params.append('status', filterStatus);
      const res = await apiClient.get(`/applications/job/${jobId}?${params.toString()}`);
      return res.data.data || [];
    },
  });

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Applicant status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update application status');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Back link */}
      <Link
        to="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Manage Jobs
      </Link>

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Candidate Review</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Applicants for {job?.title || 'Position'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {applicants.length} candidates applied for this opportunity.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold py-2 px-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">All Applicants</option>
            <option value="applied">Applied</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="offered">Offer Extended</option>
            <option value="rejected">Declined</option>
          </select>
        </div>
      </div>

      {/* Applicants List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => <div key={n} className="h-44 bg-slate-200/70 rounded-3xl animate-pulse" />}
        </div>
      ) : applicants.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No applicants found</h3>
          <p className="text-xs text-slate-500">No candidate submissions match this filter query yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => {
            const seeker = app.seekerId;
            const profile = app.seekerProfileId;

            return (
              <div
                key={app._id || app.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5 hover:border-brand-500/40 transition-all"
              >
                {/* Candidate header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={seeker?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${seeker?.name}`}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{seeker?.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {seeker?.email}
                        </span>
                        <span>•</span>
                        <span>Applied {formatRelativeDate(app.appliedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id || app.id, e.target.value)}
                      className={`text-xs font-bold py-2 px-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        app.status === 'offered'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : app.status === 'shortlisted'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'under_review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <option value="applied">Applied</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="offered">Offer Extended</option>
                      <option value="rejected">Declined</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Specs & Bio */}
                <div className="space-y-3 text-xs">
                  {profile?.headline && (
                    <p className="font-semibold text-slate-800">
                      Headline: <span className="font-normal text-slate-600">{profile.headline}</span>
                    </p>
                  )}

                  {profile?.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-slate-600 mr-1">Skills:</span>
                      {profile.skills.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Cover Letter Note:</span>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{app.coverLetter}</p>
                    </div>
                  )}
                </div>

                {/* Resume Download Bar */}
                {profile?.resumeUrl && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Candidate Resume (PDF)
                    </a>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
