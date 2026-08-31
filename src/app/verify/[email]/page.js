'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, Music2 } from 'lucide-react';

export default function VerifyPage() {
  const params = useParams();
  const email = params?.email;
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) return;

    const verifyEmail = async () => {
      try {
        // Decode the email from the URL
        const decodedEmail = decodeURIComponent(email);
        console.log('Verifying email:', decodedEmail);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/subscribers/verify/${encodeURIComponent(decodedEmail)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
      }
    };

    verifyEmail();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-black px-4">
      <div className="bg-white dark:bg-brand-black/50 rounded-xl max-w-md w-full p-8 shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Music2 className="h-8 w-8 text-brand-orange" />
          <span className="font-heading text-2xl font-bold">
            De <span className="text-brand-orange">Melody</span> Beats
          </span>
        </div>

        {status === 'loading' && (
          <div className="py-8">
            <Loader2 className="h-12 w-12 animate-spin text-brand-orange mx-auto mb-4" />
            <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-white mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we confirm your subscription.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2">
              Email Verified! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-block w-full px-6 py-3 rounded-lg bg-brand-orange text-brand-black font-semibold hover:bg-brand-gold transition-all duration-300"
              >
                Go to Homepage
              </Link>
              <Link
                href="/music"
                className="inline-block w-full px-6 py-3 rounded-lg border border-brand-orange text-brand-orange font-semibold hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
              >
                Explore Our Music
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-block w-full px-6 py-3 rounded-lg bg-brand-orange text-brand-black font-semibold hover:bg-brand-gold transition-all duration-300"
              >
                Go to Homepage
              </Link>
              <Link
                href="/contact"
                className="inline-block w-full px-6 py-3 rounded-lg border border-brand-orange text-brand-orange font-semibold hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}