'use client';

import { useState, useMemo } from 'react';
import { useReleases } from '@/hooks/useReleases';
import { Loader2, Music2, Search, X } from 'lucide-react';
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
      <div className="min-h-screen pt-32 pb-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading music...</p>
        </div>
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
    <div className="min-h-screen pt-10 pb-16 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Our Music
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore our discography and listen to our songs on your favorite platform.
          </p>
        </div>

        {/* Search Bar - Full Width */}
        {hasReleases && (
          <div className="mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search songs by title, description, or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {hasReleases && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === option.id
                    ? 'bg-brand-orange text-brand-black hover:bg-brand-gold'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        {hasReleases && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Showing {filteredReleases.length} {filteredReleases.length === 1 ? 'release' : 'releases'}
            {filter !== 'all' && ` (${filterOptions.find(f => f.id === filter)?.label})`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        )}

        {/* Releases Grid */}
        {!hasReleases ? (
          <div className="text-center py-16">
            <Music2 className="h-16 w-16 text-brand-orange/40 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No releases available yet. Check back soon!</p>
          </div>
        ) : !hasFilteredResults ? (
          <div className="text-center py-16">
            <Music2 className="h-16 w-16 text-brand-orange/40 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
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
                className="mt-4 text-brand-orange hover:text-brand-gold transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReleases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                onClick={() => setSelectedRelease(release)}
                isSelected={selectedRelease?.id === release.id}
              />
            ))}
          </div>
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