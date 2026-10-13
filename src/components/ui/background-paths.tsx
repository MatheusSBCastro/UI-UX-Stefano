/**
 * Adapted from Background Paths by @dorianbaffier / Kokonut UI (MIT).
 * Original snapshot: vendor/kokonut-ui/background-paths.tsx.
 * Changes: embeddable layer, deterministic IDs, theme color, explicit reduced motion.
 */
import { motion } from 'motion/react';
import { useId, useMemo } from 'react';

function generatePath(index: number, amplitude: number, segments: number) {
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const progress = i / segments;
    const eased = 1 - (1 - progress) ** 2;
    const phase = index * 0.2;
    const factor = 1 - eased * 0.3;
    return {
      x: 2400 - 4800 * eased,
      y: 800 + (-1600 + index * 25) * eased
        + Math.sin(progress * Math.PI * 3 + phase) * amplitude * 0.7 * factor
        + Math.cos(progress * Math.PI * 4 + phase) * amplitude * 0.3 * factor
        + Math.sin(progress * Math.PI * 2 + phase) * amplitude * 0.2 * factor,
    };
  });
  return points.map((point, i) => {
    if (!i) return `M ${point.x} ${point.y}`;
    const previous = points[i - 1];
    return `C ${previous.x + (point.x - previous.x) * 0.4} ${previous.y}, ${previous.x + (point.x - previous.x) * 0.6} ${point.y}, ${point.x} ${point.y}`;
  }).join(' ');
}

export function BackgroundPaths({ paused = false }: { paused?: boolean }) {
  const id = useId();
  const paths = useMemo(() => [
    ...Array.from({ length: 12 }, (_, i) => ({ d: generatePath(i, 150, 10), width: 4 + i * 0.3, opacity: 0.15 + i * 0.02, offset: -15, duration: 8 })),
    ...Array.from({ length: 15 }, (_, i) => ({ d: generatePath(i, 100, 8), width: 3 + i * 0.25, opacity: 0.12 + i * 0.015, offset: -10, duration: 6 })),
    ...Array.from({ length: 10 }, (_, i) => ({ d: generatePath(i, 60, 6), width: 2 + i * 0.2, opacity: 0.08 + i * 0.08, offset: -5, duration: 4 })),
  ], []);
  return <svg aria-hidden="true" className="background-paths" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="-2400 -800 4800 1600">
    <defs><linearGradient id={id}><stop stopColor="var(--accent)" stopOpacity="0.1" /><stop offset="0.5" stopColor="var(--accent)" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0.1" /></linearGradient></defs>
    {paths.map((path, index) => <motion.path key={index} d={path.d} stroke={`url(#${id})`} strokeWidth={path.width} strokeLinecap="round" style={{ opacity: path.opacity }}
      animate={{ y: paused ? 0 : [0, path.offset, 0] }} transition={paused ? { duration: 0 } : { duration: path.duration, repeat: Infinity, ease: 'easeInOut' }} />)}
  </svg>;
}
