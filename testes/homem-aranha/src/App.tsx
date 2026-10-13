import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from 'react';
import { AnimatePresence, motion, MotionConfig, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'motion/react';
import { ArrowUpRight, ArrowRight, ArrowDown, ChevronRight, Crosshair, Zap, Shield, Fingerprint, Menu, X, Pause, Play, RotateCcw, MapPin, MoveUpRight } from 'lucide-react';
import { AttractButton } from '@/components/ui/attract-button';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { useMotionPreference } from '@/hooks/use-motion-preference';
import { SpiderMark, WebPattern, CityMap } from './graphics';
import { CinematicIntro, HeroMotionControls, MotionFilm, SwingSequence, TiltCard } from './effects';

const characters = [
  { name: 'Peter Parker', label: 'O original', number: '01', color: '#f23b50', art: 'spider-duo.png', position: '17% center', subtitle: 'Um garoto do Queens. Uma responsabilidade gigante.', copy: 'Entre a vida comum e os telhados de Nova York, Peter escolhe fazer a coisa certa. A máscara pode esconder seu rosto. A coragem mostra quem ele é.', tags: ['Engenhosidade', 'Sentido aranha', 'Coração de herói'], url: 'https://www.marvel.com/characters/spider-man-peter-parker' },
  { name: 'Miles Morales', label: 'Um novo ritmo', number: '02', color: '#ff6d59', art: 'spider-duo.png', position: '87% center', subtitle: 'Outra voz. O mesmo chamado.', copy: 'Miles não precisa seguir os passos de ninguém para encontrar seu lugar. Com criatividade, coragem e seu próprio jeito, ele dá um novo ritmo ao legado do Homem-Aranha.', tags: ['Criatividade', 'Bioeletricidade', 'Estilo próprio'], url: 'https://www.marvel.com/characters/spider-man-miles-morales' },
  { name: 'Traje Simbionte', label: 'O outro lado', number: '03', color: '#c2c9ed', art: 'symbiote.png', position: '52% center', subtitle: 'Mais poder. Um limite a descobrir.', copy: 'O traje preto muda mais que a aparência. Uma presença alienígena coloca Peter diante de uma nova pergunta: até onde o poder ajuda, e quando começa a tomar o controle?', tags: ['Simbionte', 'Poder ampliado', 'Conflito interior'], url: 'https://www.marvel.com/comics/guides/1413/symbiote_hos' },
];
const neighborhoods = [
  { name: 'Manhattan', title: 'A cidade\nnunca para.', description: 'Entre fachadas de vidro e luzes que nunca se apagam, cada salto encontra um novo horizonte.', label: 'ARRANHA-CÉUS / HORIZONTE', coordinate: '40.7831° N / 73.9712° W' },
  { name: 'Brooklyn', title: 'Cada rua\ntem seu ritmo.', description: 'Arte nos muros, histórias nas esquinas. Aqui, a cidade tem personalidade — e espaço para uma nova geração.', label: 'RUAS / PERSONALIDADE', coordinate: '40.6782° N / 73.9442° W' },
  { name: 'Queens', title: 'Todo herói\ncomeça em casa.', description: 'Antes dos grandes saltos, existem as pequenas escolhas. O bairro lembra que salvar o mundo começa por cuidar de quem está perto.', label: 'BAIRRO / ORIGEM', coordinate: '40.7282° N / 73.7949° W' },
];

function Reveal({ children, paused, className = '', delay = 0 }: { children: ReactNode; paused: boolean; className?: string; delay?: number }) {
  return <motion.div className={className} initial={paused ? false : { opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: paused ? 0 : .7, delay: paused ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Brand() {
  return <a href="#inicio" className="spider-brand" aria-label="Spider-Verse, início"><SpiderMark /><span>SPIDER<span className="brand-red">—</span>VERSE<small>UMA EXPERIÊNCIA DE FÃ</small></span></a>;
}

function Hero({ paused, replay }: { paused: boolean; replay: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '17%']);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const copyOpacity = useTransform(scrollYProgress, [0, .7], [1, .2]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 70, damping: 25 });
  const y = useSpring(pointerY, { stiffness: 70, damping: 25 });
  return <section id="inicio" className="hero-scene" ref={ref} onPointerMove={(event) => {
    if (paused || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) / rect.width * 16);
    pointerY.set((event.clientY - rect.top - rect.height / 2) / rect.height * 10);
  }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
    <motion.div className="hero-image-layer" initial={paused ? false : { scale: 1.2, opacity: .2 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: paused ? 0 : 2.4, ease: [.16, 1, .3, 1] }} style={{ y: paused ? 0 : imageY }}><motion.img src="/assets/spider-hero.png" alt="Peter Parker e Miles Morales em poses de ação, com seus trajes vermelho e azul e preto e vermelho" width="1920" height="717" fetchPriority="high" style={{ x: paused ? 0 : x, y: paused ? 0 : y }} /><MotionFilm source="/assets/hero-motion.mp4" paused={paused} className="hero-motion-film" /></motion.div>
    <div className="hero-shade" /><div className="film-grain" />
    <div className="hero-topline"><span><i /> NOVA YORK PRECISA DE UM HERÓI.</span><span>EST. 1962 / ALWAYS AMAZING</span></div>
    <motion.div className="hero-copy" style={{ y: paused ? 0 : copyY, opacity: paused ? 1 : copyOpacity }}><Reveal paused={paused}><div className="hero-kicker"><span className="kicker-line" /> MAIS QUE UM HERÓI.</div><h1 aria-label="Seu amigo da vizinhança"><motion.span className="hero-title-line" initial={paused ? false : { y: 75, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: paused ? 0 : .9, delay: paused ? 0 : 1.1, ease: [.16, 1, .3, 1] }}>SEU AMIGO</motion.span><motion.span className="hero-title-line" initial={paused ? false : { y: 75, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: paused ? 0 : .9, delay: paused ? 0 : 1.25, ease: [.16, 1, .3, 1] }}>DA <span className="outline-title">VIZI</span></motion.span><motion.span className="hero-title-line red-title" initial={paused ? false : { y: 75, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: paused ? 0 : .9, delay: paused ? 0 : 1.4, ease: [.16, 1, .3, 1] }}>NHANÇA.</motion.span></h1><p>Alguns olham para o céu.<br />Outros fazem dele seu caminho.</p><div className="hero-actions"><a className="red-button" href="#universo">ENTRAR NO ARANHAVERSO <ArrowUpRight size={20} /></a><a className="secondary-action" href="#origem">Descobrir a história <ArrowRight size={17} /></a></div></Reveal></motion.div>
    <div className="hero-annotation" aria-hidden="true"><span className="annotation-cross">+</span><div>PETER PARKER<br /><span>FRIENDLY NEIGHBORHOOD HERO</span></div><span className="annotation-line" /></div>
    <div className="hero-bottom"><a href="#origem" className="scroll-cue"><span className="scroll-circle"><ArrowDown size={17} /></span>O PRÓXIMO SALTO COMEÇA AQUI</a><div className="hero-edition"><b>01</b><span>/ 03</span><div className="edition-line" /></div><span className="hero-credit">QUEENS, NYC<br />NO FRIENDLY HERO LEFT BEHIND.</span></div>
    <HeroMotionControls paused={paused} replay={replay} />
  </section>;
}

function Origin({ paused }: { paused: boolean }) {
  return <section className="origin-section" id="origem"><div className="editorial-top"><span>01 / POR TRÁS DA MÁSCARA</span><SpiderMark /><span>UM HERÓI. MUITAS POSSIBILIDADES.</span></div><div className="origin-grid"><Reveal paused={paused} className="origin-statement"><h2>NÃO É<br />A <span>MÁSCARA.</span><br />É QUEM ESTÁ<br />POR TRÁS DELA<span className="red-period">.</span></h2></Reveal><Reveal paused={paused} delay={.12} className="origin-copy"><span className="editorial-tag">O EXTRAORDINÁRIO VEM DO COMUM.</span><p>Antes do salto, existe uma escolha.<br />Antes do herói, existe uma pessoa.</p><p>O Homem-Aranha lembra que coragem não é deixar de sentir medo. É continuar, mesmo quando a cidade parece grande demais.</p><div className="responsibility"><Shield size={22} /><span>Grandes poderes.<br /><strong>Grandes responsabilidades.</strong></span></div><a href="#universo" className="dark-link">Conheça quem usa a máscara <ArrowUpRight size={20} /></a></Reveal></div><div className="origin-bottom"><span>QUEM DISSE QUE VOCÊ PRECISA SER PERFEITO<br />PARA FAZER A DIFERENÇA?</span><div className="editorial-stamp"><span>YOUR<br />FRIENDLY<br />NEIGHBOR</span><SpiderMark /></div></div><WebPattern className="origin-web" /></section>;
}

function Universe({ paused }: { paused: boolean }) {
  const [selected, setSelected] = useState(0);
  const current = characters[selected];
  return <section className="universe-section section" id="universo"><Reveal paused={paused}><div className="section-top"><span className="section-label">02 / ENTRE DIMENSÕES</span><span className="section-side">DIFERENTES MÁSCARAS. A MESMA CORAGEM.</span></div><div className="section-heading"><h2>UM LEGADO.<br /><span>INFINITAS VERSÕES.</span></h2><p>O universo é grande demais<br />para uma história só.<br /><span>Escolha sua perspectiva.</span></p></div></Reveal>
    <div className="character-grid" role="group" aria-label="Escolher personagem">{characters.map((character, index) => <Reveal paused={paused} delay={index * .08} key={character.name}><TiltCard paused={paused}><motion.button className={`character-card ${selected === index ? 'is-selected' : ''}`} style={{ '--character-accent': character.color } as CSSProperties} aria-pressed={selected === index} onClick={() => setSelected(index)} whileHover={paused ? {} : { y: -8 }} transition={{ duration: .3 }}>
      <div className="character-art" role="img" aria-label={`Arte de ${character.name}`} style={{ backgroundImage: `url('/assets/${character.art}')`, backgroundPosition: character.position }} /><div className="character-shade" /><div className="character-card-top"><span>{character.number} / SPIDER-VERSE</span><ArrowUpRight size={19} /></div><div className="character-caption"><span>{character.label}</span><h3>{character.name}</h3><div className="character-line" /></div><div className="character-selection">{selected === index ? 'PERSPECTIVA ATIVA' : 'EXPLORAR PERSONAGEM'} <ChevronRight size={15} /></div>
    </motion.button></TiltCard></Reveal>)}</div>
    <div className="character-detail" style={{ '--character-accent': current.color } as CSSProperties}><div className="character-detail-icon"><SpiderMark /></div><AnimatePresence mode="wait"><motion.div key={current.name} className="character-detail-copy" initial={paused ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: paused ? 0 : .25 }} aria-live="polite"><span className="detail-eyebrow">{current.name.toUpperCase()} / {current.label.toUpperCase()}</span><h3>{current.subtitle}</h3><p>{current.copy}</p><div className="character-tags">{current.tags.map((tag, i) => <span key={tag}>{i === 0 ? <Fingerprint size={15} /> : i === 1 ? <Zap size={15} /> : <Shield size={15} />}{tag}</span>)}</div></motion.div></AnimatePresence><a className="character-source" href={current.url} target="_blank" rel="noreferrer" aria-label={`Conhecer ${current.name} na Marvel`}>MAIS SOBRE<br />O PERSONAGEM <ArrowUpRight size={26} /></a></div>
  </section>;
}

function City({ paused }: { paused: boolean }) {
  const [selected, setSelected] = useState(0);
  const location = neighborhoods[selected];
  return <section className="city-section section" id="cidade"><Reveal paused={paused}><div className="section-top"><span className="section-label">03 / A CIDADE É SEU QUINTAL</span><span className="section-side">NEW YORK. NEW PERSPECTIVES.</span></div></Reveal><div className="city-layout"><Reveal paused={paused} className="city-copy"><span className="city-small">ESCOLHA SEU PRÓXIMO DESTINO</span><AnimatePresence mode="wait"><motion.div key={location.name} initial={paused ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: paused ? 0 : .25 }}><h2>{location.title.split('\n').map((line, i) => <span key={line} className={i ? 'city-title-muted' : ''}>{line}<br /></span>)}</h2><p className="city-description">{location.description}</p></motion.div></AnimatePresence><div className="city-options" role="group" aria-label="Explorar bairros de Nova York">{neighborhoods.map((item, i) => <button key={item.name} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>0{i + 1}</span>{item.name}<ArrowUpRight size={18} /></button>)}</div><span className="map-disclaimer">MAPA ILUSTRATIVO / UMA NOVA PERSPECTIVA DA CIDADE</span></Reveal><Reveal paused={paused} className="map-frame"><div className="map-frame-header"><span><MapPin size={13} /> {location.name.toUpperCase()}</span><span>LIVE EXPLORER</span></div><CityMap selected={selected} /><div className="map-frame-footer"><span>{location.label}</span><span className="map-radar" aria-hidden="true"><i /></span></div></Reveal></div></section>;
}

