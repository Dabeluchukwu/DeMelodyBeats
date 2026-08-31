'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateMember, useUpdateMember, useMember } from '@/hooks/useMembers';
import { Loader2, Upload, X } from 'lucide-react';
import { 
  InstagramIcon, 
  TwitterIcon, 
  FacebookIcon, 
  YouTubeIcon 
} from '@/components/icons/SocialIcons';

const socialPlatforms = [
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/username' },
  { id: 'twitter', label: 'Twitter/X', icon: TwitterIcon, placeholder: 'https://twitter.com/username' },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon, placeholder: 'https://facebook.com/username' },
  { id: 'youtube', label: 'YouTube', icon: YouTubeIcon, placeholder: 'https://youtube.com/@username' },
];
export function AdminMemberForm({ memberId, isEditing }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    socialLinks: {},
    order: 0,
    isActive: true,
    isFounder: false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { data: member, isLoading: isFetching, refetch } = useMember(memberId);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && member && !isDataLoaded) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        image: member.image || '',
        socialLinks: member.socialLinks || {},
        order: member.order || 0,
        isActive: member.isActive !== undefined ? member.isActive : true,
        isFounder: member.isFounder || false,
      });
      if (member.image) {
        setImagePreview(member.image);
      }
      setIsDataLoaded(true);
    }
  }, [member, isEditing, isDataLoaded]);

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        name: '',
        role: '',
        bio: '',
        image: '',
        socialLinks: {},
        order: 0,
        isActive: true,
        isFounder: false,
      });
      setImagePreview(null);
      setIsDataLoaded(false);
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && memberId) {
      refetch();
    }
  }, [memberId, isEditing, refetch]);

  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
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

      setFormData(prev => ({ ...prev, image: imageUrl }));
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
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!formData.name || !formData.role) {
    setError('Name and role are required fields.');
    setLoading(false);
    return;
  }

  try {
    // Prepare data for submission - convert order to number
    const dataToSubmit = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio || '',
      image: formData.image || '',
      socialLinks: formData.socialLinks || {},
      order: parseInt(formData.order) || 0, // ← Convert string to number
      isActive: formData.isActive,
      isFounder: formData.isFounder,
    };

    if (isEditing) {
      await updateMember.mutateAsync({ id: memberId, data: dataToSubmit });
    } else {
      await createMember.mutateAsync(dataToSubmit);
    }
    router.push('/admin/members');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to save member. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <span className="ml-3 text-gray-500">Loading member data...</span>
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
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Pastor John Adeyemi"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role *
          </label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="e.g. Music Director & Lead Vocalist"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell the story of this member..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Profile Image
          </label>
          <div className="flex flex-col items-center justify-center w-full">
            {imagePreview ? (
              <div className="relative w-full max-w-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Member preview"
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
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload photo</p>
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

        {/* Social Links */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Social Links
          </label>
          <div className="space-y-3">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    placeholder={platform.placeholder}
                    value={formData.socialLinks[platform.id] || ''}
                    onChange={(e) => handleSocialChange(platform.id, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Order & Status */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange h-5 w-5"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Member
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFounder"
              checked={formData.isFounder}
              onChange={handleChange}
              className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange h-5 w-5"
            />
            <label htmlFor="isFounder" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Founder
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => router.push('/admin/members')}
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
            <>{isEditing ? 'Update Member' : 'Create Member'}</>
          )}
        </button>
      </div>
    </form>
  );
}