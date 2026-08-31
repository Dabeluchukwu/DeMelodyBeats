'use client';

import { useState, useMemo } from 'react';
import { useAuditLogs } from '@/hooks/useAuth';
import { Loader2, Search, X, Calendar, Eye, FileText, User, Shield } from 'lucide-react';
import { AdminAuditLogDetail } from './AdminAuditLogDetail';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';

const actionColors = {
  CREATE: 'bg-green-500/20 text-green-500',
  UPDATE: 'bg-blue-500/20 text-blue-500',
  DELETE: 'bg-red-500/20 text-red-500',
  BULK_DELETE: 'bg-red-500/20 text-red-500',
  LOGIN: 'bg-purple-500/20 text-purple-500',
  UPDATE_ROLE: 'bg-yellow-500/20 text-yellow-500',
  UPDATE_PROFILE: 'bg-cyan-500/20 text-cyan-500',
  CHANGE_PASSWORD: 'bg-orange-500/20 text-orange-500',
};

const actionLabels = {
  CREATE: 'Created',
  UPDATE: 'Updated',
  DELETE: 'Deleted',
  BULK_DELETE: 'Bulk Deleted',
  LOGIN: 'Logged In',
  UPDATE_ROLE: 'Role Changed',
  UPDATE_PROFILE: 'Profile Updated',
  CHANGE_PASSWORD: 'Password Changed',
};

const entityColors = {
  Show: 'bg-brand-orange/20 text-brand-orange',
  Member: 'bg-purple-500/20 text-purple-500',
  Release: 'bg-pink-500/20 text-pink-500',
  User: 'bg-cyan-500/20 text-cyan-500',
  Photo: 'bg-indigo-500/20 text-indigo-500',
  Video: 'bg-red-500/20 text-red-500',
  Subscriber: 'bg-emerald-500/20 text-emerald-500',
  Message: 'bg-yellow-500/20 text-yellow-500',
};

const actionOptions = [
  { value: 'all', label: 'All Actions' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'BULK_DELETE', label: 'Bulk Delete' },
  { value: 'LOGIN', label: 'Login' },
  { value: 'UPDATE_ROLE', label: 'Role Change' },
  { value: 'UPDATE_PROFILE', label: 'Profile Update' },
  { value: 'CHANGE_PASSWORD', label: 'Password Change' },
];

const entityOptions = [
  { value: 'all', label: 'All Entities' },
  { value: 'Show', label: 'Shows' },
  { value: 'Member', label: 'Members' },
  { value: 'Release', label: 'Releases' },
  { value: 'User', label: 'Users' },
  { value: 'Photo', label: 'Photos' },
  { value: 'Video', label: 'Videos' },
  { value: 'Subscriber', label: 'Subscribers' },
  { value: 'Message', label: 'Messages' },
];

export function AdminAuditLogs() {
  const { data: logs, isLoading, error } = useAuditLogs();
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  // Filter logs
  const filteredLogs = useMemo(() => {
    if (!logs) return [];

    let filtered = [...logs];

    // Apply action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Apply entity filter
    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entity === entityFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(log =>
        log.userEmail.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [logs, actionFilter, entityFilter, searchQuery]);

  // Use pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedLogs,
    goToPage,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredLogs, 20); // 20 items per page

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">You need Super Admin access to view audit logs.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-orange">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track all activities across the admin panel
            {logs && logs.length > 0 && (
              <span className="ml-2 text-brand-orange font-semibold">
                ({logs.length} total)
              </span>
            )}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {paginatedLogs.length} of {totalItems} logs
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          >
            {actionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          >
            {entityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
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
      {paginatedLogs.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {paginatedLogs.length} {paginatedLogs.length === 1 ? 'log' : 'logs'}
          {actionFilter !== 'all' && ` (${actionFilter})`}
          {entityFilter !== 'all' && ` for ${entityFilter}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Logs Table */}
      {!paginatedLogs || paginatedLogs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-black/50 rounded-xl border border-gray-200 dark:border-gray-800">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery || actionFilter !== 'all' || entityFilter !== 'all'
              ? 'No logs found matching your filters'
              : 'No audit logs available yet.'}
          </p>
          {(searchQuery || actionFilter !== 'all' || entityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActionFilter('all');
                setEntityFilter('all');
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-brand-black/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${actionColors[log.action] || 'bg-gray-500/20 text-gray-500'}`}>
                        {actionLabels[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entityColors[log.entity] || 'bg-gray-500/20 text-gray-500'}`}>
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">{log.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Eye className="h-4 w-4 text-brand-orange" />
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

      {/* Log Detail Modal */}
      {selectedLog && (
        <AdminAuditLogDetail
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}