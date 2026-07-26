import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useCanReview, useReviewSummary, useReviews } from '../../features/reviews/useReviews';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { Stars } from '../ui/Stars';
import { ReviewForm } from '../products/ReviewForm';


export function ReviewList({ productId }: { productId: string }) {
  const { data: summary, isLoading: summaryLoading } = useReviewSummary(productId);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(productId);
  const { data: canReview } = useCanReview(productId);
  const [formOpen, setFormOpen] = useState(false);

  if (summaryLoading) return <Skeleton className="h-40 w-full" />;

  const total = summary?.totalReviews ?? 0;

  return (
    <section className="mt-12 border-t border-line pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold uppercase tracking-tight text-ink">
          Ratings &amp; reviews
        </h2>

        {canReview && !formOpen && (
          <Button onClick={() => setFormOpen(true)}>Write a review</Button>
        )}
      </div>

      {/* inline form for eligible buyers */}
     {/* inline form for eligible buyers */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-lg border border-line bg-subtle p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink">
                  Write your review
                </p>
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-[11px] font-bold uppercase tracking-wide text-muted hover:text-ink"
                >
                  Close
                </button>
              </div>
              <ReviewForm productId={productId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {total === 0 ? (
        <p className="mt-5 text-sm text-muted">
          {canReview
            ? 'No reviews yet — you bought this, so you can be the first.'
            : 'No reviews yet. Buy this and you can be the first.'}
        </p>
      ) : (
        <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Distribution */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="price text-4xl font-bold text-ink">
                {summary!.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted">/ 5</span>
            </div>

            <Stars rating={summary!.averageRating} size="md" />

            <p className="price mt-1 text-xs text-muted">
              {total} {total === 1 ? 'review' : 'reviews'}
            </p>

            <ul className="mt-5 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary!.ratingDistribution[String(star)] ?? 0;
                const percent = total > 0 ? (count / total) * 100 : 0;

                return (
                  <li key={star} className="flex items-center gap-2.5">
                    <span className="price w-3 text-xs text-muted">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-accent"
                      />
                    </div>
                    <span className="price w-6 text-right text-xs text-muted">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {reviewsLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}

            {reviews?.items.map((review) => (
              <article key={review.id} className="border-b border-line pb-6 last:border-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars rating={review.rating} />
                  <h3 className="text-sm font-semibold text-ink">{review.title}</h3>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{review.comment}</p>

                <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-medium text-ink-soft">{review.userName}</span>
                  {review.isVerifiedPurchase && (
                    <span className="price rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                      ✓ Verified purchase
                    </span>
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}