'use client';

import { useMembers } from '@/hooks/useMembers';
import { Loader2, Crown, Music2 } from 'lucide-react';
import { 
  InstagramIcon, 
  TwitterIcon, 
  FacebookIcon 
} from '@/components/icons/SocialIcons';

const socialIcons = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
};

export function FounderSection() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) {
    return (
      <section className="py-16 bg-brand-black/5 dark:bg-brand-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading founder information...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-brand-black/5 dark:bg-brand-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load founder information.</p>
        </div>
      </section>
    );
  }

  // Find founder - you can identify by role containing "Founder" or a specific flag
  // For now, let's assume the first member with "founder" in their role or order: 0
  const founder = members?.find(member => 
    member.role?.toLowerCase().includes('founder') || 
    member.order === 0 ||
    member.isFounder === true
  );

  if (!founder) {
    return null;
  }

  const { name, role, bio, image, socialLinks } = founder;

  return (
    <section className="py-16 bg-brand-black/5 dark:bg-brand-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-brand-gold" />
            <h2 className="text-4xl md:text-5xl font-bold font-heading">
              <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
                Our Founder
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The visionary behind De Melody Beats
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-brand-black rounded-xl overflow-hidden border border-brand-orange/20 shadow-xl shadow-brand-orange/5">
            <div className="flex flex-col md:flex-row gap-8 p-6 md:p-8">
              {/* Founder Image */}
              <div className="md:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 border-2 border-brand-orange/30">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-orange/10">
                      <Music2 className="h-20 w-20 text-brand-orange/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Founder Info */}
              <div className="md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold font-heading text-brand-orange">
                    {name}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/20 text-brand-gold">
                    Founder
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                  {role}
                </p>
                {bio && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {bio}
                  </p>
                )}

                {/* Social Links */}
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                  <div className="mt-4 flex gap-4">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      const Icon = socialIcons[platform.toLowerCase()];
                      if (!Icon || !url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-brand-orange transition-colors"
                          aria-label={`${name}'s ${platform}`}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}