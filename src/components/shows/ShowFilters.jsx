import { Calendar, History } from 'lucide-react';

export function ShowFilters({ filter, onFilterChange }) {
  const filters = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'all', label: 'All Shows', icon: null },
    { id: 'past', label: 'Past Shows', icon: History },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-10">
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onFilterChange(id)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2
            ${filter === id
              ? 'bg-brand-orange text-brand-black hover:bg-brand-gold'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }
          `}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </button>
      ))}
    </div>
  );
}