import { useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { API_ORIGIN } from "../lib/api";


function useBackendReady() {
  const [ready, setReady] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retry: number;
    const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);

    const ping = async () => {
      try {
        const controller = new AbortController();
        const to = window.setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`${API_ORIGIN}/health`, { signal: controller.signal });
        window.clearTimeout(to);
        if (res.ok) {
          if (!cancelled) { setReady(true); window.clearInterval(tick); }
          return;
        }
      } catch {
        // still cold — retry below
      }
      if (!cancelled) retry = window.setTimeout(ping, 3000);
    };

    ping();
    return () => {
      cancelled = true;
      window.clearInterval(tick);
      window.clearTimeout(retry);
    };
  }, []);

  return { ready, seconds };
}

export function BackendGate({ children }: { children: ReactNode }) {
  const { ready, seconds } = useBackendReady();
  if (ready) return <>{children}</>;

  const waking = seconds >= 3;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: "var(--bg, #f8fafc)", color: "var(--text, #0f172a)" }}
    >
      <div className="text-2xl font-extrabold">
        Nova<span className="text-brand-600">Shop</span>
      </div>
      <Loader2 className="h-10 w-10 animate-spin text-brand-600" />

      {waking ? (
        <div className="max-w-sm space-y-3">
          <p className="font-semibold">Waking up the server…</p>
          <p className="text-sm text-slate-500">
            The backend sleeps when idle on the free tier. First load can take up to a
            minute — thanks for hanging on.
          </p>
          <p className="text-4xl font-bold tabular-nums text-brand-600">{seconds}s</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Loading…</p>
      )}
    </div>
  );
}