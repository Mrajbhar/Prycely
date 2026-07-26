import { useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL as string;
const HEALTH_URL = `${API_URL.replace(/\/$/, '')}/health`;
const GRACE_MS = 2500;

export function WakeUpGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showWaking, setShowWaking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const stopped = useRef(false);

  useEffect(() => {
    let graceTimer: number;
    let tick: number;

    graceTimer = window.setTimeout(() => {
      if (!stopped.current) setShowWaking(true);
    }, GRACE_MS);

    tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    async function ping() {
      while (!stopped.current) {
        try {
          const res = await fetch(HEALTH_URL, { method: 'GET' });
          if (res.ok) {
            stopped.current = true;      // ← stop the loop
            setReady(true);
            return;
          }
        } catch {
          /* still cold */
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    void ping();

    return () => {
      stopped.current = true;
      window.clearTimeout(graceTimer);
      window.clearInterval(tick);
    };
  }, []);

  if (ready) return <>{children}</>;
  if (!showWaking) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink px-6 text-center">
      <div className="pointer-events-none absolute -right-32 top-1/3 size-[500px] rounded-full bg-accent/30 blur-[120px]" />
      <div className="relative max-w-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-xl bg-accent text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
            <circle cx="7" cy="7" r="1.3" fill="currentColor" />
          </svg>
        </div>
        <div className="mx-auto mt-6 size-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
        <h1 className="mt-6 text-lg font-bold text-white">Waking up the server…</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Prycely runs on a free server that sleeps when idle. It&apos;s starting up now —
          this usually takes under a minute.
        </p>
        <p className="price mt-4 text-xs tabular-nums text-white/40">{seconds}s</p>
      </div>
    </div>
  );
}