'use client';

import { X, User, Calendar, FileText, Hash, Mail, Shield } from 'lucide-react';

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

export function AdminAuditLogDetail({ log, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-brand-black rounded-xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
            Log Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Action</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {actionLabels[log.action] || log.action}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Entity</p>
              <p className="font-medium text-gray-900 dark:text-white">{log.entity}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Entity ID</p>
            <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">
              <Hash className="h-4 w-4 inline mr-1 text-gray-400" />
              {log.entityId}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-brand-orange" />
                <span className="font-medium">{log.userEmail}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4 text-brand-gold" />
                <span className="font-medium">{log.userRole}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
            <p className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-brand-gold" />
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>

          {log.changes && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Changes</p>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all font-mono">
                  {typeof log.changes === 'string' 
                    ? log.changes 
                    : JSON.stringify(log.changes, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}