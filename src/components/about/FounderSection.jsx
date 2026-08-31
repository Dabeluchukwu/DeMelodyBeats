"use client";

import { useMembers } from '@/hooks/useMembers';
import { Loader2, Crown, Music2, Sparkles, Quote } from 'lucide-react';
import { 
  InstagramIcon, 
  TwitterIcon, 
  FacebookIcon 
} from '@/components/icons/SocialIcons';
import { motion } from 'framer-motion';

const socialIcons = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
};

export function FounderSection() {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-brand-black/5 to-brand-black/10 dark:from-brand-black/20 dark:to-brand-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading founder information...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-brand-black/5 dark:bg-brand-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load founder information.</p>
        </div>
      </section>
    );
  }

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
    <section className="py-24 bg-gradient-to-b from-brand-black/5 to-brand-black/10 dark:from-brand-black/20 dark:to-brand-black/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/20 mb-4">
            <Sparkles className="h-3 w-3" />
            Leadership
          </span>
          <div className="flex items-center justify-center gap-3 mb-4">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white dark:bg-brand-black rounded-2xl overflow-hidden border border-brand-orange/20 shadow-2xl shadow-brand-orange/5 hover:shadow-brand-orange/10 transition-shadow duration-500">
            <div className="flex flex-col md:flex-row gap-8 p-6 md:p-10">
              {/* Founder Image */}
              <div className="md:w-1/3">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 border-2 border-brand-orange/30 relative">
                  {image ? (
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
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/90 text-brand-black backdrop-blur-sm">
                      Founder
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Info */}
              <div className="md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl md:text-4xl font-bold font-heading text-brand-orange">
                    {name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                  {role}
                </p>
                {bio && (
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-brand-gold/20" />
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-6">
                      {bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                {socialLinks && Object.keys(socialLinks).length > 0 && (
                  <div className="mt-6 flex gap-4">
                    {Object.entries(socialLinks).map(([platform, url]) => {
                      const Icon = socialIcons[platform.toLowerCase()];
                      if (!Icon || !url) return null;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-brand-orange transition-colors p-2 rounded-full hover:bg-brand-orange/10"
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
        </motion.div>
      </div>
    </section>
  );
}