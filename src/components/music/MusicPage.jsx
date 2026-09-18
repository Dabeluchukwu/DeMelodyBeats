"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReleases } from '@/hooks/useReleases';
import { Loader2, Music2, Search, X, Sparkles, Filter } from 'lucide-react';
import { ReleaseCard } from './ReleaseCard';
import { ReleaseDetail } from './ReleaseDetail';

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'ALBUM', label: 'Albums' },
  { id: 'EP', label: 'EPs' },
  { id: 'SINGLE', label: 'Singles' },
];

export function MusicPage() {
  const { data: releases, isLoading, error } = useReleases();
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search releases
  const filteredReleases = useMemo(() => {
    if (!releases) return [];

    let filtered = releases;

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(release => release.type === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(release =>
        release.title.toLowerCase().includes(query) ||
        release.description?.toLowerCase().includes(query) ||
        release.songs?.some(song => song.title.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [releases, filter, searchQuery]);

  const hasReleases = releases && releases.length > 0;
  const hasFilteredResults = filteredReleases.length > 0;

  if (isLoading) {
    return (
     <div className="min-h-screen pt-32 pb-16 bg-white dark:bg-brand-black flex flex-col items-center justify-center">
  <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
  <p className="mt-4 text-gray-400">Loading music...</p>
</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load music. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-white dark:bg-brand-black relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-brand-orange/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-brand-gold/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            <Music2 className="h-3 w-3" />
            Discography
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Music
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Explore our discography and listen to our songs on your favorite platform.
          </p>
        </motion.div>

        {/* Search Bar - Full Width */}
        {hasReleases && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search songs by title, description, or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Filter Buttons */}
        {hasReleases && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter:
            </span>
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === option.id
                    ? 'bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black shadow-md shadow-brand-orange/20'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Results Count */}
        {hasReleases && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400 mb-6"
          >
            Showing {filteredReleases.length} {filteredReleases.length === 1 ? 'release' : 'releases'}
            {filter !== 'all' && ` (${filterOptions.find(f => f.id === filter)?.label})`}
            {searchQuery && ` matching "${searchQuery}"`}
          </motion.p>
        )}

        {/* Releases Grid */}
        {!hasReleases ? (
          <div className="text-center py-20 bg-white dark:bg-brand-black/30 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music2 className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No releases available yet. Check back soon!</p>
          </div>
        ) : !hasFilteredResults ? (
          <div className="text-center py-20 bg-white dark:bg-brand-black/30 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music2 className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {searchQuery
                ? `No releases found matching "${searchQuery}"`
                : `No ${filter === 'all' ? '' : filter.toLowerCase() + 's'} available`}
            </p>
            {(searchQuery || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('all');
                }}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-colors text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <ReleaseCard
                  release={release}
                  onClick={() => setSelectedRelease(release)}
                  isSelected={selectedRelease?.id === release.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Release Detail Modal */}
      {selectedRelease && (
        <ReleaseDetail
          release={selectedRelease}
          onClose={() => setSelectedRelease(null)}
        />
      )}
    </div>
  );
}