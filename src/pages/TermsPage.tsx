import { PageShell, Prose, Section } from '../components/layout/PageHeader';

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service"
      intro="The basics of using Prycely. Last updated July 2026."
    >
      <Prose>
        <Section title="Using the store">
          <p>By shopping with Prycely you agree to provide accurate information and to use the store for lawful purposes only. You're responsible for keeping your account credentials secure.</p>
        </Section>

        <Section title="Orders & pricing">
          <p>All prices are in Indian Rupees and include applicable taxes unless stated otherwise. We make every effort to keep prices and stock accurate, but reserve the right to cancel an order if an item is mispriced or unavailable, with a full refund.</p>
        </Section>

        <Section title="Payments">
          <p>Payment is processed securely at checkout. Orders are confirmed once payment succeeds.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>Prycely isn't liable for indirect or incidental damages arising from use of the store, to the extent permitted by law. Our total liability for any order is limited to the amount you paid for it.</p>
        </Section>

        <Section title="Changes">
          <p>We may update these terms occasionally. Continued use of the store after changes means you accept the revised terms.</p>
        </Section>
      </Prose>
    </PageShell>
  );
}