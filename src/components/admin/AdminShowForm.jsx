'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateShow, useUpdateShow, useShow } from '@/hooks/useShows';
import { Loader2, Calendar, MapPin, Clock, Ticket, Users, Upload, X, Image as ImageIcon } from 'lucide-react';

export function AdminShowForm({ showId, isEditing }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    city: '',
    state: '',
    country: 'Nigeria',
    date: '',
    doorsTime: '',
    ageRestriction: 'All Ages',
    ticketUrl: '',
    posterImage: '',
    supportActs: [],
    supportActsInput: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isPastShow, setIsPastShow] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch show data if editing
  const { data: show, isLoading: isFetching, refetch } = useShow(showId);

  // Populate form when editing - FIXED
  useEffect(() => {
    if (isEditing && show && !isDataLoaded) {
      console.log('Populating form with show data:', show);
      
      const date = new Date(show.date);
      const isPast = date < new Date();
      setIsPastShow(isPast);
      
      setFormData({
        title: show.title || '',
        venue: show.venue || '',
        city: show.city || '',
        state: show.state || '',
        country: show.country || 'Nigeria',
        date: date.toISOString().split('T')[0],
        doorsTime: show.doorsTime || '',
        ageRestriction: show.ageRestriction || 'All Ages',
        ticketUrl: show.ticketUrl || '',
        posterImage: show.posterImage || '',
        supportActs: show.supportActs || [],
        supportActsInput: '',
      });
      
      // Set image preview from the stored URL
      if (show.posterImage) {
        console.log('Setting image preview from URL:', show.posterImage);
        setImagePreview(show.posterImage);
      } else {
        setImagePreview(null);
      }
      
      setIsDataLoaded(true);
    }
  }, [show, isEditing, isDataLoaded]);

  // Reset form when not editing or when showId changes
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        title: '',
        venue: '',
        city: '',
        state: '',
        country: 'Nigeria',
        date: '',
        doorsTime: '',
        ageRestriction: 'All Ages',
        ticketUrl: '',
        posterImage: '',
        supportActs: [],
        supportActsInput: '',
      });
      setImagePreview(null);
      setIsPastShow(false);
      setIsDataLoaded(false);
    }
  }, [isEditing]);

  // Refetch when showId changes
  useEffect(() => {
    if (isEditing && showId) {
      refetch();
    }
  }, [showId, isEditing, refetch]);

  const createShow = useCreateShow();
  const updateShow = useUpdateShow();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddSupportAct = () => {
    const act = formData.supportActsInput.trim();
    if (act && !formData.supportActs.includes(act)) {
      setFormData((prev) => ({
        ...prev,
        supportActs: [...prev.supportActs, act],
        supportActsInput: '',
      }));
    }
  };

  const handleRemoveSupportAct = (actToRemove) => {
    setFormData((prev) => ({
      ...prev,
      supportActs: prev.supportActs.filter((act) => act !== actToRemove),
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
      
      // Store the URL from the response
      const imageUrl = result.data.url;
      console.log('Upload successful, URL:', imageUrl);
      
      setFormData(prev => ({
        ...prev,
        posterImage: imageUrl,
      }));
      
      // Show preview using the uploaded URL
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
    setFormData(prev => ({ ...prev, posterImage: '' }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!formData.title || !formData.venue || !formData.city || !formData.country || !formData.date) {
    setError('Please fill in all required fields.');
    setLoading(false);
    return;
  }

  try {
    const dataToSubmit = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      supportActs: formData.supportActs,
      // order is not in shows, but if you have any number fields, convert them
    };
    delete dataToSubmit.supportActsInput;

    if (isEditing) {
      await updateShow.mutateAsync({ id: showId, data: dataToSubmit });
    } else {
      await createShow.mutateAsync(dataToSubmit);
    }

    router.push('/admin/shows');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to save show. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Loading state
  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <span className="ml-3 text-gray-500">Loading show data...</span>
      </div>
    );
  }

  // Past show message
  if (isEditing && isPastShow) {
    return (
      <div className="text-center py-16">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-8 max-w-md mx-auto border border-yellow-200 dark:border-yellow-800">
          <Calendar className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-heading text-yellow-700 dark:text-yellow-400 mb-2">
            Past Show Cannot Be Edited
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            This show has already passed. Past events cannot be modified to maintain historical accuracy.
          </p>
          <button
            onClick={() => router.push('/admin/shows')}
            className="mt-4 px-6 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            Back to Shows
          </button>
        </div>
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
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Community Outreach Concert"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Venue */}
        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Venue *
          </label>
          <input
            type="text"
            id="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            placeholder="e.g. City Center Church"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City *
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="e.g. Lagos"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            id="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. Lagos State"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country *
          </label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={handleChange}
            required
            placeholder="e.g. Nigeria"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Doors Time */}
        <div>
          <label htmlFor="doorsTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Doors Time
          </label>
          <input
            type="text"
            id="doorsTime"
            value={formData.doorsTime}
            onChange={handleChange}
            placeholder="e.g. 5:00 PM"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Age Restriction */}
        <div>
          <label htmlFor="ageRestriction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Age Restriction
          </label>
          <input
            type="text"
            id="ageRestriction"
            value={formData.ageRestriction}
            onChange={handleChange}
            placeholder="e.g. All Ages"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Ticket URL */}
        <div className="md:col-span-2">
          <label htmlFor="ticketUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ticket URL
          </label>
          <input
            type="url"
            id="ticketUrl"
            value={formData.ticketUrl}
            onChange={handleChange}
            placeholder="https://example.com/tickets"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Poster Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Poster Image
          </label>
          
          <div className="flex flex-col items-center justify-center w-full">
            {imagePreview ? (
  <div className="relative w-full max-w-md">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={imagePreview}
      alt="Poster preview"
      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 object-contain bg-gray-50 dark:bg-gray-900"
      onError={(e) => {
        console.error('Image failed to load:', imagePreview);
        // Show placeholder instead of broken image
        e.target.style.display = 'none';
        // Show a fallback div
        const parent = e.target.parentElement;
        const fallback = document.createElement('div');
        fallback.className = 'w-full p-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center';
        fallback.innerHTML = `
          <div class="text-center">
            <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-gray-500">Image not available</p>
          </div>
        `;
        parent.appendChild(fallback);
        e.target.onerror = null;
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
                className="w-full max-w-md p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand-orange transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
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

        {/* Support Acts */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Support Acts
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.supportActsInput}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, supportActsInput: e.target.value }))
              }
              placeholder="e.g. Local Gospel Choir"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleAddSupportAct}
              className="px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
            >
              Add
            </button>
          </div>
          {formData.supportActs.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.supportActs.map((act) => (
                <span
                  key={act}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm"
                >
                  {act}
                  <button
                    type="button"
                    onClick={() => handleRemoveSupportAct(act)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => router.push('/admin/shows')}
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
            <>{isEditing ? 'Update Show' : 'Create Show'}</>
          )}
        </button>
      </div>
    </form>
  );
}