const targets = [{ x: 27, y: 35 }, { x: 66, y: 63 }, { x: 44, y: 27 }, { x: 73, y: 36 }, { x: 34, y: 65 }];
function Training({ paused }: { paused: boolean }) {
  const [hits, setHits] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lastHit, setLastHit] = useState<{ x: number; y: number } | null>(null);
  const [sense, setSense] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { amount: .15 });
  const complete = hits === 5;
  useEffect(() => { if (playing) targetRef.current?.focus({ preventScroll: true }); }, [playing]);
  useEffect(() => { if (complete) startRef.current?.querySelector('button')?.focus({ preventScroll: true }); }, [complete]);
  function start() { setHits(0); setLastHit(null); setPlaying(true); }
  function hit() {
    if (!playing) return;
    setLastHit(targets[hits]);
    const next = hits + 1;
    setHits(next);
    if (next === 5) setPlaying(false);
  }
  const target = targets[Math.min(hits, 4)];
  return <section className={`training-section section ${sense ? 'sense-active' : ''}`} id="treino" ref={ref}><Reveal paused={paused}><div className="section-top"><span className="section-label">04 / SEU MOMENTO DE HERÓI</span><span className="section-side">A CIDADE ESTÁ CHAMANDO.</span></div><div className="section-heading"><h2>CONFIE NO<br /><span>SEU INSTINTO.</span></h2><p>Uma teia. Cinco alvos.<br />Pronto para seu primeiro salto?</p></div></Reveal><Reveal paused={paused}><div className="training-shell"><div className="training-board" role="region" aria-label="Treino de mira"><BackgroundPaths paused={paused || !inView} /><div className="training-grid" /><div className="board-head"><span><Crosshair size={14} /> WEB-SHOOTER / ONLINE</span><span className="board-dots" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} className={hits > i ? 'hit' : ''} />)}</span></div><svg className="web-shot" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{lastHit && <motion.path key={hits} d={`M 6 100 Q 25 65 ${lastHit.x} ${lastHit.y}`} fill="none" stroke="#eef1ff" strokeWidth=".25" initial={paused ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: paused ? 0 : .25 }} />}</svg>
      {playing ? <motion.button ref={targetRef} className="aim-target" aria-label={`Acertar alvo ${hits + 1} de 5`} onClick={hit} initial={false} animate={{ left: `${target.x}%`, top: `${target.y}%` }} transition={{ type: 'spring', stiffness: paused ? 10000 : 140, damping: 20, duration: paused ? 0 : undefined }}><Crosshair size={32} /><span>0{hits + 1}</span></motion.button> : <div className="board-idle"><SpiderMark /><span>{complete ? 'SENTIDO ARANHA AFINADO.' : 'TODO GRANDE SALTO\nCOMEÇA COM UM PRIMEIRO MOVIMENTO.'}</span><p>{complete ? 'Cinco alvos. Cinco acertos. A cidade pode contar com você.' : 'Clique em iniciar e acerte os cinco alvos.'}</p></div>}
      <div className="board-bottom"><span>SIMULAÇÃO / SEM LIMITE DE TEMPO</span><span>{complete ? 'TREINO CONCLUÍDO' : playing ? 'MIRA ATIVA' : 'AGUARDANDO HERÓI'}</span></div></div><aside className="training-controls"><span className="training-label">TREINO DE TEIA</span><h3>O reflexo<br />é seu.</h3><p>Clique nos alvos ou use Tab e Enter. Cada acerto abre um novo caminho.</p><div className="score" role="status" aria-live="polite"><strong>{hits.toString().padStart(2, '0')}</strong><span>/ 05<br />ALVOS ATINGIDOS</span></div><div ref={startRef}><AttractButton paused={paused || !inView} className="training-start" onClick={start} disabled={playing}>{playing ? 'TREINO EM ANDAMENTO' : complete ? 'TREINAR NOVAMENTE' : 'INICIAR TREINO'}{complete ? <RotateCcw size={17} /> : <ArrowUpRight size={18} />}</AttractButton></div><button className="sense-button" aria-pressed={sense} onClick={() => setSense(!sense)}><Zap size={16} />{sense ? 'Sentido aranha ativado' : 'Ativar sentido aranha'}</button><span className="training-help">{sense ? 'O radar destaca o próximo alvo.' : 'Sem pressa. Seu caminho, seu ritmo.'}</span></aside></div></Reveal></section>;
}

