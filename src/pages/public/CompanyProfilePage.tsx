import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Company, Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink,
  Briefcase
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ['company', id],
    queryFn: async () => {
      const response = await apiClient.get(`/companies/${id}`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm font-medium">Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Company Not Found</h2>
        <p className="text-slate-500 text-sm">The organization you are looking for does not exist or has not been approved.</p>
        <Link to="/companies" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs">
          Browse Verified Companies
        </Link>
      </div>
    );
  }

  const openJobs = company.openJobs || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Back button */}
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all companies
      </Link>

      {/* Company Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-slate-400" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Employer
                </span>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                  {company.industry}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {company.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {company.location?.city ? `${company.location.city}, ${company.location.country}` : 'Global HQ'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  {company.employeeCount || '10-50'} team members
                </span>
              </div>
            </div>
          </div>

          {/* Website Link Action */}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-300 font-bold text-xs bg-slate-50/50 hover:bg-brand-50/50 transition-all"
            >
              <Globe className="w-4 h-4" />
              Visit Official Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

        </div>
      </div>

      {/* Grid: About + Open Positions */}
      <div className="space-y-12">
        
        {/* About Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            About {company.name}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl whitespace-pre-line">
            {company.description || `${company.name} is a leading organization in the ${company.industry} space, creating impactful software and services for modern global customers.`}
          </p>
        </section>

        {/* Open Job Listings */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-brand-600" />
              Open Positions ({openJobs.length})
            </h2>
          </div>

          {openJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3">
              <p className="text-base font-bold text-slate-800">No active job listings right now</p>
              <p className="text-xs text-slate-500">
                {company.name} does not have any publicly open vacancies at this moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openJobs.map((job) => (
                <JobCard key={job._id || job.id} job={{ ...job, companyId: company }} />
              ))}
            </div>
          )}
        </section>

      </div>

    </div>
  );
};
