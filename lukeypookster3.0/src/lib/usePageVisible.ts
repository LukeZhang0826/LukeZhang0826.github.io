import { useEffect, useState } from 'react';

/**
 * True while the browser tab is visible. requestAnimationFrame already throttles to a stop
 * for hidden tabs, but using this to hard-pause the WebGL render loops (frameloop -> never)
 * makes the pause explicit and immediate, so no GPU work happens on a backgrounded tab.
 */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => (typeof document === 'undefined' ? true : !document.hidden));
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}
