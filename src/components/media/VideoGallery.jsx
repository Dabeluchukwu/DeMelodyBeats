"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useVideos } from '@/hooks/useMedia';
import { Video, Play, Loader2, Calendar } from 'lucide-react';
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
      <div className="text-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
        <p className="mt-4 text-gray-400">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Failed to load videos. Please try again later.</p>
      </div>
    );
  }

  if (!filteredVideos || filteredVideos.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-brand-black/30 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
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
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl overflow-hidden bg-white dark:bg-brand-black/50 cursor-pointer hover:shadow-2xl hover:shadow-brand-orange/10 transition-all duration-300 border border-gray-200 dark:border-gray-800"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="aspect-video relative bg-gray-900">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <YouTubeIcon className="h-16 w-16 text-red-500" />
                </div>
              )}
              {video.category && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
                  {video.category}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-orange to-brand-gold flex items-center justify-center shadow-lg shadow-brand-orange/30"
                >
                  <Play className="h-8 w-8 text-brand-black ml-1" />
                </motion.div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold font-heading text-brand-orange group-hover:text-brand-gold transition-colors truncate">
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                {video.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
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
        Showing {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
        {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
        {searchQuery && ` matching "${searchQuery}"`}
      </motion.p>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  );
}