import { InstagramIcon, TwitterIcon, FacebookIcon } from '@/components/icons/SocialIcons';
import { Music2 } from 'lucide-react';

const socialIcons = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  // Add more social platforms as needed
};

export function MemberCard({ member }) {
  const { name, role, bio, image, socialLinks } = member;

  return (
    <div className="group bg-white dark:bg-brand-black rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300 card-hover">
      {/* Image */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-orange/10">
            <Music2 className="h-12 w-12 text-brand-orange/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold font-heading text-brand-orange">
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
          <div className="mt-3 flex gap-3">
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