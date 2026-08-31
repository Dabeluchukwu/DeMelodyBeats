'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Music2,
  Image,
  Mail,
  UserCog,
  FileText,
  LogOut,
  Shield,
  Home,
  X,
  MessageCircle,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/shows', label: 'Shows', icon: Calendar },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/releases', label: 'Releases', icon: Music2 },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
  { href: '/admin/messages', label: 'Messages', icon: MessageCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ user, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleLogout = () => {
    logout(); // This redirects to /login
    // No need for router.push here
  };

  return (
    <div className="flex flex-col h-screen w-72 bg-brand-black text-white">
      {/* Close Button - Mobile only */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors z-10"
        aria-label="Close menu"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-brand-orange" />
          <span className="font-heading text-xl font-bold">
            De <span className="text-brand-orange">Melody</span>
          </span>
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {/* Public Site Link */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 mb-4 border border-gray-800/50"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Visit Public Site</span>
        </Link>

        <div className="h-px bg-gray-800 my-2" />

        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              pathname === href
                ? 'bg-brand-orange text-brand-black'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}

        {/* Super Admin only */}
        {isSuperAdmin && (
          <>
            <div className="h-px bg-gray-800 my-2" />
            <Link
              href="/admin/users"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/admin/users'
                  ? 'bg-brand-orange text-brand-black'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <UserCog className="h-5 w-5" />
              <span className="font-medium">Users</span>
            </Link>
            <Link
              href="/admin/audit-logs"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === '/admin/audit-logs'
                  ? 'bg-brand-orange text-brand-black'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Audit Logs</span>
            </Link>
          </>
        )}
      </nav>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-800 p-4 space-y-3">
        {/* User Info */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 truncate">Logged in as</p>
          <p className="text-sm font-medium text-brand-orange truncate">
            {user?.email}
          </p>
          <p className="text-xs text-gray-500">
            Role: <span className="text-brand-gold">{user?.role}</span>
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}