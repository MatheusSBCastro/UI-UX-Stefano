import { forwardRef,useEffect,useImperativeHandle,useRef,useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createAnatomy,type LayerId } from './anatomy';

export type ViewportHandle={view:(side:'front'|'back'|'side')=>void;rotate:(x:number,y:number)=>void;zoom:(factor:number)=>void;reset:()=>void};
type Props={layers:LayerId[];opacity:number;outline:boolean;selected:string;extracted:string|null;onPick:(id:string)=>void;organ?:string;autoRotate:boolean;reducedMotion:boolean;onReady?:()=>void};
type World={renderer:T.WebGLRenderer;scene:T.Scene;camera:T.PerspectiveCamera;controls:OrbitControls;anatomy:ReturnType<typeof createAnatomy>;object:T.Group;radius:number;target:T.Vector3;render:()=>void};

export const Viewport=forwardRef<ViewportHandle,Props>(function Viewport(props,ref){
  const host=useRef<HTMLDivElement>(null),world=useRef<World|null>(null),latest=useRef(props);
  const [error,setError]=useState('');latest.current=props;
  const setView=(side:'front'|'back'|'side')=>{
    const w=world.current;if(!w)return;
    const direction=side==='front'?new T.Vector3(0,.04,1):side==='back'?new T.Vector3(0,.04,-1):new T.Vector3(1,.04,0);
    w.camera.position.copy(w.target).addScaledVector(direction.normalize(),w.radius);w.controls.target.copy(w.target);w.controls.update();w.render();
  };
  useImperativeHandle(ref,()=>({
    view:setView,reset:()=>setView('front'),
    zoom:factor=>{const w=world.current;if(!w)return;const v=w.camera.position.clone().sub(w.controls.target);v.setLength(T.MathUtils.clamp(v.length()*factor,w.controls.minDistance,w.controls.maxDistance));w.camera.position.copy(w.controls.target).add(v);w.controls.update();w.render();},
    rotate:(x,y)=>{const w=world.current;if(!w)return;const spherical=new T.Spherical().setFromVector3(w.camera.position.clone().sub(w.controls.target));spherical.theta+=x;spherical.phi=T.MathUtils.clamp(spherical.phi+y,.1,Math.PI-.1);w.camera.position.copy(w.controls.target).add(new T.Vector3().setFromSpherical(spherical));w.controls.update();w.render();},
  }));

  useEffect(()=>{
    const element=host.current!;let renderer:T.WebGLRenderer;
    try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch{setError('La visualização 3D precisa de WebGL. Ative a aceleração gráfica do navegador e recarregue. Os resumos continuam disponíveis.');return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
    renderer.domElement.setAttribute('aria-hidden','true');element.appendChild(renderer.domElement);
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.01,100),controls=new OrbitControls(camera,renderer.domElement);
    controls.enablePan=false;controls.enableDamping=false;controls.rotateSpeed=.7;controls.zoomSpeed=.7;
    const ambient=new T.HemisphereLight(0xeaf6ef,0x42534b,2.8);scene.add(ambient);
    const key=new T.DirectionalLight(0xffe1c7,3.2);key.position.set(-4,8,6);scene.add(key);
    const fill=new T.DirectionalLight(0xcce9df,2.2);fill.position.set(4,5,-3);scene.add(fill);
    const anatomy=createAnatomy();let object=anatomy.root;
    if(props.organ){
      const original=anatomy.organs.get(props.organ);
      if(original){
        anatomy.root.updateMatrixWorld(true);object=original.clone(true);object.position.set(0,0,0);
        const box=new T.Box3().setFromObject(object),center=box.getCenter(new T.Vector3());object.position.sub(center);
      }
    }
    scene.add(object);
    const bounds=new T.Box3().setFromObject(object),size=bounds.getSize(new T.Vector3()),target=bounds.getCenter(new T.Vector3());
    const radius=Math.max(size.y,size.x,size.z)*1.72;
    controls.target.copy(target);controls.minDistance=props.organ?radius*.38:3;controls.maxDistance=radius*2;
    camera.position.copy(target).add(new T.Vector3(props.organ?.15:0,0,radius));controls.update();
    let frame=0,last=0;
    const render=()=>renderer.render(scene,camera);
    world.current={renderer,scene,camera,controls,anatomy,object,radius,target,render};
    const resize=()=>{const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();render();};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const refresh=()=>{element.dataset.camera=camera.position.toArray().map(v=>v.toFixed(3)).join(',');render();};controls.addEventListener('change',refresh);
    const tick=(now:number)=>{
      const dt=Math.min((now-last)/1000,.05);last=now;
      if(latest.current.autoRotate&&!latest.current.reducedMotion&&!document.hidden){const relative=camera.position.clone().sub(controls.target);relative.applyAxisAngle(new T.Vector3(0,1,0),dt*.25);camera.position.copy(controls.target).add(relative);controls.update();}
      frame=requestAnimationFrame(tick);
    };frame=requestAnimationFrame(tick);
    const raycaster=new T.Raycaster(),pointer=new T.Vector2();let down={x:0,y:0};
    const pointerDown=(event:PointerEvent)=>{down={x:event.clientX,y:event.clientY};};
    const pick=(event:PointerEvent)=>{
      if(props.organ||Math.hypot(event.clientX-down.x,event.clientY-down.y)>6||!latest.current.layers.includes('organs'))return;
      const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
      const candidates=[...anatomy.organs.values()].filter(o=>o.visible);
      const hit=raycaster.intersectObjects(candidates,true).find(h=>h.object.userData.organId);
      if(hit)latest.current.onPick(hit.object.userData.organId);
    };
    renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pick);
    const lost=(event:Event)=>{event.preventDefault();setError('A sessão 3D foi interrompida. Recarregue para restaurar a visualização.');};renderer.domElement.addEventListener('webglcontextlost',lost);
    element.dataset.ready='true';latest.current.onReady?.();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.removeEventListener('change',refresh);controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',pick);renderer.domElement.removeEventListener('webglcontextlost',lost);anatomy.dispose();renderer.dispose();renderer.domElement.remove();world.current=null;};
  },[props.organ]);

  useEffect(()=>{
    const w=world.current;if(!w||props.organ)return;
    for(const [name,group] of Object.entries(w.anatomy.layers)){
      const active=props.layers.includes(name as LayerId),ghost=name==='skin'&&props.outline&&!active;
      group.visible=active||ghost;
      group.traverse(object=>{if(!(object instanceof T.Mesh))return;const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials){material.userData.baseOpacity??=material.opacity;material.opacity=ghost?.065:props.opacity/100;material.transparent=material.opacity<1;material.depthWrite=!ghost&&material.opacity>.85;material.needsUpdate=true;}});
    }
    for(const [id,group] of w.anatomy.organs){
      group.visible=id!==props.extracted;
      group.traverse(object=>{if(!(object instanceof T.Mesh))return;const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials){if(material instanceof T.MeshStandardMaterial){material.emissive.set(id===props.selected?0x48240b:0x000000);material.emissiveIntensity=id===props.selected?.38:0;}}});
    }
    host.current!.dataset.layers=props.layers.join(',');host.current!.dataset.extracted=props.extracted||'';host.current!.dataset.selected=props.selected;
    w.render();
  },[props.layers,props.opacity,props.outline,props.selected,props.extracted,props.organ]);

  return <div className={`viewport ${props.organ?'organ-viewport':''}`} ref={host} data-testid={props.organ?'organ-viewport':'body-viewport'} role="img" aria-label={props.organ?'Órgão tridimensional para inspeção':'Modelo tridimensional completo do corpo humano'}>{error&&<div className="webgl-error" role="alert">{error}</div>}</div>;
});
