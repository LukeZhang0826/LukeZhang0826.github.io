import { motion, useSpring } from 'framer-motion';

/**
 * Section 02 (Animation) hero - a full-bleed looping GIF (EmesZack's piece) over the
 * blue/pink/yellow gradient with film grain. GIFs autoplay/loop natively; `loading="lazy"`
 * defers the 2.6MB fetch until it's near the viewport. Interactive: the loop gets a subtle
 * cursor parallax (scaled up so the overscan never shows an edge). The asset is a placeholder.
 */

export const ANIM_GRADIENT = 'linear-gradient(180deg, #2B6DE0 0%, #6FB7E8 42%, #F7C8E0 78%, #F7D98A 100%)';
const GIF_SRC = '/animation/us-mediadesign-emeszack-portfolio-01.gif';

export default function AnimationHero() {
  const x = useSpring(0, { stiffness: 80, damping: 20 });
  const y = useSpring(0, { stiffness: 80, damping: 20 });
  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((((e.clientX - r.left) / r.width) * 2 - 1) * -22);
    y.set((((e.clientY - r.top) / r.height) * 2 - 1) * -14);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={reset} className="absolute inset-0 overflow-hidden" style={{ background: ANIM_GRADIENT }}>
      <motion.img
        src={GIF_SRC}
        alt="Animation loop by EmesZack"
        loading="lazy"
        style={{ x, y, scale: 1.12 }}
        className="h-full w-full object-cover"
      />

      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* credit - EmesZack made this piece */}
      <a
        href="https://www.instagram.com/emeszack2000/"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto absolute bottom-3 right-3 z-10 rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur transition-colors hover:text-white"
      >
        Placeholder, not my work · loop by EmesZack ↗
      </a>
    </div>
  );
}
