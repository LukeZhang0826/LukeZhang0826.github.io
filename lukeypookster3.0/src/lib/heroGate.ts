import { useSyncExternalStore } from 'react';

/**
 * Tiny shared flag: has the visitor entered the site (pressed Start on the loading screen)?
 *
 * While the loading curtain is down the hero canvas is mounted BEHIND it for a GPU warm-up,
 * but it should not keep rendering its shader loop at full framerate for the whole idle time -
 * the user can't see it. `VaporwaveCanvas` warms up for a beat, then parks its frameloop until
 * `entered` flips true (Start pressed), at which point it resumes just as the curtain lifts.
 */

let entered = false;
const subs = new Set<() => void>();

/** Called by App the moment Start is pressed. */
export function enterHero() {
  if (entered) return;
  entered = true;
  subs.forEach((f) => f());
}

export function useHeroEntered() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => entered,
    () => entered,
  );
}
