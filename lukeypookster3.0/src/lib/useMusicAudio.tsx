import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';

/**
 * Shared audio for Section 05. A single <audio> element feeds a Web Audio
 * AnalyserNode so any track can drive the Coltrane circle's spectrum in real time.
 * The graph is wired lazily on the first play (AudioContext needs a user gesture).
 *
 * Until a real file exists at the track's src, play() rejects / errors and we fall
 * back gracefully (errorId set, the circle keeps its synthesized motion).
 */
type MusicAudio = {
  currentId: string | null;
  playing: boolean;
  errorId: string | null;
  toggle: (id: string, src: string) => void;
  analyserRef: MutableRefObject<AnalyserNode | null>;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  // true while the Coltrane circle is showing an actual chord (vs "-"); lets other
  // section visuals (e.g. the note-fall) react only when a chord is sounding.
  chordActiveRef: MutableRefObject<boolean>;
};

const Ctx = createContext<MusicAudio | null>(null);

/**
 * One AudioContext for the whole app, plus a per-element cache of the source +
 * analyser. `createMediaElementSource` may be called only ONCE per media element
 * for its entire lifetime - calling it again (React StrictMode's double-mount,
 * Vite HMR re-running this module, a second play) throws InvalidStateError, which
 * would silently leave the element playing straight to the speakers with no
 * analyser in the path. Caching by element makes the graph idempotent.
 */
let sharedAC: AudioContext | null = null;
const sourceFor = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();
const analyserFor = new WeakMap<HTMLMediaElement, AnalyserNode>();

function wireGraph(el: HTMLMediaElement): { ac: AudioContext; analyser: AnalyserNode } | null {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    if (!sharedAC || sharedAC.state === 'closed') sharedAC = new AC();
    const ac = sharedAC;
    let analyser = analyserFor.get(el);
    if (!analyser) {
      const srcNode = sourceFor.get(el) ?? ac.createMediaElementSource(el);
      sourceFor.set(el, srcNode);
      analyser = ac.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.75;
      // Tighter dB window than the -100/-30 default → more contrast between the
      // quiet and loud parts of the spectrum, so the bars have real dynamic range.
      analyser.minDecibels = -85;
      analyser.maxDecibels = -25;
      srcNode.connect(analyser);
      analyser.connect(ac.destination);
      analyserFor.set(el, analyser);
    }
    return { ac, analyser };
  } catch (e) {
    console.warn('[music] audio graph wiring failed', e);
    return null;
  }
}

export function MusicAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chordActiveRef = useRef(false);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [errorId, setErrorId] = useState<string | null>(null);

  const ensureGraph = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const wired = wireGraph(el);
    if (wired) {
      acRef.current = wired.ac;
      analyserRef.current = wired.analyser;
    }
  }, []);

  const toggle = useCallback(
    (id: string, src: string) => {
      const el = audioRef.current;
      if (!el) return;
      setErrorId(null);
      if (currentId === id && playing) {
        el.pause();
        return;
      }
      ensureGraph();
      void acRef.current?.resume();
      if (el.getAttribute('data-src') !== src) {
        el.src = src;
        el.setAttribute('data-src', src);
      }
      setCurrentId(id);
      el.play().catch(() => {
        setErrorId(id);
        setCurrentId(null);
        setPlaying(false);
      });
    },
    [currentId, playing, ensureGraph]
  );

  const value = useMemo<MusicAudio>(
    () => ({ currentId, playing, errorId, toggle, analyserRef, audioRef, chordActiveRef }),
    [currentId, playing, errorId, toggle]
  );

  return (
    <Ctx.Provider value={value}>
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setErrorId((prev) => prev ?? currentId);
        }}
      />
      {children}
    </Ctx.Provider>
  );
}

export function useMusicAudio() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useMusicAudio must be used within MusicAudioProvider');
  return c;
}
