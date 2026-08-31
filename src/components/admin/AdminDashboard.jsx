'use client';

import { useMe } from '@/hooks/useAuth';
import { useShows } from '@/hooks/useShows';
import { useMembers } from '@/hooks/useMembers';
import { useReleases } from '@/hooks/useReleases';
import { useSubscriberStats } from '@/hooks/useSubscribers';
import { Calendar, Users, Music2, Mail, Loader2 } from 'lucide-react';

function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-brand-black/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange mt-1">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { data: user } = useMe();
  const { data: shows } = useShows();
  const { data: members } = useMembers();
  const { data: releases } = useReleases();
  const { data: stats } = useSubscriberStats();

  const statsData = [
    { title: 'Total Shows', value: shows?.length || 0, icon: Calendar, color: 'bg-brand-orange' },
    { title: 'Total Members', value: members?.length || 0, icon: Users, color: 'bg-brand-gold' },
    { title: 'Total Releases', value: releases?.length || 0, icon: Music2, color: 'bg-purple-500' },
    { title: 'Subscribers', value: stats?.total || 0, icon: Mail, color: 'bg-green-500' },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statsData.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-brand-black/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-base sm:text-lg font-bold font-heading text-brand-orange mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <a
            href="/admin/shows/new"
            className="p-3 sm:p-4 text-center rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300"
          >
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange mx-auto mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium">Add Show</span>
          </a>
          <a
            href="/admin/members/new"
            className="p-3 sm:p-4 text-center rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300"
          >
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange mx-auto mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium">Add Member</span>
          </a>
          <a
            href="/admin/releases/new"
            className="p-3 sm:p-4 text-center rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300"
          >
            <Music2 className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange mx-auto mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium">Add Release</span>
          </a>
          <a
            href="/admin/media"
            className="p-3 sm:p-4 text-center rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300"
          >
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-brand-orange mx-auto mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium">Manage Media</span>
          </a>
        </div>
      </div>
    </div>
  );
}