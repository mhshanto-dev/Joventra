import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Payment } from '../../types';
import { formatRelativeDate } from '../../lib/utils';
import { 
  CreditCard, 
  DollarSign, 
  Search, 
  Filter, 
  Receipt, 
  ShieldCheck, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<{
    data: Payment[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    metrics: { totalRevenue: number; transactionCount: number };
  }>({
    queryKey: ['admin-payments', { search, status, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (status !== 'All') params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', '10');

      const res = await apiClient.get(`/admin/payments?${params.toString()}`);
      return res.data;
    },
  });

  const payments = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  const metrics = data?.metrics || { totalRevenue: 0, transactionCount: 0 };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Revenue & Auditing</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payments & Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time Stripe billing receipts, transaction logs, and platform revenue monitoring.
          </p>
        </div>
      </div>

      {/* Revenue Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">${metrics.totalRevenue || 0}</p>
            <p className="text-xs text-slate-500 font-medium">Total Gross Revenue</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{pagination.total}</p>
            <p className="text-xs text-slate-500 font-medium">Completed Transactions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">Stripe Gateway</p>
            <p className="text-xs text-slate-500 font-medium">Webhook Status: Healthy</p>
          </div>
        </div>
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {['All', 'succeeded', 'failed', 'pending'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatus(st); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  status === st
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No transaction records found matching this status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-4 px-6">User / Account</th>
                  <th className="py-4 px-6">Plan Tier</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {payments.map((p) => {
                  const user = typeof p.userId === 'object' ? p.userId : null;

                  return (
                    <tr key={p._id || p.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* User */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{user?.name || 'Customer'}</p>
                            <p className="text-[11px] text-slate-400">{user?.email || 'user@example.com'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-6 font-bold text-slate-900 uppercase">
                        {p.plan}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        ${p.amount} {p.currency}
                      </td>

                      {/* Transaction ID */}
                      <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                        {p.transactionId}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-slate-500 text-right">
                        {formatRelativeDate(p.paidAt)}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
