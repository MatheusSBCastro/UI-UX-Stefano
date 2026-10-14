import { useEffect,useRef,useState,type ReactNode } from 'react';
import { AnimatePresence,motion,useReducedMotion } from 'motion/react';
import { Activity,ArrowDown,ArrowLeft,ArrowRight,ArrowUp,ArrowUpRight,BookOpen,Box,Check,ChevronRight,ChevronDown,Eye,EyeOff,Focus,Heart,Info,Layers,Maximize2,Minus,Move,Pause,Play,Plus,RotateCcw,Search,SlidersHorizontal,Sparkles,Undo2,X } from 'lucide-react';
import { AttractButton } from '@/components/ui/attract-button';
import { Viewport,type ViewportHandle } from './Viewport';
import type { LayerId } from './anatomy';
import { ORGANS,SYSTEMS } from './data';

const LAYERS:{id:LayerId;name:string;hint:string;color:string}[]=[
  {id:'skin',name:'Pele',hint:'Proteção e sensibilidade',color:'#d7ab89'},
  {id:'fat',name:'Tecido subcutâneo',hint:'Reserva e isolamento',color:'#dbc271'},
  {id:'fascia',name:'Fáscias',hint:'Conexão e sustentação',color:'#d3dcd5'},
  {id:'muscles',name:'Músculos',hint:'Movimento e força',color:'#c57067'},
  {id:'organs',name:'Órgãos',hint:'Sistemas em equilíbrio',color:'#d0f87b'},
  {id:'vessels',name:'Vasos sanguíneos',hint:'Uma rede de transporte',color:'#b386ce'},
  {id:'nerves',name:'Sistema nervoso',hint:'Conexões e respostas',color:'#e2c979'},
  {id:'bones',name:'Esqueleto',hint:'A estrutura do corpo',color:'#e7ddc3'},
];
type ModalState='system'|'inspect'|'guide'|'sources'|null;
const iconProps={size:18,'aria-hidden':true as const,strokeWidth:1.6};

function Modal({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}){
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const previous=document.activeElement as HTMLElement|null;dialog.current?.showModal();const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.current?.close();document.body.style.overflow=previousOverflow;previous?.focus();};},[]);
  return <dialog ref={dialog} className={`modal ${wide?'wide':''}`} aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}}>
    <header className="modal-heading"><div><span className="eyebrow">ATLAS HUMANO / EXPLORAR</span><h2 id="dialog-title">{title}</h2></div><button className="icon-button" aria-label="Fechar janela" onClick={onClose}><X {...iconProps}/></button></header>{children}
  </dialog>;
}

function ViewTools({viewer,prefix='corpo'}:{viewer:React.RefObject<ViewportHandle|null>;prefix?:string}){
  return <div className="view-tools" aria-label={`Controles do ${prefix}`}>
    <button className="icon-button" aria-label={`Girar ${prefix} para a esquerda`} title="Girar à esquerda" onClick={()=>viewer.current?.rotate(-.35,0)}><ArrowLeft {...iconProps}/></button>
    <button className="icon-button" aria-label={`Girar ${prefix} para a direita`} title="Girar à direita" onClick={()=>viewer.current?.rotate(.35,0)}><ArrowRight {...iconProps}/></button>
    <button className="icon-button" aria-label={`Girar ${prefix} para cima`} title="Girar para cima" onClick={()=>viewer.current?.rotate(0,-.25)}><ArrowUp {...iconProps}/></button>
    <button className="icon-button" aria-label={`Girar ${prefix} para baixo`} title="Girar para baixo" onClick={()=>viewer.current?.rotate(0,.25)}><ArrowDown {...iconProps}/></button>
    <span className="tool-separator"/>
    <button className="icon-button" aria-label={`Ampliar ${prefix}`} title="Ampliar" onClick={()=>viewer.current?.zoom(.85)}><Plus {...iconProps}/></button>
    <button className="icon-button" aria-label={`Reduzir ${prefix}`} title="Reduzir" onClick={()=>viewer.current?.zoom(1.18)}><Minus {...iconProps}/></button>
    <button className="icon-button" aria-label={`Centralizar ${prefix}`} title="Centralizar" onClick={()=>viewer.current?.reset()}><Focus {...iconProps}/></button>
  </div>;
}

