import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MESSAGES = [
  { text: 'Free shipping on orders over ', accent: '₹5,000' },
  { text: 'New arrivals every week', accent: null },
  { text: 'Priced plainly — no hidden fees', accent: null },
];

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden bg-ink text-white"
        >
          <div className="relative mx-auto flex max-w-6xl items-center justify-center px-10 py-2 text-center text-xs">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="font-medium"
              >
                {MESSAGES[index].text}
                {MESSAGES[index].accent && (
                  <span className="price font-bold text-accent">{MESSAGES[index].accent}</span>
                )}
              </motion.span>
            </AnimatePresence>

            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition-colors hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}