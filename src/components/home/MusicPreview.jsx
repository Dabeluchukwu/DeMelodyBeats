'use client';

import Link from "next/link";
import { useReleases } from "@/hooks/useReleases";
import { MUSIC_LINKS } from "@/lib/constants";
import { Headphones, ExternalLink, Loader2 } from "lucide-react";
import { 
  SpotifyIcon, 
  AppleMusicIcon, 
  AmazonMusicIcon 
} from "@/components/icons/SocialIcons";

export function MusicPreview() {
  const { data: releases, isLoading, error } = useReleases();

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading music...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load music. Please try again later.</p>
        </div>
      </section>
    );
  }

  const hasReleases = releases && releases.length > 0;

  return (
    <section className="py-16 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Music
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Listen to our songs on your favorite platform
          </p>
        </div>

        {hasReleases && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {releases.slice(0, 3).map((release) => (
                <div
                  key={release.id}
                  className="bg-gray-50 dark:bg-brand-black/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center hover:border-brand-orange transition-all duration-300"
                >
                  {release.coverArt && (
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-200 dark:bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={release.coverArt}
                        alt={release.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-heading font-bold text-brand-orange">
                    {release.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {release.type} • {new Date(release.releaseDate).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <MusicPlatform
            href={MUSIC_LINKS.spotify}
            icon={<SpotifyIcon className="h-10 w-10" />}
            name="Spotify"
            color="hover:text-[#1DB954]"
          />
          <MusicPlatform
            href={MUSIC_LINKS.appleMusic}
            icon={<AppleMusicIcon className="h-10 w-10" />}
            name="Apple Music"
            color="hover:text-[#FC3C44]"
          />
          <MusicPlatform
            href={MUSIC_LINKS.amazonMusic}
            icon={<AmazonMusicIcon className="h-10 w-10" />}
            name="Amazon Music"
            color="hover:text-[#FF9900]"
          />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/music"
            className="text-brand-orange hover:text-brand-gold transition-colors font-medium inline-flex items-center gap-2"
          >
            <Headphones className="h-4 w-4" />
            View Full Discography →
          </Link>
        </div>
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
      className={`flex flex-col items-center gap-3 p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300 hover:shadow-lg ${color}`}
    >
      <div className="h-12 w-12 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-semibold">{name}</span>
      <span className="text-sm text-gray-400 flex items-center gap-1">
        Listen Now <ExternalLink className="h-3 w-3" />
      </span>
    </a>
  );
}