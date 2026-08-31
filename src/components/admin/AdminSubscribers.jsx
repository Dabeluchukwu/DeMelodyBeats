'use client';

import { useState, useMemo } from 'react';
import { useSubscribers, useDeleteSubscriber, useBulkDeleteSubscribers } from '@/hooks/useSubscribers';
import { AdminSubscriberStats } from './AdminSubscriberStats';
import { Loader2, Mail, CheckCircle, XCircle, Trash2, Search, X, Download, Calendar } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export function AdminSubscribers() {
  const { data: subscribers, isLoading, error } = useSubscribers();
  const deleteSubscriber = useDeleteSubscriber();
  const bulkDeleteSubscribers = useBulkDeleteSubscribers();
  const [deletingId, setDeletingId] = useState(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, unverified
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    subscriberId: null,
    subscriberEmail: '',
    count: 0,
  });

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];

    let filtered = [...subscribers];

    // Apply status filter
    if (filterStatus === 'verified') {
      filtered = filtered.filter(sub => sub.verified === true);
    } else if (filterStatus === 'unverified') {
      filtered = filtered.filter(sub => sub.verified === false);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(sub =>
        sub.email.toLowerCase().includes(query) ||
        (sub.firstName && sub.firstName.toLowerCase().includes(query)) ||
        (sub.city && sub.city.toLowerCase().includes(query)) ||
        (sub.country && sub.country.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [subscribers, filterStatus, searchQuery]);

  // Use pagination on filtered results
  const {
    currentPage,
    totalPages,
    currentItems: paginatedSubscribers,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredSubscribers, 20); // 20 items per page

  const handleDeleteClick = (id, email) => {
    setModalState({
      isOpen: true,
      type: 'single',
      subscriberId: id,
      subscriberEmail: email,
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedSubscribers.length === 0) {
      alert('Please select at least one subscriber to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: 'bulk',
      subscriberId: null,
      subscriberEmail: '',
      count: selectedSubscribers.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'single') {
      setDeletingId(modalState.subscriberId);
      try {
        await deleteSubscriber.mutateAsync(modalState.subscriberId);
      } catch (error) {
        alert('Failed to delete subscriber. Please try again.');
      }
      setDeletingId(null);
    } else if (modalState.type === 'bulk') {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteSubscribers.mutateAsync(selectedSubscribers);
        setSelectedSubscribers([]);
      } catch (error) {
        alert('Failed to delete subscribers. Please try again.');
      }
      setIsBulkDeleting(false);
    }
    setModalState({ isOpen: false, type: null, subscriberId: null, subscriberEmail: '', count: 0 });
  };

  const handleSelectSubscriber = (id) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === paginatedSubscribers?.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(paginatedSubscribers?.map(sub => sub.id) || []);
    }
  };

  const getStatusCount = (status) => {
    if (!subscribers) return 0;
    if (status === 'all') return subscribers.length;
    if (status === 'verified') return subscribers.filter(sub => sub.verified === true).length;
    if (status === 'unverified') return subscribers.filter(sub => sub.verified === false).length;
    return 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400">Failed to load subscribers</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Subscribers</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your mailing list subscribers
            {subscribers && subscribers.length > 0 && (
              <span className="ml-2 text-brand-orange font-semibold">
                ({subscribers.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedSubscribers.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedSubscribers.length})
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <AdminSubscriberStats />

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              filterStatus === 'all'
                ? 'bg-brand-orange text-brand-black'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All ({getStatusCount('all')})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              filterStatus === 'verified'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Verified ({getStatusCount('verified')})
          </button>
          <button
            onClick={() => setFilterStatus('unverified')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              filterStatus === 'unverified'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Unverified ({getStatusCount('unverified')})
          </button>
        </div>

        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {paginatedSubscribers.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {paginatedSubscribers.length} {paginatedSubscribers.length === 1 ? 'subscriber' : 'subscribers'}
          {filterStatus !== 'all' && ` (${filterStatus})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Subscribers Table */}
      {!paginatedSubscribers || paginatedSubscribers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery || filterStatus !== 'all'
              ? 'No subscribers found matching your filters'
              : 'No subscribers yet. Start building your mailing list!'
            }
          </p>
          {(searchQuery || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="mt-4 text-brand-orange hover:text-brand-gold transition-colors text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-black/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-brand-black/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.length === paginatedSubscribers?.length && paginatedSubscribers?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => handleSelectSubscriber(subscriber.id)}
                        className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {subscriber.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {subscriber.firstName || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {subscriber.city && subscriber.country 
                        ? `${subscriber.city}, ${subscriber.country}`
                        : subscriber.city || subscriber.country || '—'
                      }
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        subscriber.verified
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {subscriber.verified ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteClick(subscriber.id, subscriber.email)}
                        disabled={deletingId === subscriber.id}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        {deletingId === subscriber.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, subscriberId: null, subscriberEmail: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={
          modalState.type === 'bulk'
            ? `Delete ${modalState.count} Subscribers`
            : `Delete "${modalState.subscriberEmail}"`
        }
        message={
          modalState.type === 'bulk'
            ? `Are you sure you want to delete ${modalState.count} selected subscriber(s)? This action cannot be undone.`
            : `Are you sure you want to delete "${modalState.subscriberEmail}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={modalState.type === 'single' ? deletingId !== null : isBulkDeleting}
      />
    </div>
  );
}