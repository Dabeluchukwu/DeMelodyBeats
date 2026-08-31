"use client";

import { useState } from "react";
import { useSubscribe } from "@/hooks/useSubscribers";
import { Mail, CheckCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 via-brand-gold/5 to-brand-orange/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-brand-gold/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4">
            Stay Updated
          </span>

          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            <span className="bg-gradient-to-r from-brand-orange to-brand-gold bg-clip-text text-transparent">
              Stay Connected
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Subscribe to our mailing list for updates on new music, shows, and community events.
          </p>

          {isSuccess && submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold font-heading text-green-700 dark:text-green-400">
                You're Subscribed! 🎉
              </h3>
              <p className="mt-2 text-green-600 dark:text-green-300">
                Thank you for subscribing! Check your email to confirm.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1">
                  <label htmlFor="firstName" className="sr-only">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mt-4">
                <div className="flex-1">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-black text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="mt-4 text-red-500 text-sm">
                  {error.response?.data?.message || 'Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}