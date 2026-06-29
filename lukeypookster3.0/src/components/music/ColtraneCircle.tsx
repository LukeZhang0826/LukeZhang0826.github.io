import { useEffect, useRef, useState } from 'react';
import { useMusicAudio } from '../../lib/useMusicAudio';
import giantSteps from '../../data/giantSteps.json';

const TAU = Math.PI * 2;
const INK = '10,10,10';
const N = 12;

const RING_LABELS = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

type Quality = 'maj7' | 'dom7' | 'min7';
const INTERVALS: Record<Quality, number[]> = {
  maj7: [0, 4, 7, 11],
  dom7: [0, 4, 7, 10],
  min7: [0, 3, 7, 10],
};
type Chord = { name: string; root: number; quality: Quality; beats: number };

// Pitch class of each natural note; accidentals shift it ±1.
const NOTE_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// Parse a chord symbol ("Bmaj7" / "Bb7" / "Am7" / "C#m7") into the root + quality
// the circle needs to draw the note web. The changes themselves live in the
// editable data/giantSteps.json - fix the chords there, no code changes needed.
function parseChord(sym: string): { name: string; root: number; quality: Quality } {
  const m = sym.trim().match(/^([A-Ga-g])([#♯b♭]?)(.*)$/);
  if (!m) return { name: sym, root: 0, quality: 'maj7' };
  let root = NOTE_PC[m[1].toUpperCase()] ?? 0;
  if (m[2] === '#' || m[2] === '♯') root = (root + 1) % 12;
  if (m[2] === 'b' || m[2] === '♭') root = (root + 11) % 12;
  const suffix = m[3].toLowerCase();
  const quality: Quality =
    suffix.startsWith('maj') || suffix === ''
      ? 'maj7'
      : suffix.startsWith('m')
        ? 'min7'
        : 'dom7';
  return { name: sym.replace('#', '♯').replace('b', '♭'), root, quality };
}

// Song map: ordered sections, each repeated `repeat` times, expanded into one flat
// chord timeline. Falls back to a plain `changes` array for older song files.
type RawChange = { chord: string; beats: number };
type SongData = {
  bpm?: number;
  headOffsetMs?: number;
  loop?: boolean;
  sections?: { repeat?: number; at?: number[]; changes: RawChange[] }[];
  changes?: RawChange[];
};
const song = giantSteps as SongData;
const SECTIONS = song.sections ?? [{ repeat: 1, changes: song.changes ?? [] }];

// Expand sections × repeats into one flat timeline, and collect time anchors. An
// anchor pins a beat position to a real timestamp (seconds) in the recording, via
// each section's optional `at` array (one entry per repetition). Between anchors
// the beat is interpolated linearly, so a performance that drifts in tempo still
// tracks - a fixed BPM can't follow that.
const CHANGES: Chord[] = [];
const ANCHORS: { beat: number; t: number }[] = [];
{
  let beatAcc = 0;
  for (const sec of SECTIONS) {
    const reps = Math.max(1, sec.repeat ?? 1);
    const block = sec.changes.map((c) => ({ ...parseChord(c.chord), beats: c.beats }));
    const blockBeats = block.reduce((s, c) => s + c.beats, 0);
    for (let r = 0; r < reps; r++) {
      const at = sec.at?.[r];
      if (typeof at === 'number' && ANCHORS[ANCHORS.length - 1]?.beat !== beatAcc) {
        ANCHORS.push({ beat: beatAcc, t: at });
      }
      CHANGES.push(...block);
      beatAcc += blockBeats;
    }
    // An optional extra `at` entry one past the last repetition marks the section's
    // end time, anchoring the final span (e.g. a one-shot ending's last chord).
    const endAt = sec.at?.[reps];
    if (typeof endAt === 'number' && ANCHORS[ANCHORS.length - 1]?.beat !== beatAcc) {
      ANCHORS.push({ beat: beatAcc, t: endAt });
    }
  }
}

const slotOf = (pc: number) => (pc * 7) % 12;
const slotsOf = (c: Chord) => INTERVALS[c.quality].map((i) => slotOf((c.root + i) % 12));

// Tempo grid, also from the JSON. Nudge headOffsetMs there if the readout starts
// off the recording, or bpm if it drifts over the track.
// bpm is only the fallback for stretches no anchors cover; with 2+ anchors it's
// never used (the head/tail extend at the rate implied by the nearest anchors).
const BPM = song.bpm ?? 120;
const BEAT_MS = 60000 / BPM;
const HEAD_OFFSET_MS = song.headOffsetMs ?? 0;
const LOOP = song.loop ?? false;
const TOTAL_BEATS = CHANGES.reduce((sum, c) => sum + c.beats, 0);
const CHORD_START = CHANGES.reduce<number[]>((acc, _c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CHANGES[i - 1].beats);
  return acc;
}, []);
const chordIndexAtBeat = (beat: number) => {
  // Loop wraps the timeline; otherwise clamp so the readout holds on the final
  // chord once the song runs past its last change.
  const b = LOOP
    ? ((beat % TOTAL_BEATS) + TOTAL_BEATS) % TOTAL_BEATS
    : Math.max(0, Math.min(beat, TOTAL_BEATS - 0.0001));
  let idx = 0;
  for (let i = 0; i < CHORD_START.length; i++) {
    if (CHORD_START[i] <= b) idx = i;
    else break;
  }
  return idx;
};

// Playback time (seconds) → beat position. Piecewise-linear through the anchor map
// when anchors exist (follows tempo drift), constant BPM otherwise / beyond them.
const ORIGIN_T = HEAD_OFFSET_MS / 1000;
const beatFromTime = (time: number) => {
  if (ANCHORS.length === 0) return ((time - ORIGIN_T) * 1000) / BEAT_MS;
  // Between two anchors (and before the first, where i===0) → interpolate/extend
  // by the real time of that span, which is what follows tempo drift.
  for (let i = 0; i < ANCHORS.length - 1; i++) {
    const a = ANCHORS[i];
    const b = ANCHORS[i + 1];
    if (time <= b.t) return a.beat + ((b.beat - a.beat) * (time - a.t)) / (b.t - a.t);
  }
  // Past the last anchor → extend at the rate of the final span; fall back to bpm
  // only when there's a single anchor and thus no span to measure.
  const last = ANCHORS[ANCHORS.length - 1];
  if (ANCHORS.length >= 2) {
    const prev = ANCHORS[ANCHORS.length - 2];
    const slope = (last.beat - prev.beat) / (last.t - prev.t); // beats per second
    return last.beat + slope * (time - last.t);
  }
  return last.beat + ((time - last.t) * 1000) / BEAT_MS;
};
const TRAIL = 3;
const NUM_BARS = 84;
const REPEAT_MIN = 1; // beat-visualizer peak count is randomised in this range
const REPEAT_MAX = 12;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function ColtraneCircle() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyserRef, playing, audioRef, chordActiveRef } = useMusicAudio();
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const [chordName, setChordName] = useState('-');

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const mouse = { x: 0, y: 0, on: false };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
    };
    const onLeave = () => (mouse.on = false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);

    const node = Array.from({ length: N }, () => ({ dx: 0, dy: 0, vx: 0, vy: 0 }));
    const barLvl = new Float32Array(NUM_BARS);
    const barTmp = new Float32Array(NUM_BARS); // raw targets before circular smoothing
    let ringRepeats = 3; // beat-visualizer peak count; re-rolled on each chord change
    const peakLvl = new Float32Array(N);      // smoothed pitch energy per fifths-slot
    const pitchEnergy = new Float32Array(12); // chromatic pitch class energy
    let freq: Uint8Array<ArrayBuffer> | null = null;

    let raf = 0;
    let prev = performance.now();
    let elapsed = 0;
    let lastIdx = -1;

    const draw = (now: number) => {
      const dtRaw = now - prev;
      prev = now;
      const dt = Math.min(dtRaw, 32);
      const fr = dt / 16.67;
      elapsed += dt;

      const cx = W / 2;
      const cy = H / 2;
      const M = Math.min(W, H);
      const Rnode = M * 0.25;
      const Rbar = M * 0.355;
      const barMax = M * 0.14; // loud bars shoot most of the way to the canvas edge
      const rot = (elapsed / 90000) * TAU;

      const analyser = analyserRef.current;
      const live = playingRef.current && !!analyser;

      // ── chord index ──────────────────────────────────────────────
      // idx === -1 means "no chord" → the readout shows "-": when nothing is
      // playing, or when playback is outside the charted timeline (before the
      // first downbeat / past the last change, unless looping).
      let idx = -1;
      if (live && audioRef.current) {
        const beat = beatFromTime(audioRef.current.currentTime);
        idx = LOOP || (beat >= 0 && beat < TOTAL_BEATS) ? chordIndexAtBeat(beat) : -1;
      }
      if (idx !== lastIdx) {
        // re-roll the beat-visualizer peak count on each new chord
        if (idx >= 0) {
          ringRepeats = REPEAT_MIN + Math.floor(Math.random() * (REPEAT_MAX - REPEAT_MIN + 1));
        }
        lastIdx = idx;
        setChordName(idx >= 0 ? CHANGES[idx].name : '-');
      }
      chordActiveRef.current = idx >= 0; // share with the note-fall layer

      // ── FFT read + pitch class energy ────────────────────────────
      if (live && analyser) {
        if (!freq || freq.length !== analyser.frequencyBinCount) {
          freq = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(freq);

        // Sum bin energy into 12 chromatic pitch classes via MIDI note mapping
        pitchEnergy.fill(0);
        const binHz = analyser.context.sampleRate / analyser.fftSize;
        for (let i = 2; i < freq.length; i++) {
          const f = i * binHz;
          if (f > 8000) break;
          const midi = 69 + 12 * Math.log2(f / 440);
          if (midi < 21) continue;
          const pc = ((Math.round(midi) % 12) + 12) % 12;
          pitchEnergy[pc] += freq[i] / 255;
        }
        let maxE = 0.001;
        for (let p = 0; p < 12; p++) if (pitchEnergy[p] > maxE) maxE = pitchEnergy[p];
        // Gamma > 1 exaggerates the gap between the loudest pitch and the rest, so
        // the nodes push out by varied amounts instead of all bunching at the rim.
        for (let p = 0; p < 12; p++) pitchEnergy[p] = Math.pow(pitchEnergy[p] / maxE, 2.5);
      }

      // Smooth per-slot peak level. Slot s → chromatic pc via (s*7)%12
      // (7 is its own inverse mod 12, so the fifths→chromatic and chromatic→fifths
      // mappings are the same function.)
      for (let s = 0; s < N; s++) {
        const pc = (s * 7) % 12;
        const target = live ? pitchEnergy[pc] : 0;
        peakLvl[s] += (target - peakLvl[s]) * Math.min(1, 0.18 * fr);
      }

      // ── node physics ─────────────────────────────────────────────
      const SPRING = 0.12;
      const DAMP = 0.82;
      const INFL = M * 0.17;
      const PUSH = M * 0.05;
      const PEAK_R = M * 0.1; // max outward displacement for the loudest note

      const pos: [number, number][] = [];
      for (let s = 0; s < N; s++) {
        const a = (s / N) * TAU - Math.PI / 2 + rot;
        const rx = cx + Math.cos(a) * Rnode;
        const ry = cy + Math.sin(a) * Rnode;

        const nd = node[s];
        let ax = -SPRING * nd.dx;
        let ay = -SPRING * nd.dy;
        if (mouse.on) {
          const px = rx + nd.dx;
          const py = ry + nd.dy;
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < INFL && d > 0.01) {
            const f = (1 - d / INFL) * PUSH;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        nd.vx = (nd.vx + ax * fr) * Math.pow(DAMP, fr);
        nd.vy = (nd.vy + ay * fr) * Math.pow(DAMP, fr);
        nd.dx += nd.vx * fr;
        nd.dy += nd.vy * fr;

        // push the node outward along its rest angle by its pitch energy
        const peak = peakLvl[s] * PEAK_R;
        pos[s] = [rx + nd.dx + Math.cos(a) * peak, ry + nd.dy + Math.sin(a) * peak];
      }

      // ── spectrum bars: flat resting ring when idle, FFT-reactive when playing ──
      // Each of the RING_REPEATS arcs sweeps low→high→low frequency, so the
      // bass-heavy energy forms evenly spaced symmetric peaks. A noise floor plus
      // gamma give the loud-vs-soft dynamic range that reads as a real analyser:
      // quiet bins collapse to ~0, loud bins shoot out.
      // Phase-based folding tiles any integer peak count seamlessly (no need to
      // divide NUM_BARS); the count is re-rolled on each chord change, above.
      const barBinHz = analyser ? analyser.context.sampleRate / analyser.fftSize : 0;
      const FLOOR = 0.3;
      for (let i = 0; i < NUM_BARS; i++) {
        if (live && freq && barBinHz) {
          const phase = ((i / NUM_BARS) * ringRepeats) % 1; // 0..1 within each repeat
          const frac = phase < 0.5 ? phase / 0.5 : (1 - phase) / 0.5; // 0→1→0 hump
          const f = 50 * Math.pow(6000 / 50, frac); // log-spaced 50Hz→6kHz
          const bin = Math.min(freq.length - 1, Math.max(1, Math.round(f / barBinHz)));
          const v = clamp01((freq[bin] / 255 - FLOOR) / (1 - FLOOR)); // strip noise floor
          barTmp[i] = Math.pow(v, 1.6); // gamma: loud bars clearly taller than soft
        } else {
          barTmp[i] = 0; // no ring at all when nothing is playing
        }
      }
      const SMOOTH_R = 1;
      for (let i = 0; i < NUM_BARS; i++) {
        let sum = 0;
        for (let k = -SMOOTH_R; k <= SMOOTH_R; k++) sum += barTmp[(i + k + NUM_BARS) % NUM_BARS];
        const target = sum / (SMOOTH_R * 2 + 1);
        barLvl[i] += (target - barLvl[i]) * Math.min(1, 0.3 * fr);
      }

      // ── render ───────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // spectrum ring - always rendered (synth beat when idle, FFT-reactive when playing)
      const span = (TAU * Rbar) / NUM_BARS;
      ctx.lineWidth = Math.max(1.5, span * 0.5);
      ctx.lineCap = 'butt';
      for (let i = 0; i < NUM_BARS; i++) {
        const lvl = barLvl[i];
        if (lvl < 0.005) continue;
        const a = (i / NUM_BARS) * TAU - Math.PI / 2 + rot;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        const h = barMax * lvl;
        ctx.strokeStyle = `rgba(${INK},${0.2 + 0.5 * lvl})`;
        ctx.beginPath();
        ctx.moveTo(cx + ca * Rbar, cy + sa * Rbar);
        ctx.lineTo(cx + ca * (Rbar + h), cy + sa * (Rbar + h));
        ctx.stroke();
      }

      // base web - the full circle-of-fifths lattice, drawn faintly so the circle
      // has weight even when nothing is playing (it flexes with the cursor). Inner
      // diagonals go in one path (uniform low alpha, so crossings don't build up),
      // then the perimeter is laid on top a touch stronger.
      ctx.strokeStyle = `rgba(${INK},0.07)`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const sep = Math.min(j - i, N - (j - i));
          if (sep < 2) continue; // adjacent edges belong to the perimeter
          ctx.moveTo(pos[i][0], pos[i][1]);
          ctx.lineTo(pos[j][0], pos[j][1]);
        }
      }
      ctx.stroke();

      ctx.strokeStyle = `rgba(${INK},0.18)`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let s = 0; s <= N; s++) {
        const [px, py] = pos[s % N];
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 12 nodes + labels
      ctx.font = `${Math.max(10, Rnode * 0.075)}px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let s = 0; s < N; s++) {
        const [nx, ny] = pos[s];
        const energy = live ? peakLvl[s] : 0;
        const isPeak = energy > 0.6;
        const dotR = 2.5 + energy * 2.5;
        ctx.beginPath();
        ctx.arc(nx, ny, dotR, 0, TAU);
        ctx.fillStyle = isPeak ? `rgba(${INK},0.9)` : `rgba(${INK},0.4)`;
        ctx.fill();
        const dl = Math.hypot(nx - cx, ny - cy) || 1;
        const lx = nx + ((nx - cx) / dl) * (M * 0.05);
        const ly = ny + ((ny - cy) / dl) * (M * 0.05);
        ctx.fillStyle = isPeak ? `rgba(${INK},0.95)` : `rgba(${INK},0.55)`;
        ctx.fillText(RING_LABELS[s], lx, ly);
      }

      // chord web
      const drawChord = (chord: Chord, alpha: number, strong: boolean) => {
        const ss = slotsOf(chord);
        ctx.lineWidth = strong ? 2 : 1;
        ctx.strokeStyle = `rgba(${INK},${alpha})`;
        for (let i = 0; i < ss.length; i++) {
          for (let j = i + 1; j < ss.length; j++) {
            ctx.beginPath();
            ctx.moveTo(pos[ss[i]][0], pos[ss[i]][1]);
            ctx.lineTo(pos[ss[j]][0], pos[ss[j]][1]);
            ctx.stroke();
          }
        }
        if (strong) {
          for (const s of ss) {
            ctx.beginPath();
            ctx.arc(pos[s][0], pos[s][1], 4, 0, TAU);
            ctx.fillStyle = `rgb(${INK})`;
            ctx.fill();
          }
        }
      };
      if (idx >= 0) {
        for (let k = TRAIL; k >= 1; k--) {
          const ci = (idx - k + CHANGES.length * 2) % CHANGES.length;
          // Short, steep fade so the previous chord clears quickly instead of
          // piling lines through the center under the readout text.
          drawChord(CHANGES[ci], Math.pow(1 - k / (TRAIL + 1), 2.5) * 0.4, false);
        }
        drawChord(CHANGES[idx], 0.9, true);
      }

      raf = requestAnimationFrame(draw);
    };

    // Gate the RAF (and its per-frame analyser reads) to when the circle is on
    // screen - no point animating while the section is scrolled away.
    let active = false;
    const start = () => {
      if (active) return;
      active = true;
      prev = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(raf);
      chordActiveRef.current = false; // don't leave the note-fall running on a stale value
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: '160px',
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [analyserRef, audioRef, chordActiveRef]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div ref={wrapRef} className="absolute inset-0">
        <canvas ref={canvasRef} aria-hidden className="h-full w-full" />
      </div>

      {/* center readout */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
          Now playing
        </span>
        <span className="font-music text-4xl font-bold italic text-ink md:text-5xl">
          {chordName}
        </span>
      </div>

      <span className="sr-only">
        An interactive circle-of-fifths visualization of John Coltrane's Giant Steps changes that
        reacts to the cursor and to the music when a track is playing.
      </span>
    </div>
  );
}
