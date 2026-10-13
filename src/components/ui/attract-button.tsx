/**
 * Adapted from Attract Button by @dorianbaffier / Kokonut UI (MIT).
 * Original snapshot: vendor/kokonut-ui/attract-button.tsx.
 * Changes: native button, configurable children, deterministic particles, keyboard
 * focus, and static rendering for reduced motion. No shadcn runtime needed.
 */
import { motion } from 'motion/react';
import { useState, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { particleCount?: number; paused?: boolean };
export function AttractButton({ children, className, particleCount = 8, paused = false, ...props }: Props) {
  const [active, setActive] = useState(false);
  return <button {...props} className={cn('attract-button', className)}
    onPointerEnter={(event) => { setActive(true); props.onPointerEnter?.(event); }}
    onPointerLeave={(event) => { setActive(false); props.onPointerLeave?.(event); }}
    onFocus={(event) => { setActive(true); props.onFocus?.(event); }}
    onBlur={(event) => { setActive(false); props.onBlur?.(event); }}>
    {!paused && Array.from({ length: particleCount }, (_, i) => {
      const angle = i / particleCount * Math.PI * 2;
      return <motion.span key={i} aria-hidden="true" className="attract-particle" initial={false}
        animate={{ x: active ? 0 : Math.cos(angle) * 80, y: active ? 0 : Math.sin(angle) * 42, opacity: active ? 0.8 : 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }} />;
    })}
    <span className="attract-label">{children}</span>
  </button>;
}
