"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useShows } from '@/hooks/useShows';
import { Loader2, Calendar, MapPin, Clock, Ticket, Music2, Sparkles } from 'lucide-react';
import { ShowCard } from './ShowCard';
import { ShowFilters } from './ShowFilters';
import { ShowDetail } from './ShowDetail';

export function ShowsPage() {
  const { data: shows, isLoading, error } = useShows();
  const [filter, setFilter] = useState('upcoming');
  const [selectedShow, setSelectedShow] = useState(null);

  // Filter shows
  const filteredShows = useMemo(() => {
    if (!shows) return [];
    
    const now = new Date();
    if (filter === 'upcoming') {
      return shows.filter(show => new Date(show.date) >= now && !show.isPast);
    } else if (filter === 'past') {
      return shows.filter(show => new Date(show.date) < now || show.isPast);
    }
    return shows;
  }, [shows, filter]);

  // Sort shows (upcoming: ascending, past: descending)
  const sortedShows = useMemo(() => {
    const sorted = [...filteredShows];
    if (filter === 'upcoming') {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return sorted;
  }, [filteredShows, filter]);

  if (isLoading) {
    return (
    <div className="min-h-screen pt-32 pb-16 bg-white dark:bg-brand-black flex flex-col items-center justify-center">
  <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
  <p className="mt-4 text-gray-400">Loading shows...</p>
</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load shows. Please try again later.</p>
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
            <Sparkles className="h-3 w-3" />
            Live Events
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Upcoming Shows
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Come experience the music live. Check out our upcoming performances and events.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ShowFilters filter={filter} onFilterChange={setFilter} />
        </motion.div>

        {/* Shows Grid */}
        {sortedShows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-white dark:bg-brand-black/30 rounded-2xl border border-gray-200 dark:border-gray-800"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music2 className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {filter === 'upcoming' 
                ? 'No upcoming shows at the moment. Check back soon!' 
                : 'No past shows to display.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <ShowCard
                  show={show}
                  onClick={() => setSelectedShow(show)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Show Detail Modal */}
      {selectedShow && (
        <ShowDetail
          show={selectedShow}
          onClose={() => setSelectedShow(null)}
        />
      )}
    </div>
  );
}