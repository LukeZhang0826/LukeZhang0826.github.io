import { useEffect, useRef } from 'react';
import { useMusicAudio } from '../../lib/useMusicAudio';

/**
 * Background note-fall for Section 05 - while a track plays, music glyphs of every
 * type stream right-to-left across the section like snowfall. It's audio-reactive:
 * the shared AnalyserNode drives it, so spawn density and drift speed scale with
 * the music's energy, and each detected beat (low-end onset) fires a burst with a
 * speed kick. Busy/fast passages → faster, denser notes. Faint ink over the paper.
 *
 * Decorative: dpr 1, RAF gated to in-view, frozen under prefers-reduced-motion.
 */

const INK = '10,10,10';
// BMP music symbols (widely supported) - notes of all types + accidentals.
const GLYPHS = ['♩', '♪', '♫', '♬', '♭', '♮', '♯'];

type Note = {
  x: number;
  y: number;
  vx: number; // px/sec, leftward (negative)
  size: number;
  glyph: string;
  alpha: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  rot: number;
  rotV: number;
};

const BASE_SPAWN_MS = 200; // baseline cadence; shortens as energy rises

export default function NoteFall() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playing, analyserRef, chordActiveRef } = useMusicAudio();
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W); // dpr 1 - faint decorative layer
      canvas.height = Math.round(H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const notes: Note[] = [];
    const spawn = (energy: number) => {
      const size = 14 + Math.random() * 22;
      notes.push({
        x: W + size,
        y: Math.random() * H,
        vx: -(35 + Math.random() * 55) * (0.8 + energy), // faster baseline + energy
        size,
        glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
        alpha: 0.05 + Math.random() * 0.13,
        swayAmp: 6 + Math.random() * 16,
        swayFreq: 0.3 + Math.random() * 0.7,
        swayPhase: Math.random() * Math.PI * 2,
        rot: (Math.random() - 0.5) * 0.5,
        rotV: (Math.random() - 0.5) * 0.4,
      });
    };

    let raf = 0;
    let prev = performance.now();
    let spawnAcc = 0;
    let active = false;

    // audio-reactive state
    let freq: Uint8Array<ArrayBuffer> | null = null;
    let energyAvg = 0; // slow baseline for onset detection
    let pulse = 0; // decaying speed kick from the last beat
    let lastBeat = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - prev, 50) / 1000;
      prev = now;

      // ── read the music: low-end energy + beat onset ────────────────
      let energy = 0;
      const analyser = analyserRef.current;
      if (playingRef.current && analyser) {
        if (!freq || freq.length !== analyser.frequencyBinCount) {
          freq = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(freq);
        let sum = 0;
        const hi = Math.min(freq.length, 32); // ~bass + low mids: the beat lives here
        for (let b = 1; b < hi; b++) sum += freq[b];
        energy = sum / ((hi - 1) * 255); // 0..1
        energyAvg = energyAvg * 0.92 + energy * 0.08;
        if (energy > energyAvg * 1.35 + 0.04 && now - lastBeat > 110) {
          lastBeat = now;
          pulse = Math.min(2.5, pulse + 0.7 + (energy - energyAvg) * 2.5);
          if (chordActiveRef.current) {
            const burst = Math.min(8, 2 + Math.floor((energy - energyAvg) * 12));
            for (let b = 0; b < burst; b++) spawn(energy);
          }
        }
      }
      pulse *= Math.pow(0.9, dt * 60); // decay the beat kick
      const speedMul = 0.8 + energy * 2.8 + pulse * 1.5;

      // ── continuous spawn (only while a chord is sounding), denser with energy ──
      if (chordActiveRef.current) {
        const rate = BASE_SPAWN_MS / (0.5 + energy * 2.5);
        spawnAcc += dt * 1000;
        while (spawnAcc >= rate) {
          spawnAcc -= rate;
          spawn(energy);
        }
      }

      // ── render ─────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgb(${INK})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const t = now / 1000;
      for (let i = notes.length - 1; i >= 0; i--) {
        const n = notes[i];
        n.x += n.vx * speedMul * dt;
        n.rot += n.rotV * dt;
        if (n.x < -n.size * 2) {
          notes.splice(i, 1);
          continue;
        }
        const y = n.y + Math.sin(t * n.swayFreq + n.swayPhase) * n.swayAmp;
        ctx.save();
        ctx.translate(n.x, y);
        ctx.rotate(n.rot);
        ctx.globalAlpha = n.alpha;
        ctx.font = `${n.size}px serif`;
        ctx.fillText(n.glyph, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) {
          if (!active) {
            active = true;
            prev = performance.now();
            raf = requestAnimationFrame(frame);
          }
        } else {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [analyserRef, chordActiveRef]);

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
