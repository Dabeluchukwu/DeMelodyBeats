'use client';

import { useState, useMemo } from 'react';
import { useMessages, useDeleteMessage, useBulkDeleteMessages, useUnreadCount } from '@/hooks/useMessages';
import { Loader2, Mail, Trash2, Eye, Reply, CheckCircle, XCircle, Search, X, Calendar, User, Mail as MailIcon } from 'lucide-react';
import { AdminMessageDetail } from './AdminMessageDetail';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export function AdminMessages() {
  const { data: messages, isLoading, error } = useMessages();
  const { data: unreadCount } = useUnreadCount();
  const deleteMessage = useDeleteMessage();
  const bulkDeleteMessages = useBulkDeleteMessages();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, unread, read, replied
  const [deletingId, setDeletingId] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    messageId: null,
    messageSubject: '',
    count: 0,
  });

  // Filter messages
  const filteredMessages = useMemo(() => {
    if (!messages) return [];

    let filtered = [...messages];

    // Apply status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(msg => !msg.isRead);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(msg => msg.isRead && !msg.isReplied);
    } else if (filterStatus === 'replied') {
      filtered = filtered.filter(msg => msg.isReplied);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        (msg.subject && msg.subject.toLowerCase().includes(query)) ||
        msg.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [messages, filterStatus, searchQuery]);

  // Use pagination on filtered results
  const {
    currentPage,
    totalPages,
    currentItems: paginatedMessages,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredMessages, 15); // 15 items per page

  const handleDeleteClick = (id, subject) => {
    setModalState({
      isOpen: true,
      type: 'single',
      messageId: id,
      messageSubject: subject || 'Untitled',
      count: 0,
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedMessages.length === 0) {
      alert('Please select at least one message to delete.');
      return;
    }
    setModalState({
      isOpen: true,
      type: 'bulk',
      messageId: null,
      messageSubject: '',
      count: selectedMessages.length,
    });
  };

  const handleConfirmDelete = async () => {
    if (modalState.type === 'single') {
      setDeletingId(modalState.messageId);
      try {
        await deleteMessage.mutateAsync(modalState.messageId);
      } catch (error) {
        alert('Failed to delete message. Please try again.');
      }
      setDeletingId(null);
    } else if (modalState.type === 'bulk') {
      setIsBulkDeleting(true);
      try {
        await bulkDeleteMessages.mutateAsync(selectedMessages);
        setSelectedMessages([]);
      } catch (error) {
        alert('Failed to delete messages. Please try again.');
      }
      setIsBulkDeleting(false);
    }
    setModalState({ isOpen: false, type: null, messageId: null, messageSubject: '', count: 0 });
  };

  const handleSelectMessage = (id) => {
    setSelectedMessages(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === paginatedMessages?.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(paginatedMessages?.map(msg => msg.id) || []);
    }
  };

  const getStatusCount = (status) => {
    if (!messages) return 0;
    if (status === 'all') return messages.length;
    if (status === 'unread') return messages.filter(msg => !msg.isRead).length;
    if (status === 'read') return messages.filter(msg => msg.isRead && !msg.isReplied).length;
    if (status === 'replied') return messages.filter(msg => msg.isReplied).length;
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
    return <p className="text-red-400">Failed to load messages</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Messages</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            View and reply to messages from your fans
            {messages && messages.length > 0 && (
              <span className="ml-2 text-brand-orange font-semibold">
                ({messages.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {selectedMessages.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              disabled={isBulkDeleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedMessages.length})
            </button>
          )}
        </div>
      </div>

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
            onClick={() => setFilterStatus('unread')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              filterStatus === 'unread'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Unread ({getStatusCount('unread')})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              filterStatus === 'read'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Read ({getStatusCount('read')})
          </button>
          <button
            onClick={() => setFilterStatus('replied')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              filterStatus === 'replied'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Replied ({getStatusCount('replied')})
          </button>
        </div>

        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
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
      {paginatedMessages.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {paginatedMessages.length} {paginatedMessages.length === 1 ? 'message' : 'messages'}
          {filterStatus !== 'all' && ` (${filterStatus})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Messages Table */}
      {!paginatedMessages || paginatedMessages.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery || filterStatus !== 'all'
              ? 'No messages found matching your filters'
              : 'No messages yet. Messages from your contact form will appear here.'
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
                      checked={selectedMessages.length === paginatedMessages?.length && paginatedMessages?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors ${!message.isRead ? 'bg-brand-orange/5' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={() => handleSelectMessage(message.id)}
                        className="rounded border-gray-300 dark:border-gray-700 text-brand-orange focus:ring-brand-orange"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!message.isRead ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-500">
                          <MailIcon className="h-3 w-3" />
                          New
                        </span>
                      ) : message.isReplied ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
                          <CheckCircle className="h-3 w-3" />
                          Replied
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-500">
                          <Eye className="h-3 w-3" />
                          Read
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{message.name}</p>
                        <p className="text-xs text-gray-500">{message.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {message.subject || 'No subject'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-brand-orange" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(message.id, message.subject)}
                          disabled={deletingId === message.id}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          {deletingId === message.id ? (
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <AdminMessageDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReplySuccess={() => {
            setSelectedMessage(null);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null, messageId: null, messageSubject: '', count: 0 })}
        onConfirm={handleConfirmDelete}
        title={
          modalState.type === 'bulk'
            ? `Delete ${modalState.count} Messages`
            : `Delete "${modalState.messageSubject}"`
        }
        message={
          modalState.type === 'bulk'
            ? `Are you sure you want to delete ${modalState.count} selected message(s)? This action cannot be undone.`
            : `Are you sure you want to delete this message from "${modalState.messageSubject}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={modalState.type === 'single' ? deletingId !== null : isBulkDeleting}
      />
    </div>
  );
}