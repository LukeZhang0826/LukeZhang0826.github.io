import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Defers mounting a below-the-fold section until the user scrolls near it, so its JS chunk
 * and component tree stay out of the initial load. A min-height placeholder holds scroll
 * space; the generous rootMargin mounts it well before it enters view, so the real height
 * settles off-screen (no visible layout jump).
 */
export default function LazySection({ children, minH = '100svh' }: { children: ReactNode; minH?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '1200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={show ? undefined : { minHeight: minH }}>
      {show ? <Suspense fallback={<div style={{ minHeight: minH }} />}>{children}</Suspense> : null}
    </div>
  );
}
