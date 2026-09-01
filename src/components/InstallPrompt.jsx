'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isAppInstalled = window.navigator?.standalone || 
                           window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isAppInstalled);

    // Check device type
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
    setIsAndroid(/Android/.test(navigator.userAgent));

    // Check if user has dismissed before
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (dismissed) {
      setHasBeenDismissed(true);
      return;
    }

    // Show prompt after delay if not installed
    if (!isAppInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle Android install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android - use the native prompt
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS - show instructions
      setIsIOS(false);
      // Show a custom iOS instruction modal
      setShowIOSInstructions(true);
    }
  };

  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
    setHasBeenDismissed(true);
  };

  // Don't show if already installed or dismissed
  if (isInstalled || hasBeenDismissed || !showPrompt) return null;

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
          >
            <div className="bg-white dark:bg-brand-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 relative overflow-hidden">
              {/* Decorative gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange to-brand-gold" />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-orange/10 flex-shrink-0">
                    <Download className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                      Install De Melody Beats
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get the app for a better experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0 -mt-1"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={handleInstall}
                className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-gold text-brand-black font-semibold text-sm hover:shadow-lg hover:shadow-brand-orange/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isIOS ? 'How to Install' : 'Install App'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-brand-black rounded-2xl max-w-md w-full p-6 relative border border-gray-200 dark:border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-brand-orange/10">
                  <Smartphone className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-white">
                  Install on iPhone
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tap the Share Button</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tap the square with an arrow pointing up at the bottom of the screen
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Add to Home Screen</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Scroll down and tap <strong>"Add to Home Screen"</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tap Add</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tap <strong>"Add"</strong> in the top right corner
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSInstructions(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-brand-orange text-brand-black font-semibold text-sm hover:bg-brand-gold transition-colors"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}