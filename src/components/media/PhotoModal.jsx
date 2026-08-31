"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Image as ImageIcon, Download } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-5xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image */}
        <div className="bg-black rounded-2xl overflow-hidden border border-white/10">
          {imageUrl ? (
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
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-2xl">
          <h3 className="text-white font-bold text-xl font-heading">{title}</h3>
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
              <span className="px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-semibold">
                {category}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}