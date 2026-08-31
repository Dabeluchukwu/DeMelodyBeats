'use client';

import { useState } from 'react';
import { useReplyToMessage } from '@/hooks/useMessages';
import { X, User, Mail as MailIcon, Calendar, Reply, Send, CheckCircle, Loader2 } from 'lucide-react';

export function AdminMessageDetail({ message, onClose, onReplySuccess }) {
  const [reply, setReply] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { mutate: replyToMessage, isPending, isSuccess } = useReplyToMessage();

  const handleReply = async () => {
    if (!reply.trim()) {
      alert('Please enter a reply message.');
      return;
    }

    replyToMessage(
      { id: message.id, reply: reply.trim() },
      {
        onSuccess: () => {
          setReply('');
          setShowReplyForm(false);
          if (onReplySuccess) onReplySuccess();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-brand-black rounded-xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold font-heading text-gray-900 dark:text-white">
              Message Details
            </h3>
            {!message.isRead && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-500 animate-pulse">
                New
              </span>
            )}
            {message.isReplied && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Replied
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sender Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-brand-orange" />
                <span className="font-medium">{message.name}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <div className="flex items-center gap-2 mt-1">
                <MailIcon className="h-4 w-4 text-brand-orange" />
                <a href={`mailto:${message.email}`} className="text-brand-orange hover:underline">
                  {message.email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
            <p className="font-medium mt-1">{message.subject || 'No subject'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
            <p className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-brand-gold" />
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Original Message */}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Original Message</p>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{message.message}</p>
            </div>
          </div>

          {/* Admin Reply - Show if replied */}
          {message.isReplied && (
            <div>
              <p className="text-sm font-medium text-brand-orange mb-2">Your Reply</p>
              <div className="p-4 bg-brand-orange/5 rounded-lg border border-brand-orange/30">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {message.reply || 'No reply content saved'}
                </p>
              </div>
              {message.repliedBy && (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-brand-gold" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Replied by: {message.repliedBy.name || message.repliedBy.email}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    on {new Date(message.repliedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Reply Section */}
          {showReplyForm ? (
            <div>
              <p className="text-sm font-medium text-brand-orange mb-2">Type Your Reply</p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="Type your reply here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            !message.isReplied && (
              <button
                onClick={() => setShowReplyForm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300"
              >
                <Reply className="h-4 w-4" />
                Reply to Message
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}