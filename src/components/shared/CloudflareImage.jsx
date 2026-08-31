'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function CloudflareImage({ 
  imageId, 
  alt, 
  width = 800, 
  height = 600, 
  className = '',
  fit = 'cover',
  quality = 80,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${imageId}`;
  const url = `${baseUrl}?w=${width}&h=${height}&fit=${fit}&q=${quality}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500">
          Failed to load image
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}