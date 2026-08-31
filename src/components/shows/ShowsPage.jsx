'use client';

import { useState, useMemo } from 'react';
import { useShows } from '@/hooks/useShows';
import { Loader2, Calendar, MapPin, Clock, Ticket, Music2 } from 'lucide-react';
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
      <div className="min-h-screen pt-32 pb-16 bg-white dark:bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading shows...</p>
        </div>
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
    <div className="min-h-screen pt-10 pb-16 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Upcoming Shows
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Come experience the music live. Check out our upcoming performances and events.
          </p>
        </div>

        {/* Filters */}
        <ShowFilters filter={filter} onFilterChange={setFilter} />

        {/* Shows Grid */}
        {sortedShows.length === 0 ? (
          <div className="text-center py-16">
            <Music2 className="h-16 w-16 text-brand-orange/40 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'upcoming' 
                ? 'No upcoming shows at the moment. Check back soon!' 
                : 'No past shows to display.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedShows.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                onClick={() => setSelectedShow(show)}
              />
            ))}
          </div>
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
