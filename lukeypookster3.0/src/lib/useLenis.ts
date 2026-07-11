import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll engine - the replacement for 2.0's hostile `wheel` preventDefault
 * scroll-jacking. Smooth, but NATURAL: a trackpad flick still works as expected.
 * This is part of the shared "order in the code" infra every section rides on.
 */

let instance: Lenis | null = null;
// lockScroll can be called before the Lenis instance exists (e.g. the loading screen's
// effect runs before App's useLenis effect - child effects fire first); remember the
// wish and honor it at creation.
let wantLocked = false;

export function useLenis() {
  useEffect(() => {
    // Don't let the browser restore the old scroll position on refresh: the below-fold sections are
    // lazy (short placeholders at restore time), so a restored Y lands on the wrong section and then
    // jumps around as sections mount + grow. Always start at the top instead.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    instance = lenis;
    if (wantLocked) lenis.stop();

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);
}

/** Freeze background scroll (e.g. while a modal/case study is open). */
export function lockScroll() {
  wantLocked = true;
  instance?.stop();
}

/** Resume background scroll. */
export function unlockScroll() {
  wantLocked = false;
  instance?.start();
}

/** Smoothly scroll to an absolute Y offset. */
export function scrollToY(y: number, duration = 1.2) {
  instance?.scrollTo(y, { duration });
}

/** Smoothly scroll back to the top (the "portal" easter egg in the room finale). */
export function scrollToTop() {
  instance?.scrollTo(0, { duration: 1.6 });
}

/** Smoothly scroll to the very bottom of the page. */
export function scrollToBottom() {
  instance?.scrollTo(document.documentElement.scrollHeight, { duration: 1.6 });
}

/** Snap a given element fully into view; onComplete fires when the snap settles. */
export function scrollToEl(el: HTMLElement, onComplete?: () => void) {
  if (instance) instance.scrollTo(el, { duration: 0.8, onComplete });
  else onComplete?.();
}
