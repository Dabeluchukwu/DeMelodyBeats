'use client';

import { useState, useMemo } from 'react';
import { usePhotos, useVideos, useDeletePhoto, useDeleteVideo, useBulkDeletePhotos, useBulkDeleteVideos, useUploadPhoto, useUploadVideo } from '@/hooks/useMedia';
import { Loader2, Plus, Trash2, Image, Video, Calendar, Search, X } from 'lucide-react';
import { AdminMediaUpload } from './AdminMediaUpload';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

const categoryOptions = [
  { id: 'all', label: 'All Categories' },
  { id: 'Performance', label: 'Performance' },
  { id: 'Outreach', label: 'Outreach' },
  { id: 'Studio', label: 'Studio' },
  { id: 'Behind the Scenes', label: 'Behind the Scenes' },
  { id: 'Other', label: 'Other' },
];

export function AdminMedia() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('photo');
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedItems, setSelectedItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    itemId: null,
    itemTitle: '',
    count: 0,
  });

  const { data: photos, isLoading: photosLoading } = usePhotos();
  const { data: videos, isLoading: videosLoading } = useVideos();
  const deletePhoto = useDeletePhoto();
  const deleteVideo = useDeleteVideo();
  const bulkDeletePhotos = useBulkDeletePhotos();
  const bulkDeleteVideos = useBulkDeleteVideos();
  const uploadPhoto = useUploadPhoto();
  const uploadVideo = useUploadVideo();

  const isLoading = activeTab === 'photos' ? photosLoading : videosLoading;
  const items = activeTab === 'photos' ? photos : videos;

  // Filter and search items
  const filteredItems = useMemo(() => {
    if (!items) return [];

    let filtered = items;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, categoryFilter, searchQuery]);

  const handleDeleteClick = (id, title, type) => {
    setModalState({
      isOpen: true,
      type: type,
      itemId: id,
      itemTitle: title,
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: activeTab === 'photos' ? 'bulk_photos' : 'bulk_videos',
      itemId: null,
      itemTitle: '',
      count: selectedItems.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'photo') {
      await deletePhoto.mutateAsync(modalState.itemId);
    } else if (modalState.type === 'video') {
      await deleteVideo.mutateAsync(modalState.itemId);
    } else if (modalState.type === 'bulk_photos') {
      await bulkDeletePhotos.mutateAsync(selectedItems);
      setSelectedItems([]);
    } else if (modalState.type === 'bulk_videos') {
      await bulkDeleteVideos.mutateAsync(selectedItems);
      setSelectedItems([]);
    }
    setModalState({ isOpen: false, type: null, itemId: null, itemTitle: '', count: 0 });
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems?.map(item => item.id) || []);
    }
  };

  const handleUploadPhoto = async (formData) => {
    await uploadPhoto.mutateAsync(formData);
  };

  const handleUploadVideo = async (data) => {
    await uploadVideo.mutateAsync(data);
  };

  const openUploadModal = (type) => {
    setUploadType(type);
    setShowUploadModal(true);
  };

  const getCategoryCount = (category) => {
    if (!items) return 0;
    if (category === 'all') return items.length;
    return items.filter(item => item.category === category).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Media</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage photos and videos</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedItems.length})
            </button>
          )}
          <button
            onClick={() => openUploadModal('photo')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Photo
          </button>
          <button
            onClick={() => openUploadModal('video')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Video
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setActiveTab('photos'); setSelectedItems([]); setCategoryFilter('all'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'photos'
              ? 'bg-brand-orange text-brand-black'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Image className="h-4 w-4" />
          Photos ({photos?.length || 0})
        </button>
        <button
          onClick={() => { setActiveTab('videos'); setSelectedItems([]); setCategoryFilter('all'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'videos'
              ? 'bg-brand-orange text-brand-black'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Video className="h-4 w-4" />
          Videos ({videos?.length || 0})
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categoryOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setCategoryFilter(option.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                categoryFilter === option.id
                  ? 'bg-brand-orange text-brand-black'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {option.label} ({getCategoryCount(option.id)})
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {filteredItems.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          {categoryFilter !== 'all' && ` in "${categoryFilter}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Grid */}
      {!filteredItems || filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          {activeTab === 'photos' ? (
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          ) : (
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          <p className="text-gray-500">
            {searchQuery || categoryFilter !== 'all'
              ? `No ${activeTab} found matching your filters`
              : `No ${activeTab} yet. Upload your first ${activeTab === 'photos' ? 'photo' : 'video'}!`
            }
          </p>
          {(searchQuery || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="mt-4 text-brand-orange hover:text-brand-gold transition-colors text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-brand-black/50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-brand-orange transition-all duration-300"
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative">
                {activeTab === 'photos' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = ''; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <Video className="h-12 w-12 text-gray-600" />
                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/60 px-2 py-0.5 rounded">
                      YouTube
                    </span>
                  </div>
                )}
                {item.category && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs bg-black/60 text-white">
                    {item.category}
                  </span>
                )}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange h-4 w-4 bg-black/50"
                  />
                </div>
                <button
                  onClick={() => handleDeleteClick(item.id, item.title, activeTab === 'photos' ? 'photo' : 'video')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AdminMediaUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={uploadType === 'photo' ? handleUploadPhoto : handleUploadVideo}
        type={uploadType}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, itemId: null, itemTitle: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={
          modalState.type === 'bulk_photos' || modalState.type === 'bulk_videos'
            ? `Delete ${modalState.count} Items`
            : `Delete "${modalState.itemTitle}"`
        }
        message={
          modalState.type === 'bulk_photos' || modalState.type === 'bulk_videos'
            ? `Are you sure you want to delete ${modalState.count} selected item(s)? This action cannot be undone.`
            : `Are you sure you want to delete "${modalState.itemTitle}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}