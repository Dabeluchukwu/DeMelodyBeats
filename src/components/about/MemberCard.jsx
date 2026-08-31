"use client";

import { InstagramIcon, TwitterIcon, FacebookIcon } from '@/components/icons/SocialIcons';
import { Music2, Sparkles } from 'lucide-react';

const socialIcons = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
};

export function MemberCard({ member }) {
  const { name, role, bio, image, socialLinks } = member;

  return (
    <div className="group bg-white dark:bg-brand-black rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-500 hover:shadow-xl hover:shadow-brand-orange/5 hover:-translate-y-2">
      {/* Image */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-brand-gold/10">
            <Music2 className="h-16 w-16 text-brand-orange/30 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold font-heading text-brand-orange group-hover:text-brand-gold transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
          {role}
        </p>
        {bio && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Social Links */}
        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <div className="mt-3 flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            {Object.entries(socialLinks).map(([platform, url]) => {
              const Icon = socialIcons[platform.toLowerCase()];
              if (!Icon || !url) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-orange transition-colors p-1.5 rounded-full hover:bg-brand-orange/10"
                  aria-label={`${name}'s ${platform}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}