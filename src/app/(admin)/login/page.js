'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    login(formData, {
      onSuccess: () => {
        // The redirect is now handled in the useLogin onSuccess
        // No need to redirect here
      },
      onError: (err) => {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-brand-black">
      <div className="bg-white dark:bg-brand-black/50 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Replace the src with your actual logo path */}
            <Image
              src="/images/demelodyLogo.png"
              alt="De Melody Beats Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-heading text-2xl font-bold">
              De <span className="text-brand-orange">Melody</span> Beats
            </span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-brand-orange">Admin Login</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to manage your content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@demelodybeats.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}