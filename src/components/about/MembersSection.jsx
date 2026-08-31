'use client';

import { useMembers } from '@/hooks/useMembers';
import { Loader2 } from 'lucide-react';
import { MemberCard } from './MemberCard';

export function MembersSection() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-brand-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading members...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-brand-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load members. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Filter out the founder (identified by role containing "Founder" or order: 0)
  const teamMembers = members?.filter(member => 
    !member.role?.toLowerCase().includes('founder') && 
    member.order !== 0 &&
    member.isFounder !== true &&
    member.isActive !== false
  ) || [];

  if (teamMembers.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-brand-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Team
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300">More team members coming soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-brand-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Team
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            We are a diverse group of seasoned musicians, comprising of singers, 
            instrumentalists, sound engineers, cinematographers and composers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}