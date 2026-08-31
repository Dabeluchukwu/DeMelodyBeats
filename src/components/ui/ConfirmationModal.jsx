'use client';

import { useEffect } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      confirmBg: 'bg-red-500 hover:bg-red-600',
      borderColor: 'border-red-500/20',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
      confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
      borderColor: 'border-yellow-500/20',
    },
    info: {
      icon: AlertTriangle,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
      borderColor: 'border-blue-500/20',
    },
  };

  const Icon = variantStyles[variant].icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-brand-black rounded-xl max-w-md w-full max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${variantStyles[variant].iconBg}`}>
              <Icon className={`h-5 w-5 ${variantStyles[variant].iconColor}`} />
            </div>
            <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-brand-black/30 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition-all duration-300 flex items-center gap-2 ${variantStyles[variant].confirmBg} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}