'use client';

import { useState, useMemo } from 'react';
import { useVideos } from '@/hooks/useMedia';
import { Video, Play, Loader2 } from 'lucide-react';
import { YouTubeIcon } from '@/components/icons/SocialIcons';
import { VideoModal } from './VideoModal';

export function VideoGallery({ categoryFilter = 'all', searchQuery = '' }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { data: videos, isLoading, error } = useVideos();

  // Filter videos
  const filteredVideos = useMemo(() => {
    if (!videos) return [];

    let filtered = [...videos];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(video => video.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [videos, categoryFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
        <p className="mt-4 text-gray-400">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Failed to load videos. Please try again later.</p>
      </div>
    );
  }

  if (!filteredVideos || filteredVideos.length === 0) {
    return (
      <div className="text-center py-16">
        <Video className="h-16 w-16 text-brand-orange/40 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery || categoryFilter !== 'all'
            ? `No videos found matching your filters`
            : 'No videos available yet. Check back soon!'}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="aspect-video relative bg-gray-900">
              {video.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <YouTubeIcon className="h-16 w-16 text-red-500" />
                </div>
              )}
              {video.category && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-black/60 text-white">
                  {video.category}
                </span>
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-orange/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-8 w-8 text-brand-black ml-1" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold font-heading text-brand-orange mb-1">
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                {video.date && (
                  <span>
                    {new Date(video.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Showing {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
        {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  );
}