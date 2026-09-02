import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Company } from '../../types';
import { toast } from 'sonner';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  AlertCircle,
  ExternalLink,
  PlusCircle
} from 'lucide-react';

const INDUSTRIES = [
  'Technology & Engineering',
  'Fintech',
  'AI',
  'Developer Tools',
  'Design & Creative',
  'Sales & Marketing',
  'Healthcare',
  'E-Commerce',
  'Education',
  'Other'
];

export const MyCompanyPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [employeeCount, setEmployeeCount] = useState('10-50');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: company, isLoading, refetch } = useQuery<Company | null>({
    queryKey: ['recruiter-my-company'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/companies/my/profile');
        return res.data.data;
      } catch {
        return null;
      }
    },
  });

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setIndustry(company.industry || INDUSTRIES[0]);
      setWebsite(company.website || '');
      setDescription(company.description || '');
      setEmployeeCount(company.employeeCount || '10-50');
      setCity(company.location?.city || '');
      setCountry(company.location?.country || '');
      setLogoUrl(company.logoUrl || '');
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !industry || !description) {
      toast.error('Please provide company name, industry, and description');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name,
        industry,
        website,
        description,
        employeeCount,
        location: { city, country },
        logoUrl,
      };

      if (company?._id || company?.id) {
        // Update existing
        await apiClient.put(`/companies/${company._id || company.id}`, payload);
        toast.success('Company profile updated successfully!');
      } else {
        // Register new
        await apiClient.post('/companies', payload);
        toast.success('Company registered successfully! Submitted for admin verification 🚀');
      }

      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save company profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Employer Profile</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Company Profile & Branding
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Showcase your company culture, logo, and verified credentials to attractive candidate talent.
          </p>
        </div>

        {company && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Verification Status Banner (If Company Exists) */}
      {company && (
        <div className={`p-5 rounded-3xl border flex items-center justify-between gap-4 ${
          company.status === 'approved'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : company.status === 'pending'
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-rose-50 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              company.status === 'approved' ? 'bg-emerald-600 text-white' : company.status === 'pending' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Verification Status: {company.status}
              </p>
              <p className="text-xs opacity-80">
                {company.status === 'approved'
                  ? 'Your company is verified and visible on the public Joventra directory.'
                  : company.status === 'pending'
                  ? 'Your registration is under admin review. You can still post jobs!'
                  : 'Your company verification was declined. Please contact support.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Mode vs. Edit / Register Form */}
      {company && !isEditing ? (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
          
          <div className="flex items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <span className="inline-block text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                {company.industry}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">{company.name}</h2>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-semibold"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {company.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Company</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {company.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Location</span>
              <p className="font-bold text-slate-900">
                {company.location?.city ? `${company.location.city}, ${company.location.country}` : 'Global'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-500 font-semibold uppercase text-[10px] block">Company Size</span>
              <p className="font-bold text-slate-900">{company.employeeCount || '10-50'} employees</p>
            </div>
          </div>

        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              {company ? 'Edit Company Information' : 'Register New Company'}
            </h3>

            {company && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Technologies Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Industry Domain *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Website URL</label>
              <input
                type="url"
                placeholder="https://acme.io"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Company Size</label>
              <select
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="1-10">1-10 employees</option>
                <option value="10-50">10-50 employees</option>
                <option value="50-200">50-200 employees</option>
                <option value="200-500">200-500 employees</option>
                <option value="500+">500+ employees</option>
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

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Company Logo Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Company Description & Mission *</label>
              <textarea
                rows={5}
                required
                placeholder="Describe what your company builds, your mission, and what makes working at your organization special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {company && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving Profile...' : company ? 'Update Company Profile' : 'Register Organization'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