export default function App() {
  const systemReduced = useMotionPreference();
  const [manualPause, setManualPause] = useState(false);
  const [menu, setMenu] = useState(false);
  const [introCycle, setIntroCycle] = useState(0);
  // This demonstration explicitly starts with full motion at the user's request.
  // The page toggle remains available; system preferences are not modified.
  const paused = manualPause;
  const { scrollYProgress } = useScroll();
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  return <MotionConfig reducedMotion={paused ? 'always' : 'never'}><div className="spider-site" data-paused={paused} data-motion-mode={paused ? 'reduced' : 'full'}>
    <CinematicIntro paused={paused} cycle={introCycle} />
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a><motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} />
    <header className="site-header"><Brand /><button className="header-motion-toggle" aria-pressed={!paused} aria-label={paused ? 'Ativar movimento completo' : 'Reduzir movimento'} title={systemReduced ? 'Modo cinematográfico escolhido para este teste; use este botão para reduzir o movimento.' : 'Ative ou reduza os efeitos desta experiência.'} onClick={() => setManualPause(!manualPause)}>{paused ? <Play size={13} /> : <Zap size={13} />}<span>{paused ? 'ANIMAÇÕES PAUSADAS' : 'ANIMAÇÕES ATIVAS'}</span></button><nav className={menu ? 'nav-open' : ''} aria-label="Navegação principal" id="main-nav"><a href="#origem" onClick={() => setMenu(false)}>A história</a><a href="#universo" onClick={() => setMenu(false)}>Aranhaverso</a><a href="#cidade" onClick={() => setMenu(false)}>Nova York</a><a href="#treino" className="header-cta" onClick={() => setMenu(false)}>SEJA O HERÓI <ArrowUpRight size={17} /></a></nav><button className="mobile-menu" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-controls="main-nav" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={23} /> : <Menu size={23} />}</button></header>
    <main id="conteudo"><Hero paused={paused} replay={() => setIntroCycle((value) => value + 1)} /><div className="ticker" aria-hidden="true"><div className="ticker-track"><span>WITH GREAT POWER</span><SpiderMark /><span>COMES GREAT RESPONSIBILITY</span><SpiderMark /><span>WITH GREAT POWER</span><SpiderMark /><span>COMES GREAT RESPONSIBILITY</span><SpiderMark /></div></div><Origin paused={paused} /><Universe paused={paused} /><SwingSequence paused={paused} /><City paused={paused} /><Training paused={paused} />
    <section className="final-scene"><img src="/assets/spider-hero.png" alt="" loading="lazy" /><div className="final-shade" /><WebPattern className="final-web" /><Reveal paused={paused} className="final-copy"><span>NINGUÉM PRECISA SALVAR O MUNDO SOZINHO.</span><h2>O PRÓXIMO<br />SALTO É <em>SEU.</em></h2><a className="red-button" href="#inicio">VOLTAR AO TOPO <MoveUpRight size={19} /></a></Reveal></section></main>
    <footer className="site-footer"><div className="footer-top"><Brand /><a href="#treino">UM POUCO MAIS DE CORAGEM. <ArrowUpRight size={17} /></a></div><div className="footer-bottom"><p>Uma homenagem feita por fãs. Personagens pertencem à Marvel.<br /><span>Experimento visual do UI-UX-Stefano / 2026</span></p><button className="motion-toggle" aria-pressed={paused} onClick={() => setManualPause(!manualPause)}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Ativar animações' : 'Pausar animações'}</button><a href="https://www.marvel.com/characters/spider-man-peter-parker" target="_blank" rel="noreferrer">UNIVERSO MARVEL <ArrowUpRight size={15} /></a></div></footer>
  </div></MotionConfig>;
}
