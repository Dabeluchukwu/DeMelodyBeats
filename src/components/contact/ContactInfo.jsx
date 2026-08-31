"use client";

import { Mail, MapPin, Music2, Clock, Sparkles } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT, BRAND } from '@/lib/constants';
import { 
  YouTubeIcon, 
  InstagramIcon, 
  FacebookIcon 
} from '@/components/icons/SocialIcons';
import { motion } from 'framer-motion';

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-brand-black/50 dark:to-brand-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-brand-orange/10">
            <Music2 className="h-6 w-6 text-brand-orange" />
          </div>
          <span className="font-heading text-xl font-bold">
            De <span className="text-brand-orange">Melody</span> Beats
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {BRAND.description}
        </p>
        <p className="text-brand-gold text-sm mt-3 font-heading italic">
          "{BRAND.slogan}"
        </p>
      </motion.div>

      {/* Contact Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-brand-black/50 dark:to-brand-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4 w-4 text-brand-orange" />
          <h3 className="text-lg font-bold font-heading text-brand-orange">
            Get in Touch
          </h3>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 group">
            <div className="p-2 rounded-xl bg-brand-gold/10 group-hover:bg-brand-orange/20 transition-colors">
              <Mail className="h-5 w-5 text-brand-gold group-hover:text-brand-orange transition-colors" />
            </div>
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
          <li className="flex items-start gap-3 group">
            <div className="p-2 rounded-xl bg-brand-gold/10 group-hover:bg-brand-orange/20 transition-colors">
              <MapPin className="h-5 w-5 text-brand-gold group-hover:text-brand-orange transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{CONTACT.location}</p>
            </div>
          </li>
          <li className="flex items-start gap-3 group">
            <div className="p-2 rounded-xl bg-brand-gold/10 group-hover:bg-brand-orange/20 transition-colors">
              <Clock className="h-5 w-5 text-brand-gold group-hover:text-brand-orange transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Time</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Within 24-48 hours</p>
            </div>
          </li>
        </ul>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-brand-black/50 dark:to-brand-black/30 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-brand-orange" />
          <h3 className="text-lg font-bold font-heading text-brand-orange">
            Follow Us
          </h3>
        </div>
        <div className="flex gap-3">
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/20 hover:scale-110"
            aria-label="YouTube"
          >
            <YouTubeIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/20 hover:scale-110"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-orange hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/20 hover:scale-110"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}