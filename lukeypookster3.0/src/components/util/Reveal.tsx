import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Scroll-triggered entrance: fades + rises its children the first time they enter view.
 * `once` so it never replays. Works with the lazy sections (they mount off-screen, then
 * animate as they scroll in).
 */
export default function Reveal({
  children,
  y = 22,
  delay = 0,
  className,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
