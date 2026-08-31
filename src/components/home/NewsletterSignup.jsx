'use client';

import { useState } from "react";
import { useSubscribe } from "@/hooks/useSubscribers";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate: subscribe, isPending, error, isSuccess } = useSubscribe();

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribe(
      { email, firstName },
      {
        onSuccess: () => {
          setSubmitted(true);
          setEmail("");
          setFirstName("");
        },
      }
    );
  };

  return (
    <section className="py-16 bg-gradient-to-r from-brand-orange/10 to-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Stay Connected
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Subscribe to our mailing list for updates on new music, shows, and community events.
          </p>

          {isSuccess && submitted ? (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
              <p className="mt-2 text-green-700 dark:text-green-300 font-medium">
                Thank you for subscribing! Check your email to confirm.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="sr-only">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-brand-orange text-brand-black hover:bg-brand-gold transition-all duration-300 px-6 py-3"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error.response?.data?.message || 'Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}