'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2, Image, Video } from 'lucide-react';

export function AdminMediaUpload({ isOpen, onClose, onUpload, type }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Performance');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const categories = ['Performance', 'Outreach', 'Studio', 'Behind the Scenes', 'Other'];

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'photo') {
        if (!file) {
          setError('Please select an image');
          setLoading(false);
          return;
        }

        // First, upload the image to R2
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Image upload failed');
        }

        const uploadResult = await uploadResponse.json();
        const imageUrl = uploadResult.data.url;

        // Then, create the photo record with the image URL
        const photoData = {
          title,
          description,
          category,
          imageUrl: imageUrl,
          thumbnail: imageUrl,
          date: new Date().toISOString(),
          isPublished: true,
        };

        await onUpload(photoData);
        
      } else {
        // Video upload - no image upload needed
        if (!videoId) {
          setError('Please enter a YouTube video ID');
          setLoading(false);
          return;
        }

        const videoData = {
          title,
          description,
          category,
          videoId,
          date: new Date().toISOString(),
          isPublished: true,
        };

        await onUpload(videoData);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Performance');
      setFile(null);
      setPreview(null);
      setVideoId('');
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('Performance');
    setFile(null);
    setPreview(null);
    setVideoId('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-brand-black rounded-xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {type === 'photo' ? (
              <Image className="h-5 w-5 text-brand-orange" />
            ) : (
              <Video className="h-5 w-5 text-brand-orange" />
            )}
            <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
              Upload {type === 'photo' ? 'Photo' : 'Video'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter title"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Enter description"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Photo Upload */}
            {type === 'photo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    preview
                      ? 'border-brand-orange'
                      : 'border-gray-300 dark:border-gray-700 hover:border-brand-orange'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP (max 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                {file && (
                  <p className="text-xs text-gray-400 mt-1">Selected: {file.name}</p>
                )}
              </div>
            )}

            {/* Video Upload */}
            {type === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  YouTube Video ID *
                </label>
                <input
                  type="text"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  required
                  placeholder="e.g. B6fA35Ved-Y"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the YouTube video ID from the URL: https://youtube.com/watch?v=<strong>VIDEO_ID</strong>
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 flex gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-brand-black/30 rounded-b-xl">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}