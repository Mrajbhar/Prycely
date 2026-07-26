import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL as string;
const HEALTH_URL = `${API_URL}/health`;

// Only show the waking screen if the first ping doesn't return fast.
const GRACE_MS = 2500;

export function WakeUpGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showWaking, setShowWaking] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let graceTimer: number;
    let tick: number;

    // If the API answers within GRACE_MS, the user never sees the waking screen.
    graceTimer = window.setTimeout(() => {
      if (!cancelled && !ready) setShowWaking(true);
    }, GRACE_MS);

    // Count up while we wait.
    tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    async function ping(): Promise<void> {
      try {
        const res = await fetch(HEALTH_URL, { method: 'GET' });
        if (res.ok) {
          if (!cancelled) setReady(true);
          return;
        }
      } catch {
        /* server still cold — retry */
      }
      if (!cancelled) {
        await new Promise((r) => setTimeout(r, 2000));
        return ping();
      }
    }

    void ping();

    return () => {
      cancelled = true;
      window.clearTimeout(graceTimer);
      window.clearInterval(tick);
    };
  }, [ready]);

  if (ready) return <>{children}</>;

  // Nothing shown during the grace period — avoids a flash for warm servers.
  if (!showWaking) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink px-6 text-center">
      {/* orange glow */}
      <div className="pointer-events-none absolute -right-32 top-1/3 size-[500px] rounded-full bg-accent/30 blur-[120px]" />

      <div className="relative max-w-sm">
        {/* logo */}
        <div className="mx-auto grid size-14 place-items-center rounded-xl bg-accent text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
            <circle cx="7" cy="7" r="1.3" fill="currentColor" />
          </svg>
        </div>

        {/* spinner */}
        <div className="mx-auto mt-6 size-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />

        <h1 className="mt-6 text-lg font-bold text-white">Waking up the server…</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Prycely runs on a free server that sleeps when idle. It&apos;s starting up now —
          this usually takes under a minute. Thanks for your patience.
        </p>

        <p className="price mt-4 text-xs tabular-nums text-white/40">
          {seconds}s
        </p>
      </div>
    </div>
  );
}