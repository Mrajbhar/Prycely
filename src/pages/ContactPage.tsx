import { useState } from 'react';
import { PageShell } from '../components/layout/PageHeader';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email.');
    if (form.message.trim().length < 10) return setError('Your message needs a little more detail.');

    setSending(true);
    try {
      // No backend endpoint yet — simulate, then confirm. Wire to /contact when ready.
      await new Promise((r) => setTimeout(r, 700));
      toast.show('Message sent. We’ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Could not send right now. Try again, or email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      intro="Questions about an order, a product, or anything else? Send a note — we read every one."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert message={error} />}

          <Input
            label="Your name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <Textarea
            label="Message"
            rows={5}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
          />

          <Button type="submit" loading={sending}>
            Send message
          </Button>
        </form>

        {/* Details */}
        <aside className="space-y-6 rounded-card border border-line bg-subtle p-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Email
            </h3>
            <a href="mailto:hello@prycely.com" className="mt-1 block text-sm text-ink hover:text-accent">
              hello@prycely.com
            </a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Support hours
            </h3>
            <p className="price mt-1 text-sm text-ink">Mon–Sat, 10am–7pm IST</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Based in
            </h3>
            <p className="mt-1 text-sm text-ink">Mumbai, India</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}