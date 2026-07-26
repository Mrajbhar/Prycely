import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageShell, Prose, Section } from '../components/layout/PageHeader';

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Est. 2026 — Mumbai"
      title="Priced plainly. Always."
      intro="Prycely is a small, deliberate shop for everyday goods — electronics, clothing, home, and books — sold at prices that don't play games."
    >
      <Prose>
        <Section title="Why we exist">
          <p>
            Most online stores turn pricing into theatre: inflated “original” prices,
            countdown timers, and discounts that aren't really discounts. We think
            that's exhausting. Prycely lists the real price, plainly, and lets the
            product speak for itself.
          </p>
        </Section>

        <Section title="How we choose">
          <p>
            We carry a tight range instead of endless noise. Everything on the shelf
            earns its place — chosen for quality and honest value, not for how much
            margin we can squeeze from a markdown.
          </p>
        </Section>

        <Section title="What you can expect">
          <p>
            Clear prices, real stock counts, and delivery windows we actually mean.
            If something's out of stock, we say so. If it's on sale, the discount is
            genuine. No asterisks.
          </p>
        </Section>

        <div className="flex flex-wrap gap-3 border-t border-line pt-8">
          <Link to="/products">
            <Button>Browse the shop</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">Get in touch</Button>
          </Link>
        </div>
      </Prose>
    </PageShell>
  );
}