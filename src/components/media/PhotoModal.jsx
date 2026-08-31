'use client';

import { useEffect } from 'react';
import { X, Calendar, Image as ImageIcon } from 'lucide-react';

export function PhotoModal({ photo, onClose }) {
  const { title, imageUrl, date, category } = photo;

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
        className="relative max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image */}
        <div className="bg-black rounded-xl overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-800">
              <ImageIcon className="h-20 w-20 text-gray-600" />
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <div className="flex items-center gap-4 text-gray-300 text-sm mt-1">
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