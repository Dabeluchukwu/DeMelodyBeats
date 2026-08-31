import Link from "next/link";
import { MUSIC_LINKS, SOCIAL_LINKS, BRAND } from "@/lib/constants";

export function Hero() {
  return (
    <section className="bg-brand-black text-white min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <p className="text-brand-orange font-heading text-sm md:text-base uppercase tracking-widest mb-4 fire-glow">
            De Melody Beats
          </p>

          {/* Main Title */}
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
            <span>More Than </span>
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Music
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            {BRAND.description}
          </p>

          {/* Mission Statement */}
          <p className="mt-4 text-brand-gold font-heading text-md md:text-lg italic">
            "{BRAND.mission}"
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-brand-orange text-brand-black hover:bg-brand-gold"
            >
              Subscribe on YouTube
            </a>
            <Link
              href="/music"
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black"
            >
              Listen Now
            </Link>
          </div>

          {/* Social Icons */}
          <div className="mt-8 flex justify-center gap-6">
            <SocialIcon href={SOCIAL_LINKS.youtube} label="YouTube">
              <YouTubeIcon />
            </SocialIcon>
            <SocialIcon href={SOCIAL_LINKS.instagram} label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon href={SOCIAL_LINKS.facebook} label="Facebook">
              <FacebookIcon />
            </SocialIcon>
          </div>
        </div>
      </div>
    </section>
  );
}

// Social Icon Helper Components
function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-brand-orange transition-colors"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function YouTubeIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}