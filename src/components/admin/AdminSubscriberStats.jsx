'use client';

import { useSubscriberStats } from '@/hooks/useSubscribers';
import { Loader2, Mail, CheckCircle, XCircle, Users } from 'lucide-react';

function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-brand-black/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange mt-1">
            {value !== undefined && value !== null ? value : '—'}
          </p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function AdminSubscriberStats() {
  const { data: stats, isLoading, error } = useSubscriberStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-brand-black/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const statsData = [
    { title: 'Total Subscribers', value: stats.total || 0, icon: Users, color: 'bg-blue-500' },
    { title: 'Verified', value: stats.verified || 0, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Unverified', value: stats.unverified || 0, icon: XCircle, color: 'bg-yellow-500' },
    { title: 'Total Campaigns', value: stats.totalCampaigns || 0, icon: Mail, color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      {statsData.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}