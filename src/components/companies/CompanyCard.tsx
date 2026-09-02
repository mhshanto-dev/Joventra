import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../types';
import { Building2, MapPin, Users, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-brand-500/40 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between space-y-6">
      
      {/* Top row: Logo + Industry + Name */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-7 h-7 text-slate-400" />
            )}
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
            {company.industry}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {company.name}
            </h3>
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {company.description || 'Verified organization hiring top industry professionals.'}
          </p>
        </div>
      </div>

      {/* Meta Specs Grid */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{company.location?.city ? `${company.location.city}, ${company.location.country}` : 'Global'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{company.employeeCount || '10-50'} people</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-brand-600" />
            {company.openJobsCount || 0} Open {company.openJobsCount === 1 ? 'Job' : 'Jobs'}
          </span>

          <Link
            to={`/companies/${company.slug || company._id || company.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all"
          >
            Explore
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};
