'use client';

import { useState, useMemo } from 'react';
import { usePhotos } from '@/hooks/useMedia';
import { Loader2, Image as ImageIcon } from 'lucide-react';
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
      <div className="text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
        <p className="mt-4 text-gray-400">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Failed to load photos. Please try again later.</p>
      </div>
    );
  }

  if (!filteredPhotos || filteredPhotos.length === 0) {
    return (
      <div className="text-center py-16">
        <ImageIcon className="h-16 w-16 text-brand-orange/40 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 cursor-pointer group relative hover:shadow-lg transition-all duration-300"
            onClick={() => setSelectedPhoto(photo)}
          >
            {photo.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-orange/10">
                <ImageIcon className="h-12 w-12 text-brand-orange/30" />
              </div>
            )}
            {photo.category && (
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs bg-black/60 text-white">
                {photo.category}
              </span>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium px-3 py-1 bg-brand-orange rounded transition-all duration-300">
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Showing {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
        {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  );
}