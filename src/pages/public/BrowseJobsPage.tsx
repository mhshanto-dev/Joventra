import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { Search, SlidersHorizontal, ArrowUpDown, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export const BrowseJobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [isRemote, setIsRemote] = useState(searchParams.get('isRemote') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);
    if (jobType && jobType !== 'All') params.set('jobType', jobType);
    if (location) params.set('location', location);
    if (minSalary) params.set('minSalary', minSalary);
    if (isRemote) params.set('isRemote', 'true');
    if (sort !== 'newest') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    setSearchParams(params, { replace: true });
  }, [search, category, jobType, location, minSalary, isRemote, sort, page]);

  const { data, isLoading } = useQuery<{
    data: Job[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    queryKey: ['jobs', { search, category, jobType, location, minSalary, isRemote, sort, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (jobType && jobType !== 'All') params.append('jobType', jobType);
      if (location) params.append('location', location);
      if (minSalary) params.append('minSalary', minSalary);
      if (isRemote) params.append('isRemote', 'true');
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '9');

      const response = await apiClient.get(`/jobs?${params.toString()}`);
      return response.data;
    },
  });

  const jobs = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 9, total: 0, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setJobType('All');
    setLocation('');
    setMinSalary('');
    setIsRemote(false);
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
            Explore Opportunities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Find verified roles at top companies
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Search thousands of remote and on-site job posts. Direct applications and fast feedback loops.
          </p>
        </div>
      </div>

      {/* Main Layout Grid: Sidebar + Jobs List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <JobFilters
            category={category}
            setCategory={(val) => { setCategory(val); setPage(1); }}
            jobType={jobType}
            setJobType={(val) => { setJobType(val); setPage(1); }}
            location={location}
            setLocation={(val) => { setLocation(val); setPage(1); }}
            minSalary={minSalary}
            setMinSalary={(val) => { setMinSalary(val); setPage(1); }}
            isRemote={isRemote}
            setIsRemote={(val) => { setIsRemote(val); setPage(1); }}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Controls: Search Bar + Sort Dropdown + Mobile Filter Trigger */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by keyword or title..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full text-sm pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="hidden sm:inline font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

            </div>

          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-md animate-fade-in">
              <JobFilters
                category={category}
                setCategory={(val) => { setCategory(val); setPage(1); }}
                jobType={jobType}
                setJobType={(val) => { setJobType(val); setPage(1); }}
                location={location}
                setLocation={(val) => { setLocation(val); setPage(1); }}
                minSalary={minSalary}
                setMinSalary={(val) => { setMinSalary(val); setPage(1); }}
                isRemote={isRemote}
                setIsRemote={(val) => { setIsRemote(val); setPage(1); }}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Results Count Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Showing <strong className="text-slate-900">{jobs.length}</strong> of <strong className="text-slate-900">{pagination.total}</strong> active listings</span>
            {pagination.totalPages > 1 && (
              <span>Page {pagination.page} of {pagination.totalPages}</span>
            )}
          </div>

          {/* Jobs Listing Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 bg-slate-200/70 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching jobs found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try adjusting your search criteria, widening the salary range, or removing active filter tags.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm hover:bg-brand-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
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

        </main>

      </div>

    </div>
  );
};
