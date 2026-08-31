'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRelease, useUpdateRelease, useRelease } from '@/hooks/useReleases';
import { Loader2, Upload, X, Plus, Trash2, Music2 } from 'lucide-react';

const releaseTypes = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'EP', label: 'EP' },
  { value: 'ALBUM', label: 'Album' },
];

export function AdminReleaseForm({ releaseId, isEditing }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'SINGLE',
    releaseDate: '',
    coverArt: '',
    description: '',
    spotifyUrl: '',
    appleMusicUrl: '',
    bandcampUrl: '',
    youtubeUrl: '',
    purchaseUrl: '',
    isFeatured: false,
    songs: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', duration: '', order: 0 });

  const { data: release, isLoading: isFetching, refetch } = useRelease(releaseId);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && release && !isDataLoaded) {
      const date = new Date(release.releaseDate);
      setFormData({
        title: release.title || '',
        type: release.type || 'SINGLE',
        releaseDate: date.toISOString().split('T')[0],
        coverArt: release.coverArt || '',
        description: release.description || '',
        spotifyUrl: release.spotifyUrl || '',
        appleMusicUrl: release.appleMusicUrl || '',
        bandcampUrl: release.bandcampUrl || '',
        youtubeUrl: release.youtubeUrl || '',
        purchaseUrl: release.purchaseUrl || '',
        isFeatured: release.isFeatured || false,
        songs: release.songs || [],
      });
      if (release.coverArt) {
        setImagePreview(release.coverArt);
      }
      setIsDataLoaded(true);
    }
  }, [release, isEditing, isDataLoaded]);

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        title: '',
        type: 'SINGLE',
        releaseDate: '',
        coverArt: '',
        description: '',
        spotifyUrl: '',
        appleMusicUrl: '',
        bandcampUrl: '',
        youtubeUrl: '',
        purchaseUrl: '',
        isFeatured: false,
        songs: [],
      });
      setImagePreview(null);
      setIsDataLoaded(false);
      setNewSong({ title: '', duration: '', order: 0 });
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && releaseId) {
      refetch();
    }
  }, [releaseId, isEditing, refetch]);

  const createRelease = useCreateRelease();
  const updateRelease = useUpdateRelease();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSong = () => {
    if (!newSong.title.trim()) {
      setError('Song title is required');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      songs: [...prev.songs, { ...newSong, order: prev.songs.length + 1 }],
    }));
    setNewSong({ title: '', duration: '', order: 0 });
    setError('');
  };

  const handleRemoveSong = (index) => {
    setFormData((prev) => ({
      ...prev,
      songs: prev.songs.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      const imageUrl = result.data.url;

      setFormData(prev => ({ ...prev, coverArt: imageUrl }));
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, coverArt: '' }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title || !formData.type || !formData.releaseDate || !formData.coverArt) {
      setError('Title, type, release date, and cover art are required.');
      setLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        releaseDate: new Date(formData.releaseDate).toISOString(),
        songs: formData.songs,
      };

      if (isEditing) {
        await updateRelease.mutateAsync({ id: releaseId, data: dataToSubmit });
      } else {
        await createRelease.mutateAsync(dataToSubmit);
      }
      router.push('/admin/releases');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save release. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <span className="ml-3 text-gray-500">Loading release data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Release Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Hymns of Hope"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Release Type *
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          >
            {releaseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Release Date */}
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Release Date *
          </label>
          <input
            type="date"
            id="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Cover Art Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Art *
          </label>
          <div className="flex flex-col items-center justify-center w-full">
            {imagePreview ? (
              <div className="relative w-full max-w-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Cover art preview"
                  className="w-full aspect-square rounded-lg border border-gray-200 dark:border-gray-700 object-cover bg-gray-50 dark:bg-gray-900"
                  onError={(e) => {
                    e.target.src = '';
                    e.target.alt = 'Image failed to load';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="w-full max-w-xs aspect-square p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand-orange transition-colors cursor-pointer flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload cover art</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading && (
              <div className="mt-3 flex items-center gap-2 text-sm text-brand-orange">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe this release..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Streaming Links */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Streaming Links
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="url"
              id="spotifyUrl"
              value={formData.spotifyUrl}
              onChange={handleChange}
              placeholder="Spotify URL"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <input
              type="url"
              id="appleMusicUrl"
              value={formData.appleMusicUrl}
              onChange={handleChange}
              placeholder="Apple Music URL"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <input
              type="url"
              id="bandcampUrl"
              value={formData.bandcampUrl}
              onChange={handleChange}
              placeholder="Bandcamp URL"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <input
              type="url"
              id="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="YouTube URL"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <input
              type="url"
              id="purchaseUrl"
              value={formData.purchaseUrl}
              onChange={handleChange}
              placeholder="Purchase URL"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Featured */}
        <div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange h-5 w-5"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Release (show on homepage)
            </label>
          </div>
        </div>

        {/* Tracklist */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tracklist
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Song title"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <input
              type="text"
              placeholder="Duration (e.g. 4:32)"
              value={newSong.duration}
              onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
              className="w-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleAddSong}
              className="px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {formData.songs.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.songs.map((song, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 font-mono w-6">
                      {song.order || index + 1}
                    </span>
                    <span className="font-medium">{song.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{song.duration}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSong(index)}
                      className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => router.push('/admin/releases')}
          className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 px-6 py-3 rounded-lg font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditing ? 'Update Release' : 'Create Release'}</>
          )}
        </button>
      </div>
    </form>
  );
}