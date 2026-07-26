import { PageShell, Prose, Section } from '../components/layout/PageHeader';

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy policy"
      intro="What we collect, why, and what we never do with it. Last updated July 2026."
    >
      <Prose>
        <Section title="What we collect">
          <p>To process orders we collect your name, email, shipping address, and phone number. Payment details are handled by our payment processor — we never see or store your full card number.</p>
        </Section>

        <Section title="How we use it">
          <p>Your information is used only to fulfil orders, provide support, and — if you opt in — send occasional updates. We don't sell your data to anyone. Ever.</p>
        </Section>

        <Section title="Cookies">
          <p>We use essential cookies to keep you signed in and remember your cart. We don't use advertising trackers.</p>
        </Section>

        <Section title="Your rights">
          <p>You can request a copy of your data or ask us to delete your account at any time by contacting us. We'll respond within a reasonable period.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about privacy? Email <a href="mailto:hello@prycely.com" className="text-accent hover:underline">hello@prycely.com</a>.</p>
        </Section>
      </Prose>
    </PageShell>
  );
}