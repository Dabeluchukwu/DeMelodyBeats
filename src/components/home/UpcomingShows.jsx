"use client";

import Link from "next/link";
import { useUpcomingShows } from "@/hooks/useShows";
import { Calendar, MapPin, Clock, Loader2, Ticket } from "lucide-react";
import { motion } from "framer-motion";

export function UpcomingShows() {
  const { data: shows, isLoading, error } = useUpcomingShows();

  if (isLoading) {
    return (
      <section className="py-24 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto" />
          <p className="mt-4 text-gray-400">Loading shows...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400">Failed to load shows. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <section className="py-24 bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            Coming Soon
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Upcoming Shows
            </span>
          </h2>
          <p className="text-gray-400 text-lg">No upcoming shows at the moment. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-brand-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            Live Events
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Upcoming Shows
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg">Come experience the music live</p>
        </motion.div>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {shows.slice(0, 4).map((show, index) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-orange transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-brand-orange/5"
            >
              {/* Date Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-brand-orange/20 border border-brand-orange/30">
                  <span className="text-xs font-semibold text-brand-orange uppercase">
                    {new Date(show.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-bold text-brand-gold">
                    {new Date(show.date).getDate()}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold font-heading text-brand-gold pr-16">
                {show.title}
              </h3>
              
              <div className="mt-3 space-y-2 text-gray-300">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-orange flex-shrink-0" />
                  {show.venue}, {show.city}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-orange flex-shrink-0" />
                  {new Date(show.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                {show.doorsTime && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand-orange flex-shrink-0" />
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 hover:scale-105"
                  >
                    <Ticket className="h-4 w-4" />
                    Get Tickets
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {shows.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/shows"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
            >
              View All Shows
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}