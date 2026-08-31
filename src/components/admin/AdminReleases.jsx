'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useReleases, useDeleteRelease, useBulkDeleteReleases } from '@/hooks/useReleases';
import { Loader2, Plus, Edit, Trash2, Calendar, Music2, Image as ImageIcon } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export function AdminReleases() {
  const { data: releases, isLoading, error } = useReleases();
  const deleteRelease = useDeleteRelease();
  const bulkDeleteReleases = useBulkDeleteReleases();
  const [deletingId, setDeletingId] = useState(null);
  const [selectedReleases, setSelectedReleases] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    releaseId: null,
    releaseTitle: '',
    count: 0,
  });

  // Use pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedReleases,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(releases || [], 10); // 10 items per page

  const handleDeleteClick = (id, title) => {
    setModalState({
      isOpen: true,
      type: 'single',
      releaseId: id,
      releaseTitle: title,
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedReleases.length === 0) {
      alert('Please select at least one release to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: 'bulk',
      releaseId: null,
      releaseTitle: '',
      count: selectedReleases.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'single') {
      setDeletingId(modalState.releaseId);
      try {
        await deleteRelease.mutateAsync(modalState.releaseId);
      } catch (error) {
        alert('Failed to delete release. Please try again.');
      }
      setDeletingId(null);
    } else if (modalState.type === 'bulk') {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteReleases.mutateAsync(selectedReleases);
        setSelectedReleases([]);
      } catch (error) {
        alert('Failed to delete releases. Please try again.');
      }
      setIsBulkDeleting(false);
    }
    setModalState({ isOpen: false, type: null, releaseId: null, releaseTitle: '', count: 0 });
  };

  const handleSelectRelease = (id) => {
    setSelectedReleases(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedReleases.length === paginatedReleases?.length) {
      setSelectedReleases([]);
    } else {
      setSelectedReleases(paginatedReleases?.map(r => r.id) || []);
    }
  };

  const getModalContent = () => {
    if (modalState.type === 'single') {
      return {
        title: 'Delete Release',
        message: `Are you sure you want to delete "${modalState.releaseTitle}"? This action cannot be undone.`,
        confirmText: 'Delete Release',
      };
    } else if (modalState.type === 'bulk') {
      return {
        title: `Delete ${modalState.count} Releases`,
        message: `Are you sure you want to delete ${modalState.count} selected release(s)? This action cannot be undone.`,
        confirmText: `Delete ${modalState.count} Releases`,
      };
    }
    return { title: 'Confirm Delete', message: 'Are you sure?', confirmText: 'Delete' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400">Failed to load releases</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Releases</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your music releases
            {releases && releases.length > 0 && (
              <span className="ml-2 text-brand-orange font-semibold">
                ({releases.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedReleases.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedReleases.length})
            </button>
          )}
          <Link
            href="/admin/releases/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Add Release
          </Link>
        </div>
      </div>

      {!releases || releases.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <Music2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No releases yet. Create your first release!</p>
          <Link
            href="/admin/releases/new"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
          >
            Add Release
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-brand-black/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-brand-black/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedReleases.length === paginatedReleases?.length && paginatedReleases?.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cover</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {paginatedReleases.map((release) => (
                    <tr key={release.id} className="hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedReleases.includes(release.id)}
                          onChange={() => handleSelectRelease(release.id)}
                          className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {release.coverArt ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={release.coverArt}
                            alt={release.title}
                            className="h-10 w-10 rounded object-cover bg-gray-100 dark:bg-gray-800"
                            onError={(e) => { e.target.src = ''; e.target.onerror = null; }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <Music2 className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {release.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          release.type === 'ALBUM' ? 'bg-purple-500/20 text-purple-500' :
                          release.type === 'EP' ? 'bg-brand-gold/20 text-brand-gold' :
                          'bg-brand-orange/20 text-brand-orange'
                        }`}>
                          {release.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {new Date(release.releaseDate).getFullYear()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/releases/${release.id}`}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Music2 className="h-4 w-4 text-gray-500" />
                          </Link>
                          <Link
                            href={`/admin/releases/${release.id}/edit`}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Edit className="h-4 w-4 text-brand-orange" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(release.id, release.title)}
                            disabled={deletingId === release.id}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            {deletingId === release.id ? (
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
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, releaseId: null, releaseTitle: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={getModalContent().title}
        message={getModalContent().message}
        confirmText={getModalContent().confirmText}
        cancelText="Cancel"
        variant="danger"
        isLoading={modalState.type === 'single' ? deletingId !== null : isBulkDeleting}
      />
    </div>
  );
}