import React, { useState } from 'react';
import { Job } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api-client';
import { toast } from 'sonner';
import { X, Send, FileText, Sparkles, Building2, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApplied?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplied,
}) => {
  const { user } = useAuthStore();
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const company = typeof job.companyId === 'object' ? job.companyId : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await apiClient.post(`/applications/apply/${job._id || job.id}`, {
        coverLetter,
      });

      if (response.data.success) {
        toast.success('Application submitted successfully! 🚀');
        if (onApplied) onApplied();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{company?.name}</p>
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Candidate Profile Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Applicant Name:</span>
              <span className="font-bold text-slate-900">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Contact Email:</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
          </div>

          {/* Cover Letter Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              Cover Letter / Note to Recruiter (Optional)
            </label>
            <textarea
              rows={5}
              placeholder="Introduce yourself, explain why you're a strong fit for this position, or highlight your key achievements..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
            />
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              By submitting this application, your profile, resume, and skills will be directly shared with {company?.name || 'the hiring team'}.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Application
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
