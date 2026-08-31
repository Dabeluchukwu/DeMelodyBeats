"use client";

import { Clock, Music2 } from 'lucide-react';

export function SongList({ songs }) {
  return (
    <div className="bg-gray-50 dark:bg-brand-black/30 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {songs.map((song, index) => (
          <div
            key={song.id || index}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-brand-black/50 transition-colors group"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <span className="text-sm text-gray-400 font-mono w-6 text-right group-hover:text-brand-orange transition-colors">
                {song.order || index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-brand-orange transition-colors">
                  {song.title}
                </p>
                {song.isExplicit && (
                  <span className="text-xs text-red-500 font-semibold ml-2">E</span>
                )}
              </div>
            </div>
            {song.duration && (
              <div className="flex items-center gap-1 text-sm text-gray-400 flex-shrink-0 ml-4 group-hover:text-brand-gold transition-colors">
                <Clock className="h-3 w-3" />
                {song.duration}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}