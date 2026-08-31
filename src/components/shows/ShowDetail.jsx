'use client';

import { useEffect } from 'react';
import { X, Calendar, MapPin, Clock, Ticket, Users, Music2, ExternalLink } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-brand-black rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster Image */}
            {posterImage && (
              <div className="md:w-1/3">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
              {isPastShow ? (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-500 mb-3">
                  Past Event
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500 mb-3">
                  Upcoming
                </span>
              )}

              <h2 className="text-2xl md:text-3xl font-bold font-heading text-brand-orange mb-3">
                {title}
              </h2>

              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span>
                    {showDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span>
                    {venue}
                    <br />
                    {[city, state, country].filter(Boolean).join(', ')}
                  </span>
                </p>
                {doorsTime && (
                  <p className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>Doors: {doorsTime}</span>
                  </p>
                )}
                {ageRestriction && (
                  <p className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>{ageRestriction}</span>
                  </p>
                )}
              </div>

              {/* Support Acts */}
              {supportActs && supportActs.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-brand-gold mb-2">Support Acts</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                    {supportActs.map((act, index) => (
                      <li key={index}>{act}</li>
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
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
                  >
                    <Ticket className="h-5 w-5" />
                    Get Tickets
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {isPastShow && (
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-gray-500 dark:text-gray-400">
                  <Music2 className="h-6 w-6 mx-auto mb-2" />
                  This event has passed. Check out our upcoming shows!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}