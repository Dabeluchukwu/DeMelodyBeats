import { Calendar, Music2, ExternalLink } from 'lucide-react';
import { 
  SpotifyIcon, 
  AppleMusicIcon, 
  AmazonMusicIcon 
} from '@/components/icons/SocialIcons';

export function ReleaseCard({ release, onClick, isSelected }) {
  const { title, type, coverArt, releaseDate, spotifyUrl, appleMusicUrl, bandcampUrl } = release;

  const streamingLinks = [
    { 
      name: 'Spotify', 
      url: spotifyUrl, 
      icon: SpotifyIcon,
      color: 'hover:text-[#1DB954]' 
    },
    { 
      name: 'Apple Music', 
      url: appleMusicUrl, 
      icon: AppleMusicIcon,
      color: 'hover:text-[#FC3C44]' 
    },
    { 
      name: 'Bandcamp', 
      url: bandcampUrl, 
      icon: AmazonMusicIcon,
      color: 'hover:text-[#2489cc]' 
    },
  ].filter(link => link.url);

  const typeColors = {
    SINGLE: 'bg-brand-orange/20 text-brand-orange',
    EP: 'bg-brand-gold/20 text-brand-gold',
    ALBUM: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div
      className={`group bg-gray-50 dark:bg-brand-black/50 rounded-lg overflow-hidden border transition-all duration-300 cursor-pointer
        ${isSelected ? 'border-brand-orange shadow-lg shadow-brand-orange/20' : 'border-gray-200 dark:border-gray-800 hover:border-brand-orange'}
      `}
      onClick={onClick}
    >
      {/* Cover Art */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        {coverArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverArt}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-orange/10">
            <Music2 className="h-16 w-16 text-brand-orange/40" />
          </div>
        )}
        
        {/* Type Badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${typeColors[type] || 'bg-gray-500/20 text-gray-400'}`}>
          {type}
        </span>

        {/* Click to view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-sm bg-brand-orange px-4 py-2 rounded-lg transition-all duration-300">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold font-heading text-brand-orange mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(releaseDate).getFullYear()}
        </p>

        {/* Streaming Links with Platform Icons */}
        {streamingLinks.length > 0 && (
          <div className="mt-3 flex gap-3">
            {streamingLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${link.color} transition-colors`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Listen on ${link.name}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}