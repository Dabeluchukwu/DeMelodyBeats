"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Ticket, Users, Music2, ExternalLink, Sparkles } from 'lucide-react';

export function ShowDetail({ show, onClose }) {
  const { title, venue, city, state, country, date, doorsTime, ageRestriction, ticketUrl, posterImage, supportActs, isPast } = show;

  const showDate = new Date(date);
  const isPastShow = isPast || showDate < new Date();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-brand-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster Image */}
              {posterImage && (
                <div className="md:w-1/3">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-xl">
                    <img
                      src={posterImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className={posterImage ? 'md:w-2/3' : 'w-full'}>
                {/* Status Badge */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {isPastShow ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-500/20 text-gray-500">
                      Past Event
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-500/20 text-green-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Upcoming
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-orange mb-4">
                  {title}
                </h2>

                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="p-2 rounded-xl bg-brand-gold/10">
                      <Calendar className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium">
                        {showDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="p-2 rounded-xl bg-brand-gold/10">
                      <MapPin className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                      <p className="font-medium">{venue}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {[city, state, country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>

                  {doorsTime && (
                    <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="p-2 rounded-xl bg-brand-gold/10">
                        <Clock className="h-5 w-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Doors Open</p>
                        <p className="font-medium">{doorsTime}</p>
                      </div>
                    </div>
                  )}

                  {ageRestriction && (
                    <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="p-2 rounded-xl bg-brand-gold/10">
                        <Users className="h-5 w-5 text-brand-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Age Restriction</p>
                        <p className="font-medium">{ageRestriction}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Support Acts */}
                {supportActs && supportActs.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-sm font-semibold text-brand-gold mb-2">Support Acts</h3>
                    <ul className="flex flex-wrap gap-2">
                      {supportActs.map((act, index) => (
                        <li key={index} className="px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-medium">
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ticket Button */}
                {ticketUrl && ticketUrl !== '#' && !isPastShow && (
                  <div className="mt-6">
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 hover:scale-105"
                    >
                      <Ticket className="h-5 w-5" />
                      Get Tickets
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {isPastShow && (
                  <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                    <Music2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-medium">This event has passed</p>
                    <p className="text-sm">Check out our upcoming shows!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}