export default function App(){
  const reduced=!!useReducedMotion();
  const [layers,setLayers]=useState<LayerId[]>(['organs']),[combine,setCombine]=useState(false),[opacity,setOpacity]=useState(100),[outline,setOutline]=useState(true);
  const [selected,setSelected]=useState('heart'),[extracted,setExtracted]=useState<string|null>(null),[modal,setModal]=useState<ModalState>(null);
  const [query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[rotation,setRotation]=useState(false),[ready,setReady]=useState(false),[view,setView]=useState<'front'|'back'|'side'>('front');
  const body=useRef<ViewportHandle>(null),organView=useRef<ViewportHandle>(null);
  const organ=ORGANS.find(o=>o.id===selected)!,system=SYSTEMS[organ.system];
  const primaryLayer=LAYERS.find(l=>l.id===layers[0]);
  const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const filtered=ORGANS.filter(o=>(filter==='all'||o.system===filter)&&normalize(o.name).includes(normalize(query)));
  const chooseOrgan=(id:string)=>{setSelected(id);setLayers(['organs']);setModal('system');};
  const inspect=()=>{setLayers(['organs']);setExtracted(selected);setModal('inspect');setRotation(false);};
  const restore=()=>{setExtracted(null);setModal(null);setRotation(false);};
  const chooseLayer=(id:LayerId)=>{setLayers(current=>combine?(current.includes(id)?current.filter(l=>l!==id):[...current,id]):[id]);setOpacity(100);};
  const changeView=(value:'front'|'back'|'side')=>{setView(value);body.current?.view(value);};
  const reset=()=>{setLayers(['organs']);setOpacity(100);setOutline(true);setCombine(false);setExtracted(null);setRotation(false);setView('front');body.current?.reset();};

  return <div className="atlas-app">
    <a href="#explorador" className="skip-link">Ir para o explorador</a>
    <header className="app-header">
      <a className="atlas-brand" href="#" aria-label="Atlas Humano, início"><span className="atlas-mark"><Activity size={25} strokeWidth={1.6}/></span><span>atlas<span className="brand-light">humano</span><small>UM UNIVERSO POR DENTRO</small></span></a>
      <nav aria-label="Navegação principal"><a href="#explorador" className="nav-active">Explorar anatomia</a><button onClick={()=>setModal('guide')}>Como explorar <ArrowUpRight size={15}/></button></nav>
      <div className="project-signature"><span className="status-dot"/> LABORATÓRIO INTERATIVO <span className="experiment">02</span></div>
    </header>

    <main id="explorador">
      <div className="intro-row"><div><div className="eyebrow"><span/> ANATOMIA, CAMADA POR CAMADA</div><h1>Descubra o que <em>move você.</em></h1></div><p>Um corpo. Muitos sistemas.<br/>Explore as conexões que fazem a vida acontecer.</p></div>
      <div className="workspace">
        <aside className="layer-panel" aria-label="Camadas anatômicas">
          <div className="panel-title"><span><Layers {...iconProps}/> Camadas do corpo</span><span className="count-badge">08</span></div>
          <p className="panel-description">Da superfície à estrutura.</p>
          <div className="layer-list">{LAYERS.map((layer,index)=>{const active=layers.includes(layer.id);return <button key={layer.id} className={`layer-option ${active?'active':''}`} aria-label={`Camada ${layer.name}`} aria-pressed={active} onClick={()=>chooseLayer(layer.id)}>
            <span className="layer-number">0{index+1}</span><span className="layer-swatch" style={{'--layer-color':layer.color} as React.CSSProperties}><span/></span><span className="layer-copy"><strong>{layer.name}</strong><small>{layer.hint}</small></span>{active?<Eye size={16}/>:<ChevronRight size={15}/>}</button>;})}</div>
          <label className="switch-row"><span>Combinar camadas</span><input type="checkbox" checked={combine} onChange={e=>{setCombine(e.target.checked);if(!e.target.checked)setLayers(current=>[current[0]||'organs']);}}/><span className="switch" aria-hidden="true"/></label>
          <div className="layer-settings"><label htmlFor="opacity">Opacidade <output>{opacity}%</output></label><input id="opacity" aria-label="Opacidade das camadas" type="range" min="20" max="100" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/><label className="outline-option"><input type="checkbox" checked={outline} onChange={e=>setOutline(e.target.checked)}/><span>Contorno do corpo</span></label></div>
          <div className="tip"><Sparkles size={16}/><p>Experimente combinar <strong>ossos e músculos</strong> para entender o movimento.</p></div>
        </aside>

        <section className="body-stage" aria-label="Exploração tridimensional">
          <div className="stage-grid" aria-hidden="true"/><div className="stage-halo" aria-hidden="true"/>
          <div className="stage-top"><span className="stage-label"><span className="status-dot"/>{layers.length>1?'CAMADAS COMBINADAS':primaryLayer?.name.toUpperCase()||'CONTORNO'} <span>/ 3D</span></span><button className="icon-button" aria-label="Restaurar exploração" title="Restaurar exploração" onClick={reset}><RotateCcw {...iconProps}/></button></div>
          <div className="anatomy-axis left-axis" aria-hidden="true"><span>SUPERIOR</span><i/><span>INFERIOR</span></div>
          <Viewport ref={body} layers={layers} opacity={opacity} outline={outline} selected={selected} extracted={extracted} onPick={chooseOrgan} autoRotate={rotation&&modal===null} reducedMotion={reduced} onReady={()=>setReady(true)}/>
          {!ready&&<div className="loading-model" role="status"><Activity size={25}/><span>Preparando seu atlas…</span></div>}
          <div className="orientation"><button aria-pressed={view==='front'} onClick={()=>changeView('front')}>Anterior</button><button aria-pressed={view==='back'} onClick={()=>changeView('back')}>Posterior</button><button aria-pressed={view==='side'} onClick={()=>changeView('side')}>Lateral</button></div>
          <div className="stage-bottom"><div className="gesture-note"><Move size={15}/><span>Arraste para girar <span>·</span> Role para ampliar</span></div><ViewTools viewer={body}/></div>
          <div className="stage-caption"><span>MODELO ANATÔMICO ESQUEMÁTICO</span><button className="text-button" onClick={()=>setRotation(v=>!v)} disabled={reduced} aria-pressed={rotation} aria-label={rotation?'Pausar rotação automática':'Iniciar rotação automática'}>{rotation?<Pause size={13}/>:<Play size={13}/>} {reduced?'Movimento reduzido':rotation?'Pausar':'Girar automaticamente'}</button></div>
        </section>

        <aside className="explore-panel" aria-label="Órgãos e sistemas">
          <div className="panel-title"><span><Box {...iconProps}/> Explore por dentro</span><span className="count-badge">17</span></div>
          <p className="panel-description">Selecione no corpo ou encontre abaixo.</p>
          <label className="search-field"><Search size={17}/><input aria-label="Buscar órgão" placeholder="Buscar órgão…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Limpar busca" onClick={()=>setQuery('')}><X size={15}/></button>}</label>
          <div className="system-select"><select aria-label="Filtrar por sistema" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Todos os sistemas</option>{Object.entries(SYSTEMS).map(([id,value])=><option key={id} value={id}>{value.name}</option>)}</select><ChevronDown size={15}/></div>
          <div className="organ-list" aria-label="Lista de órgãos">{filtered.length?filtered.map(item=><button className={`organ-option ${selected===item.id?'selected':''}`} key={item.id} aria-label={`Explorar ${item.name}`} aria-pressed={selected===item.id} onClick={()=>chooseOrgan(item.id)}><span className="organ-dot" style={{background:SYSTEMS[item.system].color}}/><span>{item.name}</span>{extracted===item.id?<Box size={14}/>:<ChevronRight size={15}/>}</button>):<p className="empty-state">Nenhum órgão encontrado.<button onClick={()=>{setQuery('');setFilter('all');}}>Limpar filtros</button></p>}</div>
          <AnimatePresence mode="wait"><motion.div className="selected-card" key={selected} initial={reduced?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
            <div className="selection-eyebrow"><span className="status-dot"/>{extracted===selected?'FORA DO CORPO':'EM DESTAQUE'}<Heart size={15}/></div><h2>{organ.name}</h2><p className="latin-name">{organ.latin}</p><p>{organ.summary}</p>
            <button className="system-link" onClick={()=>setModal('system')}><Info size={14}/>{system.name}<ArrowUpRight size={14}/></button>
            <AttractButton className="inspect-button" paused={true} onClick={inspect}>{extracted===selected?'Inspecionar órgão':'Retirar e explorar'}<Maximize2 size={16}/></AttractButton>
            {extracted===selected&&<button className="restore-button" onClick={restore}><Undo2 size={14}/>Recolocar no corpo</button>}
          </motion.div></AnimatePresence>
        </aside>
      </div>
      <div className="workspace-footer"><span><span className="keycap">01</span> Escolha uma camada <ChevronRight size={13}/><span className="keycap">02</span> Selecione um órgão <ChevronRight size={13}/><span className="keycap">03</span> Explore em 360°</span><button onClick={()=>setModal('sources')}><BookOpen size={14}/> Sobre este atlas</button></div>
    </main>
    <footer className="app-footer"><span>UI–UX STEFANO <span>/</span> EXPERIMENTO 02</span><span>Feito para despertar curiosidade.</span><span>ATLAS HUMANO © 2026</span></footer>
    <div className="sr-only" role="status" aria-live="polite">{extracted?`${ORGANS.find(o=>o.id===extracted)?.name} retirado do corpo para inspeção.`:'Todos os órgãos estão no corpo.'}</div>

    {modal==='system'&&<Modal title={system.name} onClose={()=>setModal(null)}><div className="system-summary"><span className="system-pill" style={{color:system.color}}><span style={{background:system.color}}/>{system.shortName}</span><div className="three-lines">{system.lines.map((line,index)=><p key={line}><span>0{index+1}</span>{line}</p>)}</div><a className="source-link" href={system.source.url} target="_blank" rel="noreferrer">Fonte: {system.source.label}<ArrowUpRight size={14}/></a></div><div className="organ-preview-copy"><span className="eyebrow">ESTRUTURA SELECIONADA</span><h3>{organ.name}</h3><p>{organ.summary}</p><dl><dt>Localização</dt><dd>{organ.location}</dd></dl></div><button className="primary-button full" onClick={inspect}>Retirar {organ.name} e explorar em 3D <Maximize2 size={17}/></button></Modal>}
    {modal==='inspect'&&<Modal title={organ.name} onClose={()=>{setModal(null);setRotation(false);}} wide><div className="inspector-layout"><div className="inspector-stage"><span className="floating-tag"><Box size={14}/> ÓRGÃO ISOLADO</span><Viewport key={organ.id} ref={organView} organ={organ.id} layers={['organs']} opacity={100} outline={false} selected={selected} extracted={null} onPick={()=>{}} autoRotate={rotation} reducedMotion={reduced}/><ViewTools viewer={organView} prefix="órgão"/><div className="inspector-hint">Arraste livremente para observar todos os ângulos.</div></div><div className="inspector-copy"><span className="eyebrow">{system.name.toUpperCase()}</span><h3>{organ.name}</h3><p className="latin-name">{organ.latin}</p><p>{organ.summary}</p><dl><dt>ONDE FICA</dt><dd>{organ.location}</dd><dt>O QUE FAZ</dt><dd>{organ.function}</dd></dl><button className="secondary-button full" disabled={reduced} onClick={()=>setRotation(v=>!v)} aria-pressed={rotation}>{rotation?<Pause size={16}/>:<Play size={16}/>} {reduced?'Movimento reduzido':rotation?'Pausar rotação':'Rotação automática'}</button><button className="primary-button full" onClick={restore}><Undo2 size={16}/>Recolocar no corpo</button><p className="inspector-note"><Info size={14}/>A posição original é preservada ao recolocar.</p></div></div></Modal>}
    {modal==='guide'&&<Modal title="A curiosidade é o ponto de partida." onClose={()=>setModal(null)}><div className="guide-list">{[['Escolha o que quer ver','Use as oito camadas à esquerda. Ative “Combinar camadas” para sobrepor sistemas e ajuste a opacidade.'],['Encontre uma estrutura','Clique em um órgão no corpo ou use a busca. Um resumo explica o sistema em três frases.'],['Tire do corpo. Veja de perto.','Retire o órgão, arraste para girá-lo em qualquer direção e use + e − para ampliar. Recoloque quando terminar.']].map(([title,description],i)=><div key={title}><span>0{i+1}</span><h3>{title}</h3><p>{description}</p></div>)}</div><p className="small-note">Todos os gestos também têm botões. Use Tab para navegar e Esc para fechar as janelas.</p><button className="primary-button full" onClick={()=>setModal(null)}>Começar a explorar<ArrowRight size={17}/></button></Modal>}
    {modal==='sources'&&<Modal title="Anatomia para descobrir." onClose={()=>setModal(null)}><p className="about-copy">Este experimento apresenta um corpo adulto completo em oito camadas macroscópicas e 17 estruturas interativas. As formas são ilustrações 3D esquemáticas, criadas para aprendizagem exploratória, com anatomia reprodutora feminina.</p><p className="about-copy">Os resumos foram conferidos em fontes públicas de saúde e educação. O modelo simplifica formas, proporções e ramificações; não representa um exame ou atlas clínico de precisão.</p><div className="sources-list">{Object.values(SYSTEMS).map(value=><a key={value.name} href={value.source.url} target="_blank" rel="noreferrer"><span>{value.name}<small>{value.source.label}</small></span><ArrowUpRight size={17}/></a>)}</div><p className="small-note">Modelagem original · Three.js · React · UI–UX Stefano</p></Modal>}
  </div>;
}
