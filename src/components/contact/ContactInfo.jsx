import { Mail, MapPin, Music2 } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT, BRAND } from '@/lib/constants';
import { 
  YouTubeIcon, 
  InstagramIcon, 
  FacebookIcon 
} from '@/components/icons/SocialIcons';

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Brand */}
      <div className="bg-gray-50 dark:bg-brand-black/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <Music2 className="h-6 w-6 text-brand-orange" />
          <span className="font-heading text-xl font-bold">
            De <span className="text-brand-orange">Melody</span> Beats
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {BRAND.description}
        </p>
        <p className="text-brand-gold text-sm mt-2 font-heading">
          "{BRAND.slogan}"
        </p>
      </div>

      {/* Contact Details */}
      <div className="bg-gray-50 dark:bg-brand-black/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold font-heading text-brand-orange mb-4">
          Get in Touch
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
              >
                {CONTACT.email}
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{CONTACT.location}</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Social Links */}
      <div className="bg-gray-50 dark:bg-brand-black/50 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold font-heading text-brand-orange mb-4">
          Follow Us
        </h3>
        <div className="flex gap-4">
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300"
            aria-label="YouTube"
          >
            <YouTubeIcon className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}