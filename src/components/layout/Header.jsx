"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Music", href: "/music" },
  { name: "Shows", href: "/shows" },
  { name: "Media", href: "/media" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const isActive = (href) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-brand-black text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/demelodyLogo.png"
            alt="De Melody Beats Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-heading text-xl font-bold">
            De <span className="text-brand-orange">Melody</span> Beats
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors relative ${
                isActive(item.href)
                  ? 'text-brand-orange'
                  : 'text-gray-300 hover:text-brand-orange'
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-orange rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && (
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${
                isActive('/admin')
                  ? 'bg-brand-orange text-brand-black border-brand-orange'
                  : 'bg-brand-orange/20 text-brand-orange border-brand-orange/30 hover:bg-brand-orange/30'
              }`}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-black border-t border-brand-orange/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  isActive(item.href)
                    ? 'bg-brand-orange/20 text-brand-orange'
                    : 'text-gray-300 hover:text-brand-orange hover:bg-brand-orange/10'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-fit ${
                  isActive('/admin')
                    ? 'bg-brand-orange text-brand-black'
                    : 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}