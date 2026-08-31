'use client';

import Link from "next/link";
import { useUpcomingShows } from "@/hooks/useShows";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpcomingShows() {
  const { data: shows, isLoading, error } = useUpcomingShows();

  if (isLoading) {
    return (
      <section className="py-16 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading shows...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load shows. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <section className="py-16 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Upcoming Shows
            </span>
          </h2>
          <p className="text-gray-300">No upcoming shows at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Upcoming Shows
            </span>
          </h2>
          <p className="mt-4 text-gray-300">Come experience the music live</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {shows.slice(0, 4).map((show) => (
            <div
              key={show.id}
              className="bg-brand-black/50 border border-brand-orange/20 rounded-lg p-6 hover:border-brand-orange transition-all duration-300 hover:shadow-lg hover:shadow-brand-orange/5"
            >
              <h3 className="text-xl font-bold font-heading text-brand-gold">
                {show.title}
              </h3>
              <div className="mt-3 space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-orange" />
                  {show.venue}, {show.city}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-orange" />
                  {new Date(show.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                {show.doorsTime && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-orange" />
                    Doors: {show.doorsTime}
                  </p>
                )}
              </div>
              {show.ticketUrl && show.ticketUrl !== '#' && (
                <div className="mt-4">
                  <a
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-lg font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
                  >
                    Get Tickets
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {shows.length > 4 && (
          <div className="text-center mt-8">
            <Link
              href="/shows"
              className="text-brand-orange hover:text-brand-gold transition-colors font-medium"
            >
              View All Shows →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}