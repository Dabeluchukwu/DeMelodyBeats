"use client";

import { motion } from 'framer-motion';
import { Calendar, Music2, ExternalLink, Sparkles } from 'lucide-react';
import { 
  SpotifyIcon, 
  AppleMusicIcon, 
  AmazonMusicIcon 
} from '@/components/icons/SocialIcons';

export function ReleaseCard({ release, onClick, isSelected }) {
  const { title, type, coverArt, releaseDate, spotifyUrl, appleMusicUrl, bandcampUrl } = release;

  const streamingLinks = [
    { 
      name: 'Spotify', 
      url: spotifyUrl, 
      icon: SpotifyIcon,
      color: 'hover:text-[#1DB954]' 
    },
    { 
      name: 'Apple Music', 
      url: appleMusicUrl, 
      icon: AppleMusicIcon,
      color: 'hover:text-[#FC3C44]' 
    },
    { 
      name: 'Bandcamp', 
      url: bandcampUrl, 
      icon: AmazonMusicIcon,
      color: 'hover:text-[#2489cc]' 
    },
  ].filter(link => link.url);

  const typeColors = {
    SINGLE: 'bg-brand-orange/20 text-brand-orange',
    EP: 'bg-brand-gold/20 text-brand-gold',
    ALBUM: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white dark:bg-brand-black/50 rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer
        ${isSelected ? 'border-brand-orange shadow-2xl shadow-brand-orange/30' : 'border-gray-200 dark:border-gray-800 hover:border-brand-orange hover:shadow-xl hover:shadow-brand-orange/10'}
      `}
      onClick={onClick}
    >
      {/* Cover Art */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        {coverArt ? (
          <img
            src={coverArt}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-brand-gold/10">
            <Music2 className="h-16 w-16 text-brand-orange/30 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        
        {/* Type Badge */}
        <span className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm ${typeColors[type] || 'bg-gray-500/20 text-gray-400'}`}>
          {type}
        </span>

        {/* Featured Badge */}
        {release.isFeatured && (
          <span className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-gold to-brand-orange text-brand-black backdrop-blur-sm flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
        )}

        {/* Click to view overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-sm px-6 py-2.5 bg-brand-orange rounded-xl transition-all duration-300 hover:scale-105">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold font-heading text-brand-orange group-hover:text-brand-gold transition-colors truncate">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
          <Calendar className="h-3 w-3" />
          {new Date(releaseDate).getFullYear()}
        </p>

        {/* Streaming Links with Platform Icons */}
        {streamingLinks.length > 0 && (
          <div className="mt-4 flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
            {streamingLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${link.color} transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Listen on ${link.name}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}