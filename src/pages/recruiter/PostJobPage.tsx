import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { toast } from 'sonner';
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Building2, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft,
  Globe
} from 'lucide-react';

const CATEGORIES = [
  'Technology & Engineering',
  'Design & Creative',
  'Sales & Marketing',
  'Finance & Accounting',
  'Customer Support',
  'Product & Operations',
  'Human Resources',
  'Healthcare'
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

export const PostJobPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [jobType, setJobType] = useState('Full-time');
  const [isRemote, setIsRemote] = useState(false);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check company status & plan usage
  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['recruiter-company-check'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/companies/my/profile');
        return res.data.data;
      } catch {
        return null;
      }
    },
  });

  const { data: usageData } = useQuery({
    queryKey: ['recruiter-plan-usage'],
    queryFn: async () => {
      const res = await apiClient.get('/recruiter/plan-usage');
      return res.data.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !responsibilities || !requirements) {
      toast.error('Please fill in all mandatory job fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title,
        category,
        jobType,
        isRemote,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        currency,
        location: { city, country },
        responsibilities,
        requirements,
        benefits,
        deadline,
      };

      const res = await apiClient.post('/jobs', payload);
      if (res.data.success) {
        toast.success('Job opportunity published successfully! 🚀');
        navigate('/dashboard/recruiter/jobs');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompanyLoading) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Company Profile Required</h2>
        <p className="text-sm text-slate-500">
          Before creating and publishing open job posts, you must register your company or startup profile.
        </p>
        <Link
          to="/dashboard/recruiter/company"
          className="inline-block px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-600/30"
        >
          Register Company Profile
        </Link>
      </div>
    );
  }

  const isQuotaFull = usageData && usageData.activeJobsCount >= usageData.maxActiveJobs;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Back button */}
      <Link
        to="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Manage Jobs
      </Link>

      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Publish Vacancy</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Post a New Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reach thousands of qualified job seekers with a verified job post under {company.name}.
        </p>
      </div>

      {/* Quota Warning */}
      {isQuotaFull && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Active Job Quota Reached ({usageData.activeJobsCount} / {usageData.maxActiveJobs})</p>
              <p className="opacity-80">Close an existing job post or upgrade your subscription plan to publish more vacancies.</p>
            </div>
          </div>
          <Link
            to="/dashboard/recruiter/billing"
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm flex-shrink-0"
          >
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Job Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600" />
            1. Role Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Job Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer (React / Next.js)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Job Type *</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 pt-1 flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Globe className="w-4 h-4 text-emerald-600" />
                Remote Friendly Position
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Compensation & Location */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            2. Compensation & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Minimum Salary (Annual)</label>
              <input
                type="number"
                placeholder="e.g. 110000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Maximum Salary (Annual)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">City</label>
              <input
                type="text"
                placeholder="e.g. San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Country</label>
              <input
                type="text"
                placeholder="e.g. United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Application Deadline *</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Job Description & Details */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            3. Job Description & Expectations
          </h3>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Core Responsibilities *</label>
              <textarea
                rows={4}
                required
                placeholder="• Architect and maintain high-performance frontend interfaces using React & TypeScript&#10;• Collaborate with backend engineers on RESTful APIs&#10;• Drive code quality, tests, and CI/CD pipelines"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Skills & Requirements *</label>
              <textarea
                rows={4}
                required
                placeholder="• 4+ years of professional experience in React, TypeScript, and modern state management&#10;• Deep understanding of responsive layouts and Tailwind CSS&#10;• Experience with full-stack Node.js / Express is a plus"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Benefits & Perks</label>
              <textarea
                rows={3}
                placeholder="• 100% remote flexibility and home office budget&#10;• Comprehensive health, dental, and vision insurance&#10;• Unlimited PTO & annual learning stipend"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/dashboard/recruiter/jobs"
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting || isQuotaFull}
            className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing Opportunity...' : 'Publish Job Listing'}
          </button>
        </div>

      </form>

    </div>
  );
};
