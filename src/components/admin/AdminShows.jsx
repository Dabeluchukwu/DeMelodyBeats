'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useShows, useDeleteShow, useBulkDeleteShows } from '@/hooks/useShows';
import { Loader2, Plus, Edit, Trash2, Calendar, MapPin, ExternalLink, Image as ImageIcon, Check, Trash } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export function AdminShows() {
  const { data: shows, isLoading, error } = useShows();
  const deleteShow = useDeleteShow();
  const bulkDeleteShows = useBulkDeleteShows();
  const [deletingId, setDeletingId] = useState(null);
  const [selectedShows, setSelectedShows] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'single' | 'bulk'
    showId: null,
    showTitle: '',
    count: 0,
  });

  // Use pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedShows,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(shows || [], 10); // 10 items per page

  const handleDeleteClick = (id, title) => {
    setModalState({
      isOpen: true,
      type: 'single',
      showId: id,
      showTitle: title,
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedShows.length === 0) {
      alert('Please select at least one show to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: 'bulk',
      showId: null,
      showTitle: '',
      count: selectedShows.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'single') {
      setDeletingId(modalState.showId);
      try {
        await deleteShow.mutateAsync(modalState.showId);
      } catch (error) {
        alert('Failed to delete show. Please try again.');
      }
      setDeletingId(null);
    } else if (modalState.type === 'bulk') {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteShows.mutateAsync(selectedShows);
        setSelectedShows([]);
      } catch (error) {
        alert('Failed to delete shows. Please try again.');
      }
      setIsBulkDeleting(false);
    }
    setModalState({ isOpen: false, type: null, showId: null, showTitle: '', count: 0 });
  };

  const handleSelectShow = (id) => {
    setSelectedShows(prev => {
      if (prev.includes(id)) {
        return prev.filter(showId => showId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedShows.length === paginatedShows?.length) {
      setSelectedShows([]);
    } else {
      setSelectedShows(paginatedShows?.map(show => show.id) || []);
    }
  };

  // Get modal content based on type
  const getModalContent = () => {
    if (modalState.type === 'single') {
      return {
        title: 'Delete Show',
        message: `Are you sure you want to delete "${modalState.showTitle}"? This action cannot be undone.`,
        confirmText: 'Delete Show',
      };
    } else if (modalState.type === 'bulk') {
      return {
        title: `Delete ${modalState.count} Shows`,
        message: `Are you sure you want to delete ${modalState.count} selected show(s)? This action cannot be undone.`,
        confirmText: `Delete ${modalState.count} Shows`,
      };
    }
    return {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      confirmText: 'Delete',
    };
  };

  const modalContent = getModalContent();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400">Failed to load shows</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Shows</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your upcoming and past events
            {shows && shows.length > 0 && (
              <span className="ml-2 text-brand-orange font-semibold">
                ({shows.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedShows.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              {isBulkDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
              Delete Selected ({selectedShows.length})
            </button>
          )}
          <Link
            href="/admin/shows/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Show
          </Link>
        </div>
      </div>

      {!shows || shows.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shows yet. Create your first show!</p>
          <Link
            href="/admin/shows/new"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            Add Show
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-brand-black/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-brand-black/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedShows.length === paginatedShows?.length && paginatedShows?.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tickets</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedShows.map((show) => (
                    <tr key={show.id} className="hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedShows.includes(show.id)}
                          onChange={() => handleSelectShow(show.id)}
                          className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {show.posterImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={show.posterImage}
                            alt={show.title}
                            className="h-10 w-10 rounded object-cover bg-gray-100 dark:bg-gray-800"
                            onError={(e) => {
                              e.target.src = '';
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {show.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {show.venue}, {show.city}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {new Date(show.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          show.isPast 
                            ? 'bg-gray-500/20 text-gray-500' 
                            : 'bg-green-500/20 text-green-500'
                        }`}>
                          {show.isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {show.ticketUrl && show.ticketUrl !== '#' ? (
                          <a
                            href={show.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-orange hover:text-brand-gold transition-colors inline-flex items-center gap-1 text-sm"
                          >
                            Tickets <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/shows/${show.id}`}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </Link>
                          {!show.isPast && (
                            <Link
                              href={`/admin/shows/${show.id}/edit`}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Edit className="h-4 w-4 text-brand-orange" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDeleteClick(show.id, show.title)}
                            disabled={deletingId === show.id}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            {deletingId === show.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedShows.map((show) => (
                <div key={show.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedShows.includes(show.id)}
                      onChange={() => handleSelectShow(show.id)}
                      className="mt-1 rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                    />
                    {show.posterImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={show.posterImage}
                        alt={show.title}
                        className="h-14 w-14 rounded object-cover bg-gray-100 dark:bg-gray-800 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-brand-orange text-lg truncate">{show.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{show.venue}, {show.city}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                      show.isPast 
                        ? 'bg-gray-500/20 text-gray-500' 
                        : 'bg-green-500/20 text-green-500'
                    }`}>
                      {show.isPast ? 'Past' : 'Upcoming'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-brand-gold flex-shrink-0" />
                      {new Date(show.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <Link
                      href={`/admin/shows/${show.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      View
                    </Link>
                    {!show.isPast && (
                      <Link
                        href={`/admin/shows/${show.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteClick(show.id, show.title)}
                      disabled={deletingId === show.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm text-red-500 disabled:opacity-50"
                    >
                      {deletingId === show.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Pagination - Fixed: Now inside the fragment */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, showId: null, showTitle: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        cancelText="Cancel"
        variant="danger"
        isLoading={modalState.type === 'single' ? deletingId !== null : isBulkDeleting}
      />
    </div>
  );
}