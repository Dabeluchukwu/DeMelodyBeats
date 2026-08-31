'use client';

import { useState, useEffect } from 'react';
import { useMe, useChangePassword, useUpdateProfile } from '@/hooks/useAuth';
import { Loader2, User, Mail, Shield, Key, CheckCircle, AlertCircle, Eye, EyeOff, Edit2, Save, X } from 'lucide-react';

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
};

const roleColors = {
  SUPER_ADMIN: 'bg-purple-500/20 text-purple-500',
  ADMIN: 'bg-brand-orange/20 text-brand-orange',
  EDITOR: 'bg-blue-500/20 text-blue-500',
};

export function AdminSettings() {
  const { data: user, isLoading, refetch } = useMe();
  const changePassword = useChangePassword();
  const updateProfile = useUpdateProfile();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Set initial name when user loads
  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError('');
    setSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All password fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setIsSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      
      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      await updateProfile.mutateAsync({ name: newName.trim() });
      await refetch();
      setIsEditingName(false);
      setSuccess('Name updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Failed to load user information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-bold font-heading text-gray-900 dark:text-white mb-4">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name - Editable */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <div className="flex items-center gap-2 mt-1">
              <User className="h-4 w-4 text-brand-orange flex-shrink-0" />
              {isEditingName ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <button
                    onClick={handleNameUpdate}
                    disabled={updateProfile.isPending}
                    className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(user.name || '');
                    }}
                    className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{user.name || 'Not set'}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-brand-orange"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Email - Read-only */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-brand-orange flex-shrink-0" />
              <span className="font-medium">{user.email}</span>
              <span className="text-xs text-gray-400">(Cannot be changed)</span>
            </div>
          </div>

          {/* Role */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="h-4 w-4 text-brand-orange flex-shrink-0" />
              <span className={`px-2 py-1 rounded text-sm font-medium ${roleColors[user.role]}`}>
                {roleLabels[user.role] || user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Success/Error messages for profile update */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
        {success && !success.includes('Password') && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-brand-orange" />
          <h2 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
            Change Password
          </h2>
        </div>

        {error && error.includes('password') && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && success.includes('Password') && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter your current password"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}