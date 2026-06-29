import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type Active = { index: string; label: string };

const SectionContext = createContext<{
  active: Active;
  setActive: (a: Active) => void;
}>({
  active: { index: '00', label: 'The Index' },
  setActive: () => {},
});

export function SectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Active>({ index: '00', label: 'The Index' });
  return (
    <SectionContext.Provider value={{ active, setActive }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(SectionContext).active;
}

/**
 * Returns a ref to attach to a <section>. When that section is centered in the
 * viewport it becomes the "active" section (drives the HUD index). Uses an
 * IntersectionObserver - no scroll listeners - so the scroll-spy is essentially free.
 */
export function useSectionSpy<T extends HTMLElement>(index: string, label: string) {
  const { setActive } = useContext(SectionContext);
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // expose the index/label on the DOM so the custom cursor can tell which section the
    // POINTER is physically over (the cursor follows the pointer, not this scroll-spy).
    el.dataset.sectionIndex = index;
    el.dataset.sectionLabel = label;
    // A near-zero-height band pinned to the viewport's vertical center: exactly one section
    // contains the center line at any scroll position, so the active section (and its cursor)
    // flips deterministically the instant a section boundary crosses screen-center - no mushy
    // 10% window where the previous section's cursor lingers over the next one.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive({ index, label });
      },
      { threshold: 0, rootMargin: '-50% 0px -50% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, label, setActive]);

  return ref;
}
