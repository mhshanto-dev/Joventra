import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Company } from '../../types';
import { CompanyCard } from '../../components/companies/CompanyCard';
import { Building2, Search, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const INDUSTRY_TABS = [
  'All',
  'Developer Tools',
  'Fintech',
  'AI',
  'E-Commerce',
  'Technology & Engineering',
  'Healthcare',
  'Design & Creative',
];

export const CompaniesPage: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{
    data: Company[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ['companies', { selectedIndustry, search, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedIndustry !== 'All') params.append('industry', selectedIndustry);
      if (search.trim()) params.append('search', search.trim());
      params.append('page', page.toString());
      params.append('limit', '9');

      const response = await apiClient.get(`/companies?${params.toString()}`);
      return response.data;
    },
  });

  const companies = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 9, total: 0, totalPages: 1 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Verified Employers Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Discover top companies hiring right now
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Explore vetted high-growth companies across modern sectors and find the team that matches your culture and ambitions.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>

        {/* Industry Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {INDUSTRY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setSelectedIndustry(tab); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedIndustry === tab
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* Companies Results Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Showing <strong className="text-slate-900">{companies.length}</strong> of <strong className="text-slate-900">{pagination.total}</strong> approved companies</span>
      </div>

      {/* Companies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-200/70 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No companies found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            No approved organizations match your current search query or industry filter.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedIndustry('All'); setPage(1); }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company._id || company.id} company={company} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="pt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                page === p
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page >= pagination.totalPages}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
