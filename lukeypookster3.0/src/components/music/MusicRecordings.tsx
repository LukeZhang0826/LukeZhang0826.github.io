import { useEffect, useRef, useState } from 'react';
import { useMusicAudio } from '../../lib/useMusicAudio';

type Track = { id: string; no: string; title?: string; artist?: string; meta?: string; src?: string };

const TRACKS: Track[] = [
  {
    id: 'giant-steps',
    no: '01',
    title: 'Giant Steps',
    artist: 'John Coltrane · 1960',
    meta: 'the changes drawn in the circle above',
    src: '/audio/giant-steps.mp3',
  },
  { id: 'tba-02', no: '02' },
  { id: 'tba-03', no: '03' },
];

const BARS = 56;
const waveform = (seed: number) =>
  Array.from({ length: BARS }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.5 + seed) + 0.5 * Math.sin(i * 0.17 + seed * 2));
    return 0.18 + 0.82 * Math.min(1, v / 1.5);
  });

const fmt = (s: number) =>
  isFinite(s) && s >= 0
    ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
    : '--:--';

export default function MusicRecordings() {
  const { currentId, playing, errorId, toggle, audioRef } = useMusicAudio();
  const [ct, setCt] = useState(0);
  const [dur, setDur] = useState(0);
  const [idleFrac, setIdleFrac] = useState(0); // thumb position for a not-yet-started track
  // a fractional seek requested before the track had a known duration
  const pendingSeekRef = useRef<{ id: string; frac: number } | null>(null);

  // Reset position when track changes
  useEffect(() => {
    setCt(0);
    setDur(0);
    setIdleFrac(0);
  }, [currentId]);

  // Track playback time/duration; apply any pending pre-play seek once we know dur.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCt(el.currentTime);
    const onMeta = () => {
      const d = isFinite(el.duration) ? el.duration : 0;
      setDur(d);
      const p = pendingSeekRef.current;
      if (p && currentId === p.id && d > 0) {
        el.currentTime = p.frac * d;
        pendingSeekRef.current = null;
      }
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('durationchange', onMeta);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('durationchange', onMeta);
    };
  }, [audioRef, currentId]);

  const seek = (t: number) => {
    if (audioRef.current) audioRef.current.currentTime = t;
    setCt(t);
  };

  // Scrub handler that works whether or not the track has started. Before play it
  // starts the track and remembers the fraction to seek to once it loads.
  const scrub = (tk: Track, frac: number) => {
    const active = currentId === tk.id;
    if (active && dur > 0) {
      seek(frac * dur);
    } else {
      setIdleFrac(frac);
      pendingSeekRef.current = { id: tk.id, frac };
      if (tk.src) toggle(tk.id, tk.src);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-mono text-sm uppercase tracking-widest text-ink/70">// On Record</h3>
        <p className="font-music text-base italic text-ink/55">
          play a track - the circle above pulses to it
        </p>
      </div>

      <ul className="border-t border-ink/15">
        {TRACKS.map((tk, r) => {
          const isReal = !!tk.src;
          const isActive = isReal && currentId === tk.id;
          const isPlaying = isActive && playing;
          const failed = errorId === tk.id;
          const showScrubber = isReal && !failed;
          const heights = waveform(r * 3.1 + 1);

          return (
            <li
              key={tk.id}
              className={`flex items-center gap-4 border-b border-ink/15 py-5 md:gap-6 ${
                isPlaying ? 'bg-ink/[0.03]' : ''
              }`}
            >
              {/* transport */}
              <button
                type="button"
                disabled={!isReal}
                onClick={isReal ? () => toggle(tk.id, tk.src as string) : undefined}
                aria-label={isReal ? `${isPlaying ? 'Pause' : 'Play'} ${tk.title}` : 'Coming soon'}
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm transition-colors ${
                  isReal
                    ? 'border-ink/40 text-ink hover:bg-ink hover:text-bone'
                    : 'border-ink/20 text-ink/30'
                }`}
              >
                {isPlaying ? '❚❚' : '►'}
              </button>

              {/* title / track no. */}
              <div className="w-28 shrink-0 md:w-40">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  Track {tk.no}
                </p>
                {tk.title ? (
                  <>
                    <p className="mt-1 font-music text-lg italic leading-tight text-ink md:text-xl">
                      {tk.title}
                    </p>
                    {tk.artist && (
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink/45">
                        {tk.artist}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="mt-2 h-3 w-full rounded-sm bg-ink/10" />
                )}
              </div>

              {/* waveform or scrubber */}
              <div className="hidden min-w-0 flex-1 md:block">
                {showScrubber ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={1000}
                        step={1}
                        value={
                          isActive && dur > 0
                            ? Math.round((ct / dur) * 1000)
                            : Math.round(idleFrac * 1000)
                        }
                        onChange={(e) => scrub(tk, Number(e.target.value) / 1000)}
                        className="h-[3px] flex-1 cursor-pointer appearance-none rounded-full bg-ink/20"
                        style={{ accentColor: '#0a0a0a' }}
                        aria-label="Seek"
                      />
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-ink/45">
                        {isActive && dur > 0 ? `${fmt(ct)} / ${fmt(dur)}` : '--:-- / --:--'}
                      </span>
                    </div>
                    {tk.meta && (
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-ink/40">
                        {tk.meta}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex h-10 items-center gap-[2px] overflow-hidden">
                      {heights.map((h, i) => (
                        <span
                          key={i}
                          className={`w-full rounded-[1px] ${isPlaying ? 'bg-ink/35' : 'bg-ink/15'}`}
                          style={{ height: `${Math.round(h * 100)}%` }}
                        />
                      ))}
                    </div>
                    {(tk.meta || failed) && (
                      <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-wider text-ink/40">
                        {failed ? 'audio coming soon' : tk.meta}
                      </p>
                    )}
                  </>
                )}
              </div>

              {!showScrubber && (
                <span className="ml-auto shrink-0 font-mono text-xs text-ink/30 md:ml-0">
                  {isReal && !failed ? '' : '--:--'}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
