"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, ExternalLink, Music2, Sparkles } from 'lucide-react';
import { 
  SpotifyIcon, 
  AppleMusicIcon, 
  AmazonMusicIcon 
} from '@/components/icons/SocialIcons';
import { SongList } from './SongList';

export function ReleaseDetail({ release, onClose }) {
  const { title, type, coverArt, releaseDate, description, tracklist, spotifyUrl, appleMusicUrl, bandcampUrl, purchaseUrl, isFeatured } = release;

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const streamingLinks = [
    { 
      name: 'Spotify', 
      url: spotifyUrl, 
      icon: SpotifyIcon,
      color: 'hover:bg-[#1DB954] hover:text-white border-[#1DB954]'
    },
    { 
      name: 'Apple Music', 
      url: appleMusicUrl, 
      icon: AppleMusicIcon,
      color: 'hover:bg-[#FC3C44] hover:text-white border-[#FC3C44]'
    },
    { 
      name: 'Bandcamp', 
      url: bandcampUrl, 
      icon: AmazonMusicIcon,
      color: 'hover:bg-[#2489cc] hover:text-white border-[#2489cc]'
    },
  ].filter(link => link.url);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-brand-black rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Cover Art */}
              <div className="md:w-1/3">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-xl">
                  {coverArt ? (
                    <img
                      src={coverArt}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-orange/10 to-brand-gold/10">
                      <Music2 className="h-20 w-20 text-brand-orange/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="md:w-2/3">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-orange/20 text-brand-orange">
                    {type}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {isFeatured && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-gold to-brand-orange text-brand-black flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-orange mb-3">
                  {title}
                </h2>

                {description && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {description}
                  </p>
                )}

                {/* Streaming Links with Platform Icons */}
                {streamingLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {streamingLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 flex items-center gap-2 text-sm hover:scale-105 ${link.color}`}
                        >
                          <Icon className="h-4 w-4" />
                          {link.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      );
                    })}
                  </div>
                )}

                {purchaseUrl && (
                  <a
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mb-6 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black font-semibold hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 hover:scale-105"
                  >
                    Buy Now
                  </a>
                )}

                {/* Tracklist */}
                {tracklist && tracklist.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold font-heading mb-3 text-brand-gold">
                      Tracklist
                    </h3>
                    <SongList songs={tracklist} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}