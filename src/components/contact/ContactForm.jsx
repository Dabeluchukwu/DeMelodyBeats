'use client';

import { useState } from 'react';
import { useSendContact } from '@/hooks/useContact';
import { Loader2, Send, CheckCircle } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutate: sendContact, isPending, error } = useSendContact();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendContact(formData, {
      onSuccess: () => {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      },
    });
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 text-center border border-green-200 dark:border-green-800">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold font-heading text-green-700 dark:text-green-400 mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-brand-orange hover:text-brand-gold transition-colors font-medium"
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Booking inquiry, collaboration, etc."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Tell us how we can help..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">
            {error.response?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}