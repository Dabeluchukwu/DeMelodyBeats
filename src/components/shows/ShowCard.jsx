"use client";

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Ticket, Sparkles } from 'lucide-react';

export function ShowCard({ show, onClick }) {
  const { title, venue, city, date, doorsTime, ticketUrl, isPast } = show;

  const showDate = new Date(date);
  const isPastShow = isPast || showDate < new Date();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white dark:bg-brand-black/50 rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer
        ${isPastShow 
          ? 'border-gray-300 dark:border-gray-700 opacity-75 hover:opacity-90' 
          : 'border-gray-200 dark:border-gray-800 hover:border-brand-orange hover:shadow-2xl hover:shadow-brand-orange/10'
        }
      `}
      onClick={onClick}
    >
      {/* Date Header */}
      <div className={`p-4 ${isPastShow ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gradient-to-r from-brand-orange/10 to-brand-gold/10'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isPastShow ? 'bg-gray-300 dark:bg-gray-700' : 'bg-brand-orange/20'}`}>
              <Calendar className={`h-4 w-4 ${isPastShow ? 'text-gray-500' : 'text-brand-orange'}`} />
            </div>
            <div>
              <p className={`font-semibold ${isPastShow ? 'text-gray-600 dark:text-gray-400' : 'text-brand-orange'}`}>
                {showDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          {isPastShow && (
            <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-500/20 text-gray-500">
              Past
            </span>
          )}
          {!isPastShow && (
            <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-green-500/20 text-green-500 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold font-heading text-brand-orange group-hover:text-brand-gold transition-colors mb-2">
          {title}
        </h3>
        
        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <p className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-brand-gold/10">
              <MapPin className="h-3.5 w-3.5 text-brand-gold" />
            </div>
            {venue}, {city}
          </p>
          {doorsTime && (
            <p className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-lg bg-brand-gold/10">
                <Clock className="h-3.5 w-3.5 text-brand-gold" />
              </div>
              Doors: {doorsTime}
            </p>
          )}
        </div>

        {/* Ticket Button */}
        {ticketUrl && ticketUrl !== '#' && !isPastShow && (
          <div className="mt-4">
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 text-sm hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <Ticket className="h-4 w-4" />
              Get Tickets
            </a>
          </div>
        )}

        {isPastShow && (
          <div className="mt-4 text-sm text-gray-400 italic flex items-center gap-2">
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            This event has passed
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>
        )}
      </div>
    </motion.div>
  );
}