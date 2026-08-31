'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShow } from '@/hooks/useShows';
import { Loader2, Calendar, MapPin, Clock, Ticket, Users, ArrowLeft, Edit, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';

export function AdminShowDetail({ showId }) {
  const router = useRouter();
  const { data: show, isLoading, error } = useShow(showId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Show not found</p>
        <Link href="/admin/shows" className="text-brand-orange hover:text-brand-gold transition-colors mt-4 inline-block">
          ← Back to Shows
        </Link>
      </div>
    );
  }

  const showDate = new Date(show.date);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/shows"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">{show.title}</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          show.isPast 
            ? 'bg-gray-500/20 text-gray-500' 
            : 'bg-green-500/20 text-green-500'
        }`}>
          {show.isPast ? 'Past Event' : 'Upcoming'}
        </span>
      </div>

      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
              <p className="font-medium">{show.venue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{show.city}, {show.state || ''} {show.country}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-gold" />
                {showDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              {show.doorsTime && (
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-gold" />
                  Doors: {show.doorsTime}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {show.ageRestriction && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Age Restriction</p>
                <p className="font-medium">{show.ageRestriction}</p>
              </div>
            )}

            {show.ticketUrl && show.ticketUrl !== '#' && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tickets</p>
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-gold transition-colors"
                >
                  <Ticket className="h-4 w-4" />
                  Get Tickets
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Support Acts */}
        {show.supportActs && show.supportActs.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Support Acts</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              {show.supportActs.map((act, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{act}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Poster Image */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Poster</p>
          {show.posterImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={show.posterImage}
              alt={show.title}
              className="mt-2 max-w-xs rounded-lg border border-gray-200 dark:border-gray-800 max-h-64 object-contain bg-gray-50 dark:bg-gray-900"
              onError={(e) => {
                console.error('Image failed to load:', show.posterImage);
                e.target.src = '/placeholder-image.jpg';
                e.target.onerror = null;
              }}
            />
          ) : (
            <div className="mt-2 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No poster image</p>
              </div>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="text-sm text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p>Created: {new Date(show.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(show.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href={`/admin/shows/${show.id}/edit`}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
        >
          <Edit className="h-4 w-4" />
          Edit Show
        </Link>
      </div>
    </div>
  );
}