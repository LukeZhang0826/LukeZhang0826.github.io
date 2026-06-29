import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSectionSpy } from '../../lib/section';
import { lockScroll, unlockScroll, scrollToEl } from '../../lib/useLenis';

const RoomCanvas = lazy(() => import('../room/RoomCanvas'));

const CONTACTS: { label: string; value: string; href: string }[] = [
  { label: 'Email', value: 'lukezhang0826@gmail.com', href: 'mailto:lukezhang0826@gmail.com' },
  { label: 'GitHub', value: 'LukeZhang0826', href: 'https://github.com/LukeZhang0826' },
  { label: 'LinkedIn', value: 'luke-shiyi-zhang', href: 'https://www.linkedin.com/in/luke-shiyi-zhang/' },
  { label: 'Phone', value: '+1 (416) 560-0826', href: 'tel:+14165600826' },
];

/**
 * A narrative panel that can tuck itself off-screen and slide back via its tab -
 * the cards otherwise crowd the room on small screens. Slides toward `side`, leaving
 * the tab on screen. Starts open on desktop, tucked away on mobile.
 */
function SlideCard({
  side,
  posClass,
  label,
  children,
}: {
  side: 'left' | 'right';
  posClass: string;
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );
  const isLeft = side === 'left';
  const tucked = isLeft ? 'calc(-100% + 2.25rem)' : 'calc(100% - 2.25rem)';

  const card = (
    <div className="w-[78vw] max-w-md border-2 border-bone/20 bg-[#061519]/80 p-5 backdrop-blur md:p-6">
      {children}
    </div>
  );
  const tab = (
    <button
      onClick={() => setOpen((o) => !o)}
      aria-label={`${open ? 'Hide' : 'Show'} ${label}`}
      style={{ writingMode: 'vertical-rl' }}
      className={`flex w-9 shrink-0 items-center justify-center gap-2 border-2 ${
        isLeft ? 'border-l-0' : 'border-r-0'
      } border-bone/20 bg-[#061519]/80 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/70 backdrop-blur transition-colors hover:text-acid`}
    >
      {label}
    </button>
  );

  return (
    <div className={`pointer-events-none absolute z-10 ${posClass}`}>
      <motion.div
        className="pointer-events-auto flex items-stretch"
        animate={{ x: open ? 0 : tucked }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      >
        {isLeft ? (
          <>
            {card}
            {tab}
          </>
        ) : (
          <>
            {tab}
            {card}
          </>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Section 06 - The Room (finale).
 *  near    : the canvas mounts and shows ONLY the portal-fire monitor (no textures yet).
 *  play    : snaps the section into view, locks scroll, streams the room in, camera
 *            zooms OUT from the monitor to reveal it.
 *  leave   : the bottom-centre Leave button zooms back onto the monitor and restores scroll.
 */
export default function RoomSection() {
  const ref = useSectionSpy<HTMLElement>('06', 'The Room');
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [fireOn, setFireOn] = useState(false); // ramp the monitor fire alive on first sight
  const [fireAlive, setFireAlive] = useState(false); // fire has finished ramping → reveal Play
  const enteredRef = useRef(false);

  // mount the canvas well BEFORE the room is in view so the monitor (three.js + GLB) has
  // finished streaming by the time the user arrives, instead of popping in late.
  // A separate, tight observer handles snapping the section in on approach.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mountIO = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          mountIO.disconnect();
        }
      },
      { rootMargin: '2200px 0px' },
    );
    mountIO.observe(el);

    let snapped = false;
    const snapIO = new IntersectionObserver(
      ([entry]) => {
        // first time the room is meaningfully on screen, start the fire ramp
        if (entry.intersectionRatio >= 0.2) setFireOn(true);
        if (enteredRef.current) return;
        if (entry.intersectionRatio >= 0.6 && !snapped) {
          snapped = true;
          scrollToEl(el);
        }
        if (entry.intersectionRatio < 0.2) snapped = false;
      },
      { threshold: [0, 0.2, 0.6, 1] },
    );
    snapIO.observe(el);

    return () => {
      mountIO.disconnect();
      snapIO.disconnect();
    };
  }, [ref]);

  const play = () => {
    setEntered(true);
    enteredRef.current = true;
    setLeaving(false);
    const el = ref.current;
    if (el) scrollToEl(el, lockScroll);
    else lockScroll();
  };

  const requestLeave = () => setLeaving(true);

  // called by the camera rig once it has zoomed back onto the monitor
  const onExited = () => {
    setEntered(false);
    enteredRef.current = false;
    setLeaving(false);
    unlockScroll();
  };

  return (
    <section ref={ref} className="sel-room relative h-[100svh] w-full overflow-hidden bg-black text-bone">
      {/* the canvas: monitor-only when idle, full room after Play */}
      <div className="absolute inset-0">
        {mounted && (
          <Suspense fallback={null}>
            <RoomCanvas
              entered={entered}
              leaving={leaving}
              onExited={onExited}
              onMonitorClick={requestLeave}
              fireOn={fireOn}
              onFireReady={() => setFireAlive(true)}
            />
          </Suspense>
        )}
      </div>

      {/* PLAY (idle) - appears only once the fire has come alive */}
      <AnimatePresence>
        {!entered && fireAlive && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center mix-blend-difference text-bone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-bone/80">
              06 / Where it started
            </p>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.1 }}
              className="relative h-28 w-28 md:h-32 md:w-32"
            >
              {/* one-shot shine ring on appear (outside the clipped button so it can grow) */}
              <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-bone [animation:play-pulse_0.9s_ease-out_1_forwards]" />
              <motion.button
                onClick={play}
                whileHover={{ scale: 1.06 }}
                className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-bone text-ink transition-colors hover:bg-acid"
              >
                {/* a glint that sweeps across ONCE as the button appears */}
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent [animation:play-shine_1.5s_ease-out_0.15s_1_both]" />
                <span className="ml-1 text-4xl">►</span>
              </motion.button>
            </motion.div>
            <p className="mt-6 max-w-xs font-mono text-[11px] uppercase tracking-widest text-bone/70">
              Press play
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact card + bottom-centre Leave (entered) */}
      <AnimatePresence>
        {entered && !leaving && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* THE ROOM - the narrative behind this finale (top-right, tuckable) */}
            <SlideCard side="right" posClass="right-0 top-20 md:top-24" label="The Room">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-bone/50">
                // 06
              </p>
              <h3 className="mb-3 font-mono text-2xl font-bold uppercase tracking-tight text-bone">
                The Room
              </h3>
              <p className="font-grotesk text-sm leading-relaxed text-bone/75">
                The vulnerable part - a look inside my life and what I want to pursue. I build to
                make people happy: to put good products and good experiences into the world, things
                worth spending time in.
              </p>
            </SlideCard>

            {/* CONNECT - contact panel (bottom-left, tuckable) */}
            <SlideCard side="left" posClass="bottom-24 left-0 md:bottom-8" label="Connect">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-bone/60">
                // Connect
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {CONTACTS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex flex-col transition-colors hover:text-acid"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-bone/40">
                        {c.label}
                      </span>
                      <span className="font-grotesk text-sm font-bold">{c.value} ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-bone/15 pt-4 font-mono text-[10px] uppercase tracking-widest text-bone/40">
                ©2026 Luke Zhang - Built with Vite, R3F &amp; too much coffee
              </p>
            </SlideCard>

            <button
              onClick={requestLeave}
              className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 border-2 border-bone/40 bg-[#061519]/80 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest backdrop-blur transition-colors hover:border-acid hover:text-acid"
            >
              ← Leave
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
