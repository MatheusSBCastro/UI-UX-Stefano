import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, RotateCcw, Crosshair } from 'lucide-react';
import { SpiderMark, WebPattern } from './graphics';

export function CinematicIntro({ paused, cycle }: { paused: boolean; cycle: number }) {
  const [visible, setVisible] = useState(!paused);
  useEffect(() => {
    if (paused) { setVisible(false); return; }
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 1450);
    return () => window.clearTimeout(timeout);
  }, [cycle]);
  useEffect(() => { if (paused) setVisible(false); }, [paused]);
  return <AnimatePresence>{visible && <motion.div key={cycle} className="cinematic-intro" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .65 }}>
    <motion.div className="intro-panel intro-panel-left" initial={{ x: 0 }} exit={{ x: '-105%' }} transition={{ duration: .65, ease: [.76, 0, .24, 1] }} />
    <motion.div className="intro-panel intro-panel-right" initial={{ x: 0 }} exit={{ x: '105%' }} transition={{ duration: .65, ease: [.76, 0, .24, 1] }} />
    <motion.div className="intro-emblem" initial={{ scale: .65, opacity: 0, rotate: -18 }} animate={{ scale: [ .65, 1, 1.12 ], opacity: [0, 1, 1], rotate: 0 }} exit={{ scale: 2.5, opacity: 0 }} transition={{ duration: 1.2, ease: [.22, 1, .36, 1] }}><SpiderMark /><span>SPIDER—VERSE</span><small>O PRÓXIMO SALTO É SEU.</small></motion.div>
    <div className="intro-web-lines"><WebPattern /></div>
    <motion.div className="intro-loading" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.35, ease: 'easeInOut' }} />
  </motion.div>}</AnimatePresence>;
}

export function MotionFilm({ source, paused, className = '', poster = '/assets/spider-hero.png' }: { source: string; paused: boolean; className?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useInView(ref, { amount: .08 });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const manage = () => {
      if (paused || !visible || document.hidden) video.pause();
      else video.play().catch(() => { /* Poster remains available when autoplay is unavailable. */ });
    };
    manage(); document.addEventListener('visibilitychange', manage);
    return () => { document.removeEventListener('visibilitychange', manage); video.pause(); };
  }, [paused, visible]);
  return <video ref={ref} className={`${className} ${failed ? 'film-unavailable' : ''}`} src={source} poster={poster} muted loop playsInline preload="metadata" aria-hidden="true" onError={() => setFailed(true)} />;
}

export function HeroMotionControls({ paused, replay }: { paused: boolean; replay: () => void }) {
  const [shot, setShot] = useState(0);
  return <>
    <div className="hero-motion-controls"><button onClick={() => setShot((value) => value + 1)}><Crosshair size={15} /> LANÇAR TEIA</button><button onClick={replay} disabled={paused} aria-label="Rever entrada cinematográfica"><RotateCcw size={14} /> REVER ENTRADA</button></div>
    <AnimatePresence>{!paused && shot > 0 && <motion.div key={shot} className="hero-web-burst" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, .75, 0] }} transition={{ duration: 1.9, times: [0, .2, .6, 1] }}>
      <svg className="hero-web-line" viewBox="0 0 100 100" preserveAspectRatio="none"><motion.path d="M7 92 Q36 52 72 34" stroke="#fff" strokeWidth=".22" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .35 }} /></svg>
      <motion.div className="hero-web-impact" initial={{ scale: .25, rotate: -25 }} animate={{ scale: 1.5, rotate: 0 }} transition={{ duration: 1.1, ease: [.16, 1, .3, 1] }}><WebPattern /></motion.div>
    </motion.div>}</AnimatePresence>
    {paused && shot > 0 && <span className="web-static-feedback" role="status">Teia lançada.</span>}
  </>;
}

export function TiltCard({ children, paused }: { children: ReactNode; paused: boolean }) {
  const ax = useMotionValue(0); const ay = useMotionValue(0);
  const rotateX = useSpring(ax, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(ay, { stiffness: 150, damping: 18 });
  return <motion.div className="tilt-card" style={{ rotateX: paused ? 0 : rotateX, rotateY: paused ? 0 : rotateY, transformPerspective: 1000 }} onPointerMove={(event) => {
    if (paused || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    ax.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 18);
    ay.set((event.clientX - rect.left - rect.width / 2) / rect.width * 22);
  }} onPointerLeave={() => { ax.set(0); ay.set(0); }}>{children}</motion.div>;
}

export function SwingSequence({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (progress) => setChapter(Math.min(2, Math.floor(progress * 3))));
  const scale = useTransform(scrollYProgress, [0, .5, 1], [1.35, 1, 1.18]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const webScale = useTransform(scrollYProgress, [0, .5, 1], [2.6, .7, 1.8]);
  const webRotate = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const webOpacity = useTransform(scrollYProgress, [0, .2, .5, .8, 1], [.04, .22, .06, .2, .05]);
  const firstOpacity = useTransform(scrollYProgress, [0, .2, .35], [1, 1, 0]);
  const secondOpacity = useTransform(scrollYProgress, [.2, .4, .55, .7], [0, 1, 1, 0]);
  const thirdOpacity = useTransform(scrollYProgress, [.55, .75, 1], [0, 1, 1]);
  const firstX = useTransform(scrollYProgress, [0, .35], [0, -180]);
  const secondX = useTransform(scrollYProgress, [.2, .4, .7], [160, 0, -160]);
  const thirdX = useTransform(scrollYProgress, [.55, .8], [150, 0]);
  return <section id="salto" className={`swing-sequence ${paused ? 'sequence-reduced' : ''}`} ref={ref} aria-label="Sequência do salto">
    <div className="swing-sticky"><motion.div className="swing-footage" style={{ scale: paused ? 1 : scale, rotate: paused ? 0 : rotate }}><MotionFilm source="/assets/swing-motion.mp4" paused={paused} poster="/assets/spider-duo.png" /></motion.div><div className="swing-shade" />
      <motion.div className="swing-web" aria-hidden="true" style={{ scale: paused ? 1 : webScale, rotate: paused ? 0 : webRotate, opacity: paused ? .1 : webOpacity }}><WebPattern /></motion.div>
      <div className="swing-top"><span>A LIBERDADE ESTÁ ENTRE UM SALTO E OUTRO.</span><a href="#cidade">PULAR SEQUÊNCIA <ArrowUpRight size={16} /></a></div>
      <div className="swing-captions"><motion.h2 aria-hidden={paused} style={{ opacity: paused ? 0 : firstOpacity, x: paused ? 0 : firstX }}>SOLTE<br /><span>O CHÃO.</span></motion.h2><motion.h2 aria-hidden={paused} style={{ opacity: paused ? 0 : secondOpacity, x: paused ? 0 : secondX }}>ALCANCE<br /><span>O CÉU.</span></motion.h2><motion.h2 style={{ opacity: paused ? 1 : thirdOpacity, x: paused ? 0 : thirdX }}>ENCONTRE<br /><span>SEU CAMINHO.</span></motion.h2></div>
      <div className="swing-bottom"><span><ArrowDown size={15} /> ROLE PARA SENTIR O SALTO</span><div className="swing-chapters">{['SOLTAR', 'ALCANÇAR', 'ENCONTRAR'].map((label, i) => <span key={label} className={(paused ? 2 : chapter) === i ? 'active' : ''}><i />0{i + 1} / {label}</span>)}</div></div>
    </div>
  </section>;
}
