'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMe } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Loader2, Menu } from 'lucide-react';

export function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useMe();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const isLoginPage = pathname?.includes('/login');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage && isClient) {
      router.push('/login');
    }
  }, [user, isLoading, router, isLoginPage, isClient]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-brand-black" suppressHydrationWarning>
        <Loader2 className="h-12 w-12 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-black/50" suppressHydrationWarning>
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-brand-black text-white hover:bg-gray-800 transition-colors shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="lg:ml-72 min-h-screen">
        <main className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}