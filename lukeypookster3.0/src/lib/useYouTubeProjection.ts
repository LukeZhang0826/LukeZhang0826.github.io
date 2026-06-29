import { useEffect } from 'react';

/**
 * Minimal YouTube IFrame API glue: mirrors a master player (the interactive reel video) onto a
 * slave player (the blurred background "projection") so play/pause and scrubbing on the reel are
 * reflected on the wall. Both iframes must already be in the DOM with `enablejsapi=1` and the
 * given ids. Best-effort: every API call is guarded so a failure never breaks the page.
 */

let apiPromise: Promise<unknown> | null = null;

function loadApi(): Promise<unknown> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const w = window as unknown as Record<string, any>;
  if (w.YT?.Player) return Promise.resolve(w.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      resolve(w.YT);
    };
    if (!document.querySelector('script[data-yt-api]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.dataset.ytApi = '1';
      document.head.appendChild(s);
    }
  });
  return apiPromise;
}

export function useYouTubeProjection(masterId: string, slaveId: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let master: any, slave: any, interval: number | undefined, cancelled = false;

    loadApi().then((YT: any) => {
      if (!YT || cancelled) return;
      if (!document.getElementById(masterId) || !document.getElementById(slaveId)) return;

      slave = new YT.Player(slaveId);
      master = new YT.Player(masterId, {
        events: {
          onStateChange: (e: any) => {
            try {
              const t = master.getCurrentTime?.() ?? 0;
              if (e.data === YT.PlayerState.PLAYING) {
                slave.seekTo?.(t, true);
                slave.mute?.();
                slave.playVideo?.();
              } else if (e.data === YT.PlayerState.PAUSED) {
                slave.pauseVideo?.();
              } else if (e.data === YT.PlayerState.BUFFERING) {
                slave.seekTo?.(t, true);
              }
            } catch {
              /* best-effort */
            }
          },
        },
      });

      // correct any drift while playing
      interval = window.setInterval(() => {
        try {
          if (master.getPlayerState?.() === 1) {
            const t = master.getCurrentTime();
            if (Math.abs((slave.getCurrentTime?.() ?? 0) - t) > 0.4) slave.seekTo(t, true);
          }
        } catch {
          /* best-effort */
        }
      }, 1000);
    });

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      // intentionally not destroying players - they own React-rendered iframes
    };
  }, [masterId, slaveId, enabled]);
}
