import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';

export function ShowCard({ show, onClick }) {
  const { title, venue, city, date, doorsTime, ticketUrl, isPast } = show;

  const showDate = new Date(date);
  const isPastShow = isPast || showDate < new Date();

  return (
    <div
      className={`group bg-gray-50 dark:bg-brand-black/50 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer
        ${isPastShow 
          ? 'border-gray-300 dark:border-gray-700 opacity-75' 
          : 'border-gray-200 dark:border-gray-800 hover:border-brand-orange hover:shadow-lg hover:shadow-brand-orange/5'
        }
      `}
      onClick={onClick}
    >
      {/* Date Header */}
      <div className={`p-4 ${isPastShow ? 'bg-gray-200 dark:bg-gray-800' : 'bg-brand-orange/10'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className={`h-5 w-5 ${isPastShow ? 'text-gray-500' : 'text-brand-orange'}`} />
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
            <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-500/20 text-gray-500">
              Past
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold font-heading text-brand-orange mb-2">
          {title}
        </h3>
        
        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <p className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-brand-gold" />
            {venue}, {city}
          </p>
          {doorsTime && (
            <p className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-brand-gold" />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Ticket className="h-4 w-4" />
              Get Tickets
            </a>
          </div>
        )}

        {isPastShow && (
          <div className="mt-4 text-sm text-gray-400 italic">
            This event has passed
          </div>
        )}
      </div>
    </div>
  );
}