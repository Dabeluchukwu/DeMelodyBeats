"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePhotos } from '@/hooks/useMedia';
import { Loader2, Image as ImageIcon, Grid3x3, Sparkles } from 'lucide-react';
import { PhotoModal } from './PhotoModal';

export function PhotoGallery({ categoryFilter = 'all', searchQuery = '' }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { data: photos, isLoading, error } = usePhotos();

  // Filter photos
  const filteredPhotos = useMemo(() => {
    if (!photos) return [];

    let filtered = [...photos];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(photo => photo.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(query) ||
        photo.description?.toLowerCase().includes(query) ||
        photo.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [photos, categoryFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
        <p className="mt-4 text-gray-400">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Failed to load photos. Please try again later.</p>
      </div>
    );
  }

  if (!filteredPhotos || filteredPhotos.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-brand-black/30 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          {searchQuery || categoryFilter !== 'all'
            ? `No photos found matching your filters`
            : 'No photos available yet. Check back soon!'}
        </p>
        {(searchQuery || categoryFilter !== 'all') && (
          <p className="text-sm text-gray-400 mt-2">
            Try clearing your filters or search terms
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer group relative shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedPhoto(photo)}
          >
            {photo.imageUrl ? (
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-orange/10">
                <ImageIcon className="h-12 w-12 text-brand-orange/30" />
              </div>
            )}
            {photo.category && (
              <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
                {photo.category}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
              <span className="text-white text-sm font-medium truncate w-full">
                {photo.title}
              </span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium px-4 py-2 bg-brand-orange rounded-xl transition-all duration-300 hover:scale-105">
                View
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results Count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center"
      >
        Showing {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
        {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </motion.p>

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  );
}