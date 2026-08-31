import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import {
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";
import { SOCIAL_LINKS, CONTACT, BRAND } from "@/lib/constants";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Music", href: "/music" },
  { name: "Shows", href: "/shows" },
  { name: "Media", href: "/media" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white border-t border-brand-orange/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* Replace the src with your actual logo path */}
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
            <p className="text-gray-400 text-sm max-w-md">
              {BRAND.description}
            </p>
            <p className="text-brand-gold text-sm mt-2 font-heading">
              "{BRAND.slogan}"
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-brand-orange">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-brand-orange transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-brand-orange">
              Connect With Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-brand-gold" />
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-brand-orange transition-colors"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-brand-gold" />
                {CONTACT.location}
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-orange/20 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            © {currentYear} De Melody Beats. All rights reserved.{" "}
            <span className="text-brand-gold">More Than Music</span>
          </p>
        </div>
      </div>
    </footer>
  );
}