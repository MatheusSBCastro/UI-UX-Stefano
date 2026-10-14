import * as THREE from 'three';

export type LayerId = 'skin' | 'fat' | 'fascia' | 'muscles' | 'organs' | 'vessels' | 'nerves' | 'bones';
type V3 = [number, number, number];

/** Original procedural teaching model. Positions are schematic, in anatomical orientation. */
export function createAnatomy() {
  const root = new THREE.Group();
  const layers = Object.fromEntries((['skin', 'fat', 'fascia', 'muscles', 'organs', 'vessels', 'nerves', 'bones'] as LayerId[]).map(id => {
    const group = new THREE.Group(); group.name = id; root.add(group); return [id, group];
  })) as Record<LayerId, THREE.Group>;
  const organs = new Map<string, THREE.Group>();
  const mat = (color: THREE.ColorRepresentation, roughness = .49) => new THREE.MeshStandardMaterial({ color, roughness, metalness: .02 });
  const skin = new THREE.MeshPhysicalMaterial({ color: '#cf9979', roughness: .61, transparent: true, opacity: .87, side: THREE.DoubleSide, depthWrite: false });
  const fat = mat('#eac067', .68), muscle = mat('#b95850'), fiber = mat('#e99880'), tendon = mat('#f0d4b3');
  const bone = mat('#e5dac0'), recess = mat('#71695d'), artery = mat('#c8463f'), vein = mat('#426a91'), nerve = mat('#e5b844');
  const sphereGeometry = new THREE.SphereGeometry(1, 24, 18);
  function ell(parent: THREE.Group, material: THREE.Material, pos: V3, scale: V3, rotation: V3 = [0, 0, 0]) {
    const mesh = new THREE.Mesh(sphereGeometry, material); mesh.position.set(...pos); mesh.scale.set(...scale); mesh.rotation.set(...rotation); parent.add(mesh); return mesh;
  }
  function tube(parent: THREE.Group, material: THREE.Material, points: V3[], radius: number, segments = 24) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), material); parent.add(mesh); return mesh;
  }
  function limb(parent: THREE.Group, material: THREE.Material, a: V3, b: V3, width: number, depth = width) {
    const av = new THREE.Vector3(...a), bv = new THREE.Vector3(...b), center = av.clone().add(bv).multiplyScalar(.5);
    const mesh = ell(parent, material, center.toArray() as V3, [width, av.distanceTo(bv) * .59, depth]);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bv.sub(av).normalize()); return mesh;
  }
  function body(parent: THREE.Group, material: THREE.Material, inflate = 0) {
    const profile = [[.47, 3.61], [.73, 3.94], [.71, 4.22], [.56, 4.59], [.67, 5.04], [.89, 5.52], [.8, 5.82], [.4, 6.02], [.25, 6.16]];
    const torso = new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r + inflate, y)), 40), material);
    torso.scale.z = .59; parent.add(torso);
    ell(parent, material, [0, 6.75, 0], [.47 + inflate, .66, .43 + inflate]);
    limb(parent, material, [0, 5.91, 0], [0, 6.39, 0], .25 + inflate, .23 + inflate);
    for (const s of [-1, 1]) {
      ell(parent, material, [s * .89, 5.61, 0], [.32 + inflate, .33, .31]);
      limb(parent, material, [s*.94,5.54,0], [s*1.26,4.77,0], .235 + inflate, .24);
      ell(parent, material, [s*1.26,4.77,0], [.19 + inflate,.21,.2]);
      limb(parent, material, [s*1.27,4.73,0], [s*1.48,4.03,.05], .174 + inflate, .17);
      ell(parent, material, [s*1.52,3.84,.04], [.16 + inflate,.25,.11], [0,0,-s*.13]);
      for (let f=0; f<4; f++) {
        const x=s*(1.415+f*.073), y=3.66;
        limb(parent, material, [x,y,.055], [x+s*.035,y-.27+(f===0||f===3?.045:0),.06], .038 + inflate*.15,.039);
      }
      limb(parent,material,[s*1.395,3.89,.055],[s*1.30,3.69,.10],.052,.052);
      limb(parent, material, [s*.43,3.92,0], [s*.44,2.15,.035], .335 + inflate,.335);
      ell(parent,material,[s*.44,2.09,.06],[.235+inflate,.23,.24]);
      limb(parent, material, [s*.44,2.04,.015], [s*.43,.48,-.025], .225+inflate,.24);
      limb(parent,material,[s*.43,.57,-.025],[s*.43,.24,.06],.145+inflate,.155);
      ell(parent,material,[s*.43,.17,.25],[.205+inflate,.16,.40]);
      for(let t=0;t<5;t++) ell(parent,material,[s*(.27+t*.078),.13,.57-t*.024],[.052-t*.005,.075,.11-t*.009]);
    }
  }
  body(layers.skin,skin);
  // Quiet facial landmarks keep the exterior recognizable without covering the silhouette.
  const face = mat('#ba7f65'), eye = mat('#4b3932'), lip = mat('#a95f58');
  for (const s of [-1,1]) {
    ell(layers.skin,skin,[s*.46,6.77,0],[.075,.155,.095]);
    ell(layers.skin,face,[s*.18,6.86,.388],[.116,.055,.025]);
    ell(layers.skin,eye,[s*.18,6.858,.41],[.055,.015,.008]);
    tube(layers.skin,face,[[s*.085,6.985,.394],[s*.17,7.006,.397],[s*.275,6.98,.357]],.012,10);
    ell(layers.skin,skin,[s*.205,6.65,.35],[.16,.14,.065]);
  }
  ell(layers.skin,skin,[0,6.75,.435],[.08,.135,.10]);
  ell(layers.skin,lip,[0,6.55,.393],[.13,.027,.028]);
  body(layers.fat,fat,-.025);
  const fascia = new THREE.MeshPhysicalMaterial({ color: '#cdd7cd', roughness: .62, transparent: true, opacity: .40, side: THREE.DoubleSide, depthWrite: false });
  body(layers.fascia,fascia,-.034);
  const fasciaThread = new THREE.MeshStandardMaterial({ color: '#e5e5c9', transparent: true, opacity: .66, roughness: .75 });
  for(const s of [-1,1]) {
    for(let i=0;i<9;i++) {
      const y=4.23+i*.15;
      tube(layers.fascia,fasciaThread,[[s*.10,y,.34],[s*.31,y+.08,.34],[s*.55,y+.04,.25]],.008,15);
      tube(layers.fascia,fasciaThread,[[s*.55,y,.25],[s*.31,y+.08,.34],[s*.10,y+.13,.34]],.006,15);
    }
    for(let i=0;i<7;i++)tube(layers.fascia,fasciaThread,[[s*.21,2.5+i*.16,.19],[s*.43,2.56+i*.16,.30],[s*.65,2.52+i*.16,.18]],.007,15);
  }
  // Surface lobules, particularly visible at the abdomen and thighs.
  for(let i=0;i<34;i++) { const y=4.03+(i%7)*.225, x=(Math.floor(i/7)-2)*.215; ell(layers.fat,fat,[x,y,.33],[.125,.145,.045]); }

  // Individually oriented muscle bellies, with fine longitudinal fascicle lines.
  function muscleBundle(a:V3,b:V3,w:number,d=w) {
    limb(layers.muscles,muscle,a,b,w,d);
    for(const k of [-.48,0,.48]) tube(layers.muscles,fiber,[[a[0]+w*k,a[1],a[2]+d*.65],[(a[0]+b[0])*.5+w*k,(a[1]+b[1])*.5,(a[2]+b[2])*.5+d*.88],[b[0]+w*k,b[1],b[2]+d*.6]],.008,10);
  }
  ell(layers.muscles,muscle,[0,6.78,0],[.448,.635,.411]);
  for(const s of [-1,1]) {
    muscleBundle([s*.14,6.42,.15],[s*.28,5.94,.18],.07,.06);
    muscleBundle([s*.1,5.68,.21],[s*.73,5.56,.15],.245,.165);
    muscleBundle([s*.16,5.76,-.18],[s*.76,5.41,-.18],.26,.15);
    muscleBundle([s*.80,5.78,0],[s*1.0,5.34,0],.26,.26);
    muscleBundle([s*1.01,5.43,.09],[s*1.20,4.84,.08],.17,.175);
    muscleBundle([s*1.05,5.38,-.10],[s*1.23,4.86,-.10],.17,.14);
    muscleBundle([s*1.28,4.73,.025],[s*1.45,4.15,.04],.15,.135);
    limb(layers.muscles,tendon,[s*1.44,4.20,.05],[s*1.49,3.99,.07],.073,.065);
    ell(layers.muscles,muscle,[s*1.51,3.82,.03],[.14,.24,.095]);
    for(let f=0;f<4;f++) limb(layers.muscles,tendon,[s*(1.42+f*.07),3.67,.035],[s*(1.45+f*.07),3.43+(f%3===0?.035:0),.04],.028);
    limb(layers.muscles,muscle,[s*1.4,3.88,.02],[s*1.30,3.68,.05],.045);
    for(let j=0;j<4;j++) ell(layers.muscles,muscle,[s*.18,5.15-j*.27,.33],[.15,.118,.07]);
    muscleBundle([s*.61,5.16,.1],[s*.50,4.28,.17],.16,.18);
    muscleBundle([s*.54,5.25,-.15],[s*.4,4.03,-.12],.25,.18);
    ell(layers.muscles,muscle,[s*.41,3.88,-.13],[.34,.4,.29]);
    muscleBundle([s*.4,3.82,.09],[s*.44,2.32,.12],.25,.26);
    muscleBundle([s*.60,3.74,.03],[s*.58,2.32,.035],.18,.20);
    muscleBundle([s*.24,3.64,.03],[s*.32,2.35,.12],.17,.16);
    muscleBundle([s*.45,3.69,-.13],[s*.44,2.27,-.12],.25,.19);
    ell(layers.muscles,tendon,[s*.44,2.13,.2],[.17,.18,.06]);
    muscleBundle([s*.45,2.0,-.03],[s*.45,.92,-.1],.20,.22);
    muscleBundle([s*.36,1.94,.11],[s*.37,.60,.04],.12,.1);
    limb(layers.muscles,tendon,[s*.44,.99,-.10],[s*.43,.23,-.1],.055,.06);
    ell(layers.muscles,muscle,[s*.43,.15,.22],[.18,.12,.38]);
  }

  // Skeleton: vertebrae, individual curved ribs, pelvis and phalanges.
  ell(layers.bones,bone,[0,6.87,-.05],[.425,.49,.375]);
  ell(layers.bones,bone,[0,6.58,.03],[.325,.24,.29]);
  for(const s of [-1,1]) {
    ell(layers.bones,recess,[s*.155,6.78,.294],[.103,.107,.05]);
    tube(layers.bones,bone,[[s*.32,6.71,.17],[s*.32,6.43,.19],[s*.18,6.35,.27],[0,6.35,.3]],.049,20);
    for(let t=0;t<5;t++) ell(layers.bones,bone,[s*(.027+t*.042),6.48,.3],[.023,.04,.025]);
  }
  ell(layers.bones,recess,[0,6.66,.31],[.045,.08,.024]);
  for(let i=0;i<25;i++) {
    const y=3.72+i*.105, z=-.10-.095*Math.sin(i*.19);
    ell(layers.bones,bone,[0,y,z],[.115,.044,.10]);
    ell(layers.bones,bone,[0,y,z-.10],[.06,.032,.09]);
  }
  for(const s of [-1,1]) {
    tube(layers.bones,bone,[[0,5.83,.15],[s*.30,5.89,.16],[s*.63,5.82,.09],[s*.83,5.77,0]],.048);
    for(let r=0;r<10;r++) {
      const y=5.72-r*.095, spread=.41+Math.sin((r+1)/11*Math.PI)*.28;
      tube(layers.bones,bone,[[s*.06,y,-.20],[s*spread*.70,y+.005,-.28],[s*spread,y-.09,-.03],[s*spread*.83,y-.19,.245],[s*.06,y-.24,.33]],.029,30);
    }
    ell(layers.bones,bone,[s*.39,5.58,-.26],[.26,.34,.04],[0,0,s*.2]);
    const ilium=ell(layers.bones,bone,[s*.40,4.03,-.055],[.28,.40,.12],[0,s*.24,s*.30]); ilium.name='Ilium';
    tube(layers.bones,bone,[[s*.48,4.02,-.09],[s*.52,3.72,.02],[s*.32,3.58,.18],[s*.07,3.67,.20],[s*.14,3.91,.11]],.09);
    const joint=(p:V3,r:number)=>ell(layers.bones,bone,p,[r,r,r]);
    joint([s*.89,5.65,0],.13);
    limb(layers.bones,bone,[s*.91,5.59,0],[s*1.25,4.78,0],.071,.074);
    joint([s*1.25,4.78,0],.105);
    for(const offset of [-.045,.045]) limb(layers.bones,bone,[s*(1.27+offset),4.7,0],[s*(1.49+offset),4.02,.045],.038);
    ell(layers.bones,bone,[s*1.50,3.89,.03],[.11,.12,.045]);
    for(let f=0;f<4;f++) {
      const x=s*(1.42+f*.067); limb(layers.bones,bone,[x,3.88,.03],[x+s*.02,3.68,.04],.024);
      for(let p=0;p<3;p++) limb(layers.bones,bone,[x+s*.02,3.67-p*.082,.04],[x+s*.026,3.601-p*.082+(f%3===0?.015:0),.04],.019);
    }
    limb(layers.bones,bone,[s*1.4,3.86,.02],[s*1.30,3.68,.07],.026);
    joint([s*.39,3.77,0],.14);
    limb(layers.bones,bone,[s*.39,3.72,0],[s*.44,2.19,.035],.086);
    joint([s*.44,2.14,.025],.13); ell(layers.bones,bone,[s*.44,2.14,.14],[.078,.105,.034]);
    limb(layers.bones,bone,[s*.43,2.05,.02],[s*.43,.42,0],.07);
    limb(layers.bones,bone,[s*.58,2.02,-.02],[s*.55,.43,-.015],.034);
    joint([s*.43,.35,0],.10);
    ell(layers.bones,bone,[s*.43,.14,.04],[.13,.12,.17]);
    for(let t=0;t<5;t++) {
      const x=s*(.29+t*.063); limb(layers.bones,bone,[x,.17,.15],[x,.13,.43],.024);
      limb(layers.bones,bone,[x,.13,.43],[x,.105,.60-t*.021],.026-t*.002);
    }
  }
  limb(layers.bones,bone,[0,5.73,.32],[0,4.98,.33],.064,.035);
  ell(layers.bones,bone,[0,3.85,-.12],[.18,.29,.095]);

  function organ(id:string,position:V3) { const g=new THREE.Group();g.name=id;g.userData.organId=id;g.position.set(...position);layers.organs.add(g);organs.set(id,g);return g; }
  function shaped(parent:THREE.Group,material:THREE.Material,outline:[number,number][],depth:number) {
    const shape=new THREE.Shape();shape.moveTo(...outline[0]);
    for(let i=1;i<outline.length;i++) shape.lineTo(...outline[i]);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:depth*.28,bevelThickness:depth*.28,bevelSegments:4,steps:1,curveSegments:20});
    geo.translate(0,0,-depth*.5);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,material);parent.add(mesh);return mesh;
  }
  const brainMat=mat('#d79989'), brainGroove=mat('#a97065');
  const brain=organ('brain',[0,6.90,0]);
  for(const s of [-1,1]) {
    ell(brain,brainMat,[s*.16,0,0],[.22,.31,.30]);
    for(let i=0;i<11;i++) {
      const y=-.215+i*.043, width=.17*Math.sqrt(Math.max(.1,1-(y/.32)**2));
      tube(brain,brainGroove,[[s*.045,y,.205],[s*.11,y+.023,.255],[s*(.12+width*.60),y-.015,.225],[s*(.16+width),y+.006,.12]],.012,16);
      tube(brain,brainGroove,[[s*.04,y,-.22],[s*.12,y+.019,-.268],[s*.26,y-.014,-.19]],.010,12);
    }
  }
  ell(brain,brainMat,[0,-.28,-.12],[.25,.12,.18]);limb(brain,brainMat,[0,-.3,-.11],[0,-.48,-.10],.065);
  const throat=mat('#ca947e');
  const thyroid=organ('thyroid',[0,6.1,.15]);
  for(const s of [-1,1]) ell(thyroid,mat('#ca6f61'),[s*.105,0,0],[.07,.135,.055],[0,0,-s*.22]);
  limb(thyroid,throat,[-.1,-.03,0],[.1,-.03,0],.035);
  const trachea=organ('trachea',[0,5.83,.03]);
  tube(trachea,throat,[[0,.45,0],[0,.15,0],[0,-.21,-.02]],.073);
  for(let i=0;i<11;i++) { const ring=new THREE.Mesh(new THREE.TorusGeometry(.074,.011,6,18),tendon);ring.rotation.x=Math.PI/2;ring.position.y=.40-i*.053;trachea.add(ring); }
  for(const s of [-1,1]) tube(trachea,throat,[[0,-.19,0],[s*.10,-.32,0],[s*.24,-.39,-.01]],.047);
  const lungs=organ('lungs',[0,5.37,.015]),lungMat=mat('#d7948f',.73),lungCrease=mat('#b67373');
  for(const s of [-1,1]) {
    const lobe=ell(lungs,lungMat,[s*.37,.01,0],[.30,.54,.265],[0,0,-s*.16]); lobe.scale.x=s===1?.27:.30;
    ell(lungs,lungMat,[s*.43,-.29,.01],[.25,.24,.245]);
    tube(lungs,lungCrease,[[s*.16,-.08,.22],[s*.34,-.19,.254],[s*.59,-.24,.17]],.012);
    if(s===-1)tube(lungs,lungCrease,[[-.15,.09,.20],[-.38,.07,.26],[-.59,.02,.19]],.011);
    tube(lungs,throat,[[s*.11,.16,-.025],[s*.29,.03,.13],[s*.37,-.15,.19]],.030);
    for(let b=0;b<5;b++)tube(lungs,throat,[[s*.3,.07-b*.067,.15],[s*(.40+b*.013),.18-b*.14,.20]],.012,10);
  }
  const heart=organ('heart',[.13,5.24,.235]),heartMat=mat('#a83d42');
  ell(heart,heartMat,[0,-.015,0],[.215,.285,.18],[0,0,-.33]);
  ell(heart,heartMat,[-.12,.15,-.01],[.135,.13,.12]);ell(heart,heartMat,[.12,.14,-.025],[.10,.12,.12]);
  tube(heart,artery,[[.02,.16,0],[.02,.37,-.015],[-.12,.4,-.01],[-.19,.30,-.05]],.055);
  tube(heart,vein,[[-.13,.1,-.02],[-.17,.27,.01],[-.29,.3,0]],.045);
  tube(heart,artery,[[-.13,.12,.16],[-.06,.03,.177],[.02,-.08,.16],[.08,-.23,.10]],.014);
  for(const s of [-1,1])tube(heart,artery,[[0,.02,.18],[s*.1,-.08,.17],[s*.14,-.16,.11]],.009,12);
  const esophagus=organ('esophagus',[0,5.41,-.095]);
  tube(esophagus,mat('#b97c72'),[[0,.87,0],[0,.3,0],[.015,-.30,0],[.14,-.57,.03]],.047);
  const liver=organ('liver',[-.24,4.73,.11]),liverMat=mat('#8e4541');
  shaped(liver,liverMat,[[-.45,.17],[-.27,.29],[.07,.26],[.53,.08],[.45,-.08],[.13,-.15],[-.10,-.26],[-.42,-.20],[-.49,-.07]],.25);
  tube(liver,mat('#673b39'),[[.05,.22,.17],[.015,.02,.17],[-.03,-.16,.15]],.009,16);
  const gallbladder=organ('gallbladder',[-.13,4.50,.15]),bile=mat('#739753');
  ell(gallbladder,bile,[0,0,0],[.068,.125,.06],[0,0,-.3]);tube(gallbladder,bile,[[0,.08,0],[.03,.20,-.02],[.14,.23,-.04]],.020);
  const stomach=organ('stomach',[.29,4.56,.075]),stomachMat=mat('#d08880');
  ell(stomach,stomachMat,[.055,.015,0],[.19,.27,.15],[0,0,-.43]);
  ell(stomach,stomachMat,[-.08,-.14,.005],[.16,.12,.13]);
  tube(stomach,stomachMat,[[-.11,.33,-.03],[-.08,.18,0],[.01,.07,0]],.07);
  tube(stomach,stomachMat,[[.025,-.18,0],[-.13,-.23,0],[-.25,-.17,0]],.065);
  for(let i=0;i<5;i++) tube(stomach,mat('#ba746f'),[[-.01+i*.033,.13,.139],[-.045+i*.035,-.03,.154],[-.09+i*.03,-.14,.12]],.006,12);
  const pancreas=organ('pancreas',[.05,4.35,-.01]),pancreasMat=mat('#d9ad71');
  for(let i=0;i<8;i++)ell(pancreas,pancreasMat,[-.23+i*.065,i*.016,0],[.076,.063-i*.003,.067],[0,0,.2]);
  const spleen=organ('spleen',[.59,4.61,-.035]);ell(spleen,mat('#995275'),[0,0,0],[.103,.20,.11],[0,0,-.2]);
  const small=organ('small-intestine',[0,4.00,.16]),bowelMat=mat('#cf9687'),smallPath:V3[]=[];
  for(let row=0;row<5;row++) { const y=.26-row*.119,dir=row%2===0?1:-1; for(let i=0;i<8;i++){const x=dir*(-.28+i*.08);smallPath.push([x,y+Math.sin(i*Math.PI/7)*.027,.02+Math.sin(i*.9+row)*.035]);} }
  tube(small,bowelMat,smallPath,.046,180);
  const large=organ('large-intestine',[0,4.03,.11]),colonMat=mat('#bb7e78');
  const colonPath:V3[]=[[-.43,-.32,0],[-.47,-.08,0],[-.45,.19,0],[-.37,.32,0],[-.13,.30,.025],[.13,.32,.015],[.39,.31,0],[.45,.17,0],[.44,-.06,0],[.37,-.30,0],[.16,-.36,0],[.08,-.49,-.07]];
  tube(large,colonMat,colonPath,.081,85);
  const colonCurve=new THREE.CatmullRomCurve3(colonPath.map(p=>new THREE.Vector3(...p)));
  for(let i=0;i<29;i++) {const p=colonCurve.getPoint(i/28);ell(large,colonMat,p.toArray() as V3,[.086,.084,.085]);}
  tube(large,colonMat,[[-.45,-.23,0],[-.52,-.39,.01],[-.49,-.44,.02]],.023);
  const kidneys=organ('kidneys',[0,4.56,-.20]),kidneyMat=mat('#a95149');
  for(const s of [-1,1]) {
    const shape=new THREE.Shape();shape.moveTo(.01,.17);shape.bezierCurveTo(.20,.25,.23,-.20,.03,-.20);shape.bezierCurveTo(-.10,-.19,-.10,-.08,-.04,-.035);shape.bezierCurveTo(.025,0,-.09,.12,.01,.17);
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:4,steps:1,curveSegments:20});geo.translate(0,0,-.065);
    const mesh=new THREE.Mesh(geo,kidneyMat);mesh.position.set(s*.35, s===1?.045:-.045,0);mesh.scale.x=s;kidneys.add(mesh);
    tube(kidneys,mat('#d4b18d'),[[s*.35,-.05,.045],[s*.29,-.45,.02],[s*.12,-.89,.06]],.017,26);
  }
  const bladder=organ('bladder',[0,3.58,.18]);ell(bladder,mat('#cfad87'),[0,0,0],[.16,.16,.12]);tube(bladder,throat,[[0,-.1,0],[0,-.27,.01]],.026);
  const uterus=organ('uterus',[0,3.70,.025]),uterineMat=mat('#bd7887');
  ell(uterus,uterineMat,[0,.04,0],[.105,.12,.065]);limb(uterus,uterineMat,[0,.02,0],[0,-.18,0],.053,.045);
  for(const s of [-1,1])tube(uterus,uterineMat,[[s*.07,.10,0],[s*.17,.16,0],[s*.25,.12,0],[s*.25,.05,0]],.018,20);
  const ovaries=organ('ovaries',[0,3.70,.01]);for(const s of [-1,1])ell(ovaries,mat('#dbc0a0'),[s*.245,.025,0],[.049,.075,.037],[0,0,-s*.4]);
  for(const [id,g]of organs)g.traverse(child=>{child.userData.organId=id;});

  // Full body circulatory and nervous pathways; deliberately schematic branches.
  for(const s of [-1,1]) {
    for(const [material,offset] of [[artery,-.03],[vein,.03]] as const) {
      const x=s*.12+offset;
      tube(layers.vessels,material,[[x,6.97,.1],[x,6.35,.08],[x,5.75,.09],[x,5.10,.03],[x,4.15,.055],[s*.31+offset,3.73,.1],[s*.43+offset,2.2,.13],[s*.43+offset,.42,.08],[s*.43+offset,.17,.48]],.026,85);
      tube(layers.vessels,material,[[x,5.78,.1],[s*.83,5.72,.08],[s*1.1+offset,5.1,.09],[s*1.3+offset,4.61,.1],[s*1.49+offset,3.84,.1]],.021,50);
      for(let f=0;f<4;f++)tube(layers.vessels,material,[[s*1.49+offset,3.89,.10],[s*(1.42+f*.065),3.67,.09],[s*(1.44+f*.067),3.46,.085]],.007,12);
      for(let b=0;b<5;b++) {
        const y=5.45-b*.30;tube(layers.vessels,material,[[x,y,.075],[s*.35,y+.06,.12],[s*.52,y-.05,.19]],.011,15);
      }
      for(let b=0;b<5;b++)tube(layers.vessels,material,[[s*.42+offset,3.4-b*.53,.12],[s*(.24+(b%2)*.37),3.23-b*.53,.10]],.01,10);
      for(let b=0;b<4;b++)tube(layers.vessels,material,[[x,6.44,.10],[s*(.12+b*.045),6.72+b*.14,.29],[s*(.20+b*.035),6.81+b*.12,.20]],.008,18);
    }
    tube(layers.nerves,nerve,[[0,6.51,-.11],[s*.08,5.94,-.11],[s*.79,5.65,.11],[s*1.23,4.82,.13],[s*1.49,3.84,.115]],.025,50);
    tube(layers.nerves,nerve,[[0,4.10,-.16],[s*.27,3.72,-.03],[s*.44,2.2,.09],[s*.43,.45,.10],[s*.43,.17,.51]],.023,50);
    for(let i=0;i<12;i++) {const y=5.80-i*.14;tube(layers.nerves,nerve,[[0,y,-.17],[s*.20,y-.03,-.10],[s*(.45+Math.sin(i*.3)*.13),y-.14,.20]],.012,18);}
    for(let f=0;f<4;f++)tube(layers.nerves,nerve,[[s*1.49,3.89,.11],[s*(1.42+f*.065),3.67,.1],[s*(1.44+f*.067),3.45,.08]],.008,12);
    for(let t=0;t<5;t++)tube(layers.nerves,nerve,[[s*.43,.3,.1],[s*(.28+t*.065),.17,.40],[s*(.28+t*.065),.13,.57-t*.025]],.008,15);
    for(let i=0;i<6;i++)tube(layers.nerves,nerve,[[0,6.80,-.10],[s*.14,6.74+i*.055,.17],[s*(.25+i*.015),6.61+i*.09,.24]],.012,20);
  }
  tube(layers.nerves,nerve,[[0,6.56,-.12],[0,5.7,-.22],[0,4.7,-.15],[0,3.91,-.13]],.044,55);
  root.updateMatrixWorld(true);
  return { root, layers, organs, dispose: () => {
    const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
    root.traverse(object => {if(object instanceof THREE.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));}});
    geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose());
  } };
}
