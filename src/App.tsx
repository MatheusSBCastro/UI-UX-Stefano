import { useState, useRef, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Check, ChevronDown, Copy, Layers3, Play, RotateCcw, SlidersHorizontal, Sparkles, Square, Terminal, WandSparkles } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { AttractButton } from '@/components/ui/attract-button';
import { Reveal } from '@/components/ui/reveal';
import { useMotionPreference } from '@/hooks/use-motion-preference';

const themes = [
  { name: 'Lima', color: '#d0f87b' },
  { name: 'Lavanda', color: '#c9b5ff' },
  { name: 'Coral', color: '#ffb09c' },
];
const tabs = ['Entrada', 'Interação', 'Layout'] as const;
type Tab = typeof tabs[number];
const starterPrompt = 'Crie uma landing page para [seu negócio]. Leia AGENTS.md e use a skill UI UX Pro Max, os componentes locais e Motion. Defina uma identidade visual, implemente o site responsivo e valide o build.';

function Brand() {
  return <a className="brand" href="#inicio" aria-label="Stefano, início"><span className="brand-mark" aria-hidden="true">s.</span><span>stefano<span className="brand-slash"> / </span><span className="brand-sub">interface studio</span></span></a>;
}

function HeroArt({ paused }: { paused: boolean }) {
  return <div className="hero-art" aria-label="Composição de cartões e órbitas animadas">
    <div className="art-grid" />
    <BackgroundPaths paused={paused} />
    <div className="orbit orbit-outer" /><div className="orbit orbit-middle" /><div className="orbit orbit-inner" />
    <motion.div className="orbit-point" animate={paused ? { rotate: 0 } : { rotate: 360 }} transition={{ duration: paused ? 0 : 30, repeat: paused ? 0 : Infinity, ease: 'linear' }}><span /></motion.div>
    <motion.div className="art-card art-card-back" animate={{ y: paused ? 0 : [0, -8, 0], rotate: -12 }} transition={{ duration: paused ? 0 : 6, repeat: paused ? 0 : Infinity }}><div className="art-card-top"><span className="tiny-dot" />EXPERIMENT 001</div><div className="wave-lines">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ height: `${20 + Math.sin(i * 0.5) * 30 + i * 4}%` }} />)}</div><p>Make it move.</p></motion.div>
    <motion.div className="art-card art-card-front" animate={{ y: paused ? 0 : [0, 9, 0], rotate: 8 }} transition={{ duration: paused ? 0 : 7, repeat: paused ? 0 : Infinity }}><div className="art-card-top"><Sparkles size={15} /> A LITTLE MORE FEELING</div><div className="art-glyph" aria-hidden="true"><span /><span /><span /><span /></div><div className="art-card-bottom"><span>Designed to feel.</span><ArrowUpRight size={21} /></div></motion.div>
    <span className="art-note art-note-top">FORM + FEELING</span><span className="art-note art-note-bottom">YOUR NEXT IDEA, IN MOTION.</span>
    <span className="coordinate coordinate-left">01 / 04</span><span className="coordinate coordinate-right">S—26</span>
  </div>;
}

