import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageShell } from '../components/layout/PageHeader';

const FAQS = [
  {
    q: "How much is shipping?",
    a: "Free on orders over ₹5,000. Below that, a flat ₹99 anywhere in India.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders dispatch within 24 hours and arrive in 3–6 business days, depending on your location.",
  },
  {
    q: "What's your return policy?",
    a: "Return anything within 7 days of delivery for a full refund. No questions, no restocking fees. The item should be unused and in its original packaging.",
  },
  {
    q: "How do I track my order?",
    a: "Sign in and open 'Your orders' from the account menu. Each order shows its current status, from confirmed through delivered.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cards, UPI, and netbanking at checkout. Every transaction is processed securely.",
  },
  {
    q: "Can I cancel an order?",
    a: "Yes — while it's still Pending or Confirmed. Open the order and tap Cancel; stock is restored immediately. Once it ships, cancellation isn't possible.",
  },
  {
    q: "Are the discounts real?",
    a: "Always. We don't inflate 'original' prices to fake a bargain. A strike-through price is a price the item genuinely sold at.",
  },
];
export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      eyebrow="Help"
      title="Frequently asked"
      intro="Shipping, returns, payments, and the rest — answered plainly."
    >
      <ul className="divide-y divide-line border-y border-line">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <li key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-ink">{faq.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-lg text-muted"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-sm leading-relaxed text-ink-soft">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}