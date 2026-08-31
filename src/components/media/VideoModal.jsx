'use client';

import { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { YouTubeIcon } from '@/components/icons/SocialIcons';

export function VideoModal({ video, onClose }) {
  const { title, videoId, date, category } = video;

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-brand-orange transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Video Player */}
        <div className="aspect-video rounded-xl overflow-hidden bg-black">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <YouTubeIcon className="h-20 w-20 text-red-500" />
              <p className="text-white ml-4">Video not available</p>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-white">
          <h3 className="text-xl font-bold font-heading">{title}</h3>
          <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {category && (
              <span className="px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange text-xs">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}