function Playground({ paused }: { paused: boolean }) {
  const [tab, setTab] = useState<Tab>('Entrada');
  const [duration, setDuration] = useState(0.6);
  const [iteration, setIteration] = useState(0);
  const [selected, setSelected] = useState('Forma');
  const [expanded, setExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const transition = { duration: paused ? 0 : duration, ease: [0.22, 1, 0.36, 1] as const };
  return <section id="laboratorio" className="section playground">
    <Reveal><div className="section-heading"><div><p className="eyebrow">01 — PLAYGROUND</p><h2>Veja. Toque. <span>Experimente.</span></h2></div><p>Um pequeno laboratório.<br />Infinitas formas de dar vida a uma ideia.</p></div></Reveal>
    <Reveal><div className="playground-shell">
      <div className="playground-toolbar"><div role="tablist" aria-label="Tipos de animação" className="tabs">{tabs.map((item, index) => <button key={item} ref={(element) => { tabRefs.current[index] = element; }} role="tab" id={`tab-${index}`} aria-selected={tab === item} aria-controls="animation-panel" tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={(event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        setTab(tabs[next]); tabRefs.current[next]?.focus();
      }}>{tab === item && <motion.span className="tab-highlight" layoutId="tab" transition={transition} />}<span>{item}</span></button>)}</div><span className="live-label"><span /> LIVE PREVIEW</span></div>
      <div className="playground-body">
        <div className="demo-stage" id="animation-panel" role="tabpanel" aria-labelledby={`tab-${tabs.indexOf(tab)}`} tabIndex={0}>
          <div className="stage-grid" aria-hidden="true" />
          <AnimatePresence mode="wait"><motion.div key={`${tab}-${iteration}`} className="demo-content" initial={paused ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
            {tab === 'Entrada' && <div className="entry-demo"><span className="demo-label">DA IDEIA À INTERFACE</span><div className="entry-cards">{[Layers3, WandSparkles, Sparkles].map((Icon, i) => <motion.div className="entry-card" key={i} initial={paused ? false : { opacity: 0, y: 55, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: [-9, 0, 9][i] }} transition={{ ...transition, delay: paused ? 0 : i * 0.14 }}><Icon size={38} strokeWidth={1.2} /><span>0{i + 1}</span></motion.div>)}</div><p>Cada detalhe tem seu momento.</p></div>}
            {tab === 'Interação' && <div className="interaction-demo"><span className="demo-label">APROXIME-SE. CLIQUE. SINTA.</span><AttractButton paused={paused} onClick={() => setActiveItem((value) => value + 1)}><Sparkles size={18} /> {activeItem ? `${activeItem} ${activeItem === 1 ? 'clique' : 'cliques'}` : 'Um pouco de magnetismo'} <ArrowUpRight size={18} /></AttractButton><p>Passe o mouse ou use o teclado.</p></div>}
            {tab === 'Layout' && <div className="layout-demo"><span className="demo-label">UMA FORMA. NOVAS POSSIBILIDADES.</span><div className="layout-options">{['Forma', 'Cor', 'Movimento'].map((item) => <button key={item} aria-pressed={selected === item} onClick={() => setSelected(item)}>{selected === item && <motion.span layoutId="selection" transition={transition} />}<span>{item}</span></button>)}</div><motion.button layout transition={transition} className={`layout-card ${expanded ? 'expanded' : ''}`} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><motion.div layout transition={transition} className="layout-icon"><Layers3 size={28} /></motion.div><motion.strong layout transition={transition}>{selected}</motion.strong>{expanded && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>O conteúdo muda.<br />A experiência continua.</motion.p>}<span className="layout-card-action">{expanded ? 'Recolher' : 'Expandir'} <ArrowUpRight size={16} /></span></motion.button></div>}
          </motion.div></AnimatePresence>
          <span className="stage-coordinate">STEFANO / MOTION STUDY</span>
        </div>
        <aside className="playground-controls"><div className="controls-title"><SlidersHorizontal size={18} /><h3>Do seu jeito</h3></div><p>Ajuste o ritmo e encontre a sensação certa.</p><label htmlFor="duration">Duração <output>{duration.toFixed(1)}s</output></label><input id="duration" type="range" min="0.2" max="1.6" step="0.1" value={duration} onChange={(event) => setDuration(Number(event.target.value))} /><div className="range-labels"><span>Mais rápida</span><span>Mais suave</span></div><button className="replay-button" onClick={() => setIteration((value) => value + 1)}><RotateCcw size={16} /> Repetir animação</button><div className="controls-note"><span className="tiny-dot" />{paused ? 'Movimento reduzido ativo.' : 'Feito para explorar, sem pressa.'}</div></aside>
      </div>
    </div></Reveal>
  </section>;
}

export default function App() {
  const systemReduced = useMotionPreference();
  const [manualPaused, setManualPaused] = useState(false);
  const [theme, setTheme] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showPrompt, setShowPrompt] = useState(false);
  const paused = Boolean(systemReduced || manualPaused);
  async function copyPrompt() {
    setShowPrompt(true);
    try { await navigator.clipboard.writeText(starterPrompt); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  }
  return <div className="app" style={{ '--accent': themes[theme].color } as CSSProperties}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header"><Brand /><nav aria-label="Navegação principal"><a href="#laboratorio">Laboratório</a><a href="#componentes">Componentes</a><a href="#comecar" className="nav-cta">Começar <ArrowUpRight size={15} /></a></nav></header>
    <main id="conteudo"><section id="inicio" className="hero"><div className="hero-copy"><Reveal><p className="eyebrow hero-eyebrow"><span className="tiny-dot" /> SEU PRÓXIMO SITE COMEÇA AQUI</p><h1>Interfaces<br />que você<br /><span>sente.</span><span className="heading-star" aria-hidden="true">✳</span></h1><p className="hero-description">Boas ideias merecem mais que uma tela.<br />Dê forma, personalidade e movimento<br className="desktop-break" /> ao que você quer criar.</p><div className="hero-actions"><a className="primary-link" href="#laboratorio">Explorar o laboratório <ArrowUpRight size={20} /></a><a className="text-link" href="#comecar">Criar algo meu <ArrowRight size={17} /></a></div><div className="hero-footnote"><span className="mini-stack"><Layers3 size={16} /><Sparkles size={16} /><Terminal size={16} /></span><span>Design, componentes e movimento.<br /><strong>Um ponto de partida que é seu.</strong></span></div></Reveal></div><Reveal className="hero-art-wrap" delay={0.15}><HeroArt paused={paused} /></Reveal><a href="#laboratorio" className="scroll-hint">ROLE PARA EXPLORAR <ChevronDown size={16} /></a></section>
    <div className="manifesto-strip"><span>IDEIAS BOAS.</span><span className="strip-star">✳</span><span>INTERFACES VIVAS.</span><span className="strip-star">✳</span><span>FEITAS DO SEU JEITO.</span><span className="strip-star">✳</span></div>
    <Playground paused={paused} />
    <section id="componentes" className="section component-section"><Reveal><div className="section-heading"><div><p className="eyebrow">02 — PEÇAS PARA CRIAR</p><h2>Uma boa base.<br /><span>O resto é sua ideia.</span></h2></div><p>Escolha o detalhe que faz diferença.<br />Combine. Adapte. Faça seu.</p></div></Reveal><div className="component-grid"><Reveal><article className="component-card"><div className="component-preview path-preview"><BackgroundPaths paused={paused} /><span className="preview-word">flow.</span></div><div className="component-info"><span className="component-number">01 / BACKGROUND</span><h3>Background Paths</h3><p>Linhas que dão profundidade.<br />Um fundo com presença e leveza.</p><a href="https://21st.dev/community/components/kokonutd/background-paths/default" target="_blank" rel="noreferrer">Conhecer a origem <ArrowUpRight size={17} /></a></div></article></Reveal><Reveal delay={0.1}><article className="component-card"><div className="component-preview button-preview"><AttractButton paused={paused} onClick={() => { document.getElementById('laboratorio')?.scrollIntoView({ behavior: paused ? 'instant' : 'smooth' }); }}>Chegue mais <ArrowUpRight size={18} /></AttractButton></div><div className="component-info"><span className="component-number">02 / INTERACTION</span><h3>Attract Button</h3><p>Pequenas partículas, um convite.<br />Uma interação que você percebe.</p><a href="https://github.com/kokonut-labs/kokonutui/blob/484760acbb973947012cb554c91c742b1559275b/components/kokonutui/attract-button.tsx" target="_blank" rel="noreferrer">Conhecer a origem <ArrowUpRight size={17} /></a></div></article></Reveal><Reveal delay={0.2}><article className="component-card"><div className="component-preview theme-preview"><div className="swatch-stack" aria-hidden="true"><div style={{ background: themes[0].color }} /><div style={{ background: themes[1].color }} /><div style={{ background: themes[2].color }} /></div></div><div className="component-info"><span className="component-number">03 / PERSONALITY</span><h3>O toque é seu</h3><p>Uma identidade, outras sensações.<br />Experimente a cor desta página.</p><div className="theme-switcher" role="group" aria-label="Cor de destaque">{themes.map((item, index) => <button key={item.name} aria-label={item.name} aria-pressed={index === theme} style={{ background: item.color }} onClick={() => setTheme(index)}>{theme === index && <Check size={17} aria-hidden="true" />}</button>)}</div></div></article></Reveal></div></section>
    <section id="comecar" className="section start-section"><Reveal><div className="start-panel"><div><p className="eyebrow">03 — PRÓXIMA IDEIA</p><h2>Agora, crie<br /><span>algo seu.</span></h2><p>Uma landing page, um portfólio, uma experiência.<br />Esta base está pronta para seguir a sua direção.</p><button className="primary-link" onClick={copyPrompt}>{copyStatus === 'copied' ? <Check size={19} /> : <Copy size={19} />}{copyStatus === 'copied' ? 'Prompt copiado' : 'Copiar meu ponto de partida'}</button><p className="copy-feedback" role="status">{copyStatus === 'copied' ? 'Cole no agente de código aberto nesta pasta.' : copyStatus === 'error' ? 'Selecione e copie o texto abaixo.' : 'Um convite para tirar sua ideia do papel.'}</p>{showPrompt && <textarea aria-label="Prompt para criar um site" className="prompt-text" readOnly value={starterPrompt} onFocus={(event) => event.target.select()} />}</div><div className="start-art" aria-hidden="true"><div className="start-plus">+</div><span>YOUR IDEA<br />GOES HERE.</span><ArrowUpRight size={64} strokeWidth={1} /></div></div></Reveal></section>
    </main><footer className="site-footer"><Brand /><p>Feito para começar. Aberto para reinventar.</p><button className="motion-toggle" aria-pressed={paused} disabled={Boolean(systemReduced)} onClick={() => setManualPaused(!manualPaused)}>{paused ? <Play size={14} /> : <Square size={12} />}{systemReduced ? 'Movimento reduzido do sistema' : paused ? 'Ativar movimento' : 'Pausar movimento'}</button></footer>
  </div>;
}
