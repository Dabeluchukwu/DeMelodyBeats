'use client';

import Link from 'next/link';
import { useMember } from '@/hooks/useMembers';
import { Loader2, ArrowLeft, Edit, User, Music2, Crown } from 'lucide-react';
import { 
  InstagramIcon, 
  TwitterIcon, 
  FacebookIcon, 
  YouTubeIcon 
} from '@/components/icons/SocialIcons';

const socialIcons = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
};

export function AdminMemberDetail({ memberId }) {
  const { data: member, isLoading, error } = useMember(memberId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Member not found</p>
        <Link href="/admin/members" className="text-brand-orange hover:text-brand-gold transition-colors mt-4 inline-block">
          ← Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/members"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">{member.name}</h1>
        {member.isFounder && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/20 text-brand-gold">
            <Crown className="h-3 w-3" />
            Founder
          </span>
        )}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          member.isActive 
            ? 'bg-green-500/20 text-green-500' 
            : 'bg-gray-500/20 text-gray-500'
        }`}>
          {member.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-48 flex-shrink-0">
            {member.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.image}
                alt={member.name}
                className="w-full aspect-square rounded-lg object-cover border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                onError={(e) => {
                  e.target.src = '';
                  e.target.alt = 'Image failed to load';
                }}
              />
            ) : (
              <div className="w-full aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <User className="h-20 w-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-lg font-medium">{member.role}</p>
            </div>

            {member.bio && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Social Links */}
            {member.socialLinks && Object.keys(member.socialLinks).length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Social Links</p>
                <div className="flex gap-4 mt-2">
                  {Object.entries(member.socialLinks).map(([platform, url]) => {
                    const Icon = socialIcons[platform.toLowerCase()];
                    if (!Icon || !url) return null;
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-brand-orange transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-400">Display Order</p>
                <p className="text-sm font-medium">{member.order}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className={`text-sm font-medium ${member.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-sm text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p>Created: {new Date(member.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(member.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href={`/admin/members/${member.id}/edit`}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
        >
          <Edit className="h-4 w-4" />
          Edit Member
        </Link>
      </div>
    </div>
  );
}