import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Payment } from '../../types';
import { formatRelativeDate } from '../../lib/utils';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Sparkles, 
  Zap, 
  Check, 
  Clock, 
  ShieldCheck, 
  Receipt,
  ArrowUpRight
} from 'lucide-react';

export const SeekerBillingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: subData, refetch: refetchSub, isLoading: isSubLoading } = useQuery({
    queryKey: ['seeker-subscription'],
    queryFn: async () => {
      const res = await apiClient.get('/payments/subscription');
      return res.data.data;
    },
  });

  const { data: payments = [], refetch: refetchPayments, isLoading: isPaymentsLoading } = useQuery<Payment[]>({
    queryKey: ['seeker-payment-history'],
    queryFn: async () => {
      const res = await apiClient.get('/payments/history');
      return res.data.data || [];
    },
  });

  // Handle return from Stripe or simulated checkout
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const plan = searchParams.get('plan');
      if (plan) {
        apiClient.post('/payments/activate-plan', { planId: plan })
          .then(() => {
            toast.success(`Plan upgraded successfully! Welcome to ${plan.toUpperCase()} tier.`);
            refetchSub();
            refetchPayments();
          })
          .catch(() => {});
      } else {
        toast.success('Payment completed successfully!');
        refetchSub();
        refetchPayments();
      }
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleUpgrade = async (planId: string) => {
    try {
      const response = await apiClient.post('/payments/create-checkout', { planId });
      if (response.data.success && response.data.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate checkout');
    }
  };

  const subscription = subData?.subscription;
  const currentPlan = subscription?.planType || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Free Tier',
      price: '$0',
      period: 'forever',
      features: ['Up to 3 applications / month', 'Save up to 10 jobs', 'Standard email alerts'],
    },
    {
      id: 'pro',
      name: 'Pro Tier',
      price: '$19',
      period: 'month',
      highlight: true,
      features: ['Up to 30 applications / month', 'Unlimited saved bookmarks', 'Application tracking', 'Salary insights'],
    },
    {
      id: 'premium',
      name: 'Premium Tier',
      price: '$39',
      period: 'month',
      features: ['Unlimited applications', 'Unlimited saved bookmarks', 'Profile boost to recruiters', 'Early job access', 'Priority support'],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Account Billing & Quotas</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Subscription & Applications Plan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your monthly application quota and review subscription transactions.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Current Active Plan</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Active Status
            </span>
          </div>

          <h2 className="text-3xl font-extrabold capitalize tracking-tight">
            {currentPlan} Plan
          </h2>

          <p className="text-xs text-slate-300">
            Monthly Applications Used: <strong>{subscription?.applicationsUsedThisMonth || 0}</strong> {currentPlan === 'free' ? '/ 3 allowed' : currentPlan === 'pro' ? '/ 30 allowed' : '(Unlimited)'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1.5 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Billing Cycle:</span>
            <span className="font-bold text-white">Monthly</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Next Quota Reset:</span>
            <span className="font-bold text-white">
              {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'Next Month'}
            </span>
          </div>
        </div>
      </div>

      {/* Available Plans Upgrade Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Available Plans & Upgrades</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlan.toLowerCase() === p.id;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                  p.highlight ? 'border-brand-500 shadow-md shadow-brand-500/10' : 'border-slate-200/90 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-base">{p.name}</h4>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-extrabold border border-brand-200">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                    <span className="text-xs text-slate-500 font-semibold">/{p.period}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleUpgrade(p.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : p.highlight
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                  {!isCurrent && <ArrowUpRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-600" />
            Payment & Invoice History
          </h3>
          <span className="text-xs text-slate-500">{payments.length} Transactions</span>
        </div>

        {isPaymentsLoading ? (
          <div className="space-y-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No payment records found. You are currently using the free tier.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {payments.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500">
                      {formatRelativeDate(p.paidAt)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.plan}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${p.amount} {p.currency}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{p.transactionId}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
