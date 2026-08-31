'use client';

import { useState, useMemo } from 'react';
import { PhotoGallery } from './PhotoGallery';
import { VideoGallery } from './VideoGallery';
import { Image as ImageIcon, Video, Search, X } from 'lucide-react';

const tabs = [
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: Video },
];

const categoryOptions = [
  { id: 'all', label: 'All Categories' },
  { id: 'Performance', label: 'Performance' },
  { id: 'Outreach', label: 'Outreach' },
  { id: 'Studio', label: 'Studio' },
  { id: 'Behind the Scenes', label: 'Behind the Scenes' },
  { id: 'Other', label: 'Other' },
];

export function MediaPage() {
  const [activeTab, setActiveTab] = useState('photos');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-10 pb-16 bg-white dark:bg-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Media
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Photos and videos from our performances, events, and community outreach.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-brand-orange text-brand-black hover:bg-brand-gold'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Search Bar - Full Width Above Filters */}
        <div className="mb-4">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by title, description, or category...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Buttons - Below Search */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setCategoryFilter(option.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                categoryFilter === option.id
                  ? 'bg-brand-orange text-brand-black'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'photos' ? (
          <PhotoGallery
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
          />
        ) : (
          <VideoGallery
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}