import { PageShell, Prose, Section } from '../components/layout/PageHeader';

export default function ShippingReturnsPage() {
  return (
    <PageShell
      eyebrow="Policy"
      title="Shipping & returns"
      intro="Straightforward terms, the same as everything else here."
    >
      <Prose>
        <Section title="Shipping">
          <p>Free shipping on orders over ₹5,000. A flat ₹99 applies below that, anywhere in India.</p>
          <p>Orders are dispatched within 24 hours on business days. Delivery typically takes 3–6 business days depending on your location.</p>
        </Section>

        <Section title="Returns">
          <p>Return any item within 7 days of delivery for a full refund — no questions and no restocking fees.</p>
          <p>Items should be unused and in their original packaging. Once we receive and check the return, your refund is issued to the original payment method within 5–7 business days.</p>
        </Section>

        <Section title="Cancellations">
          <p>You can cancel an order while it's still Pending or Confirmed, straight from the order page. Stock is restored immediately. After an order ships, it can't be cancelled — but you can still return it once it arrives.</p>
        </Section>

        <Section title="Damaged or wrong items">
          <p>If something arrives damaged or isn't what you ordered, contact us within 48 hours and we'll make it right at no cost to you.</p>
        </Section>
      </Prose>
    </PageShell>
  );
}