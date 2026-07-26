import { useEffect } from "react";
import { WifiOff, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useConnectionStore } from ".././store/useConnectionStore";

import { API_ORIGIN } from "../lib/api";

export function ConnectionBanner() {
  const offline = useConnectionStore((s) => s.offline);
  const setOffline = useConnectionStore((s) => s.setOffline);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!offline) return;
    let cancelled = false;
    let timer: number;

    const ping = async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/health`);
        if (res.ok && !cancelled) {
          setOffline(false);
          queryClient.invalidateQueries(); // refresh whatever failed while asleep
          return;
        }
      } catch {
        // still down
      }
      if (!cancelled) timer = window.setTimeout(ping, 3000);
    };

    timer = window.setTimeout(ping, 2000);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [offline, setOffline, queryClient]);

  if (!offline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white">
      <WifiOff className="h-4 w-4" />
      Reconnecting to the server…
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  );
}