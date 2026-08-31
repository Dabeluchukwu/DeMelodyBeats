'use client';

import Link from 'next/link';
import { useRelease } from '@/hooks/useReleases';
import { Loader2, ArrowLeft, Edit, Calendar, Music2, ExternalLink } from 'lucide-react';

export function AdminReleaseDetail({ releaseId }) {
  const { data: release, isLoading, error } = useRelease(releaseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error || !release) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Release not found</p>
        <Link href="/admin/releases" className="text-brand-orange hover:text-brand-gold transition-colors mt-4 inline-block">
          ← Back to Releases
        </Link>
      </div>
    );
  }

  const streamingLinks = [
    { name: 'Spotify', url: release.spotifyUrl },
    { name: 'Apple Music', url: release.appleMusicUrl },
    { name: 'Bandcamp', url: release.bandcampUrl },
    { name: 'YouTube', url: release.youtubeUrl },
    { name: 'Purchase', url: release.purchaseUrl },
  ].filter(link => link.url);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/releases"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">{release.title}</h1>
        {release.isFeatured && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-orange/20 text-brand-orange">
            Featured
          </span>
        )}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          release.type === 'ALBUM' ? 'bg-purple-500/20 text-purple-500' :
          release.type === 'EP' ? 'bg-brand-gold/20 text-brand-gold' :
          'bg-brand-orange/20 text-brand-orange'
        }`}>
          {release.type}
        </span>
      </div>

      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Art */}
          <div className="md:w-48 flex-shrink-0">
            {release.coverArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={release.coverArt}
                alt={release.title}
                className="w-full aspect-square rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                onError={(e) => { e.target.src = ''; }}
              />
            ) : (
              <div className="w-full aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <Music2 className="h-20 w-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Release Date</p>
              <p className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-gold" />
                {new Date(release.releaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {release.description && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{release.description}</p>
              </div>
            )}

            {streamingLinks.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Listen</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  {streamingLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-brand-orange/10 transition-colors text-sm"
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Tracklist */}
            {release.songs && release.songs.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tracklist</p>
                <div className="mt-2 space-y-1">
                  {release.songs.map((song, index) => (
                    <div key={song.id || index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 font-mono w-6">
                          {song.order || index + 1}
                        </span>
                        <span className="font-medium">{song.title}</span>
                      </div>
                      {song.duration && (
                        <span className="text-sm text-gray-500">{song.duration}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p>Created: {new Date(release.createdAt).toLocaleString()}</p>
          <p>Last Updated: {new Date(release.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href={`/admin/releases/${release.id}/edit`}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
        >
          <Edit className="h-4 w-4" />
          Edit Release
        </Link>
      </div>
    </div>
  );
}