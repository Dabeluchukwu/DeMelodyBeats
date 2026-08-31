"use client";

import { Calendar, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ShowFilters({ filter, onFilterChange }) {
  const filters = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'all', label: 'All Shows', icon: Sparkles },
    { id: 'past', label: 'Past Shows', icon: History },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
      {filters.map(({ id, label, icon: Icon }) => (
        <motion.button
          key={id}
          onClick={() => onFilterChange(id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2
            ${filter === id
              ? 'bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black shadow-lg shadow-brand-orange/30'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }
          `}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </motion.button>
      ))}
    </div>
  );
}