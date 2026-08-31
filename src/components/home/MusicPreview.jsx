"use client";

import Link from "next/link";
import { useReleases } from "@/hooks/useReleases";
import { MUSIC_LINKS } from "@/lib/constants";
import { Headphones, ExternalLink, Loader2, Music2 } from "lucide-react";
import { 
  SpotifyIcon, 
  AppleMusicIcon, 
  AmazonMusicIcon 
} from "@/components/icons/SocialIcons";
import { motion } from "framer-motion";

export function MusicPreview() {
  const { data: releases, isLoading, error } = useReleases();

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-brand-black dark:to-brand-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading music...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-brand-black dark:to-brand-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load music. Please try again later.</p>
        </div>
      </section>
    );
  }

  const hasReleases = releases && releases.length > 0;

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-brand-black dark:to-brand-black/80 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            Listen Now
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Music
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            Listen to our songs on your favorite platform
          </p>
        </motion.div>

        {/* Releases */}
        {hasReleases && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {releases.slice(0, 3).map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-white dark:bg-brand-black/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/5"
                >
                  {release.coverArt && (
                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={release.coverArt}
                        alt={release.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4 text-center">
                    <h3 className="font-heading font-bold text-brand-orange truncate">
                      {release.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {release.type} • {new Date(release.releaseDate).getFullYear()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Music Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <MusicPlatform
            href={MUSIC_LINKS.spotify}
            icon={<SpotifyIcon className="h-12 w-12" />}
            name="Spotify"
            color="group-hover:text-[#1DB954]"
          />
          <MusicPlatform
            href={MUSIC_LINKS.appleMusic}
            icon={<AppleMusicIcon className="h-12 w-12" />}
            name="Apple Music"
            color="group-hover:text-[#FC3C44]"
          />
          <MusicPlatform
            href={MUSIC_LINKS.amazonMusic}
            icon={<AmazonMusicIcon className="h-12 w-12" />}
            name="Amazon Music"
            color="group-hover:text-[#FF9900]"
          />
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/music"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
          >
            <Headphones className="h-4 w-4" />
            View Full Discography
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function MusicPlatform({ href, icon, name, color }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center gap-3 p-8 rounded-2xl bg-white dark:bg-brand-black/50 border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/5 ${color}`}
    >
      <div className="text-gray-400 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="font-semibold text-gray-700 dark:text-gray-300">{name}</span>
      <span className="text-sm text-gray-400 flex items-center gap-1">
        Listen Now <ExternalLink className="h-3 w-3" />
      </span>
    </a>
  );
}