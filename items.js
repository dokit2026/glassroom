// Procedural, dimensioned object models. Geometry carries the silhouette and details.
export function buildItems(T,room,glass,white,gold,normals,asset){
 const rewards=[],animated=[];
 const m=(c,r=.4,metal=0)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:metal});
 const chrome=m('#dedee0',.12,1),rubber=m('#202323',.8),wood=new T.MeshStandardMaterial({map:asset('oak-color.png',true),roughness:.38}),linen=new T.MeshStandardMaterial({color:'#e4d8c4',map:asset('linen-color.png',true,[4,4]),roughness:.95});
 function obj(g,mat,p,x=0,y=0,z=0){const o=new T.Mesh(g,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o}
 function sphere(p,mat,x,y,z,sx,sy=sx,sz=sx){let o=obj(new T.SphereGeometry(1,32,24),mat,p,x,y,z);o.scale.set(sx,sy,sz);return o}
 function lathe(p,mat,pts,x=0,y=0,z=0){return obj(new T.LatheGeometry(pts.map(a=>new T.Vector2(...a)),64),mat,p,x,y,z)}
 function tube(p,mat,points,r=.012){let curve=new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a)));return obj(new T.TubeGeometry(curve,32,r,8,false),mat,p)}
 function torus(p,mat,r,t,x,y,z,flat=false){let o=obj(new T.TorusGeometry(r,t,10,64),mat,p,x,y,z);if(flat)o.rotation.x=Math.PI/2;return o}
 function rounded(p,mat,w,h,d,x,y,z,r=.03){r=Math.min(r,w/2.01,h/2.01,d/2.01);let shape=new T.Shape();let a=w/2-r,b=h/2-r;shape.moveTo(-a,-h/2);shape.lineTo(a,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-b);shape.lineTo(w/2,b);shape.quadraticCurveTo(w/2,h/2,a,h/2);shape.lineTo(-a,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,b);shape.lineTo(-w/2,-b);shape.quadraticCurveTo(-w/2,-h/2,-a,-h/2);let geo=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,steps:1,curveSegments:8});geo.translate(0,0,-d/2+r);return obj(geo,mat,p,x,y,z)}
 function group(name,x=0,y=0,z=0){let g=new T.Group();g.position.set(x,y,z);g.visible=false;g.userData.name=name;room.add(g);rewards.push(g);return g}
 // Continuous double-walled bath: exterior, rounded rim, concave bowl, bottom.
 const tub=new T.Group();tub.position.set(0,0,-2.05);room.add(tub);
 const profile=[[.02,.12],[.65,.12],[.83,.16],[.96,.3],[1,.55],[1,.72],[.985,.77],[.95,.785],[.915,.755],[.91,.7],[.86,.45],[.73,.25],[.55,.22],[.02,.22],[0,.22]];
 let shell=lathe(tub,white,profile);shell.scale.set(1.73,1,.76);
 let drain=lathe(tub,chrome,[[0,0],[.055,0],[.055,.008],[0,.008]],.7,.225,0);for(let i=0;i<5;i++)rounded(tub,rubber,.006,.002,.06,.68+i*.01,.235,0,.001);
 lathe(tub,chrome,[[0,0],[.04,0],[.04,.012],[0,.012]],0,.56,-.714).rotation.x=Math.PI/2;
 const waterMat=new T.MeshPhysicalMaterial({color:'#ffffff',transmission:.95,thickness:.15,ior:1.333,roughness:.055,clearcoat:1,normalMap:normals[8].clone(),normalScale:new T.Vector2(.018,.018)});
 const water=obj(new T.CircleGeometry(1,96),waterMat,tub,0,.59,0);water.rotation.x=-Math.PI/2;water.scale.set(1.47,.59,1);water.visible=false;water.castShadow=false;
 tube(tub,chrome,[[1.78,.03,0],[1.78,.8,0],[1.78,1.02,0],[1.6,1.08,0],[1.4,1.08,0],[1.38,.95,0]],.032);
 for(let z of [-.18,.18]){lathe(tub,chrome,[[.06,0],[.06,.025],[.025,.04]],1.78,.78,z);tube(tub,chrome,[[1.69,.83,z],[1.86,.83,z]],.016)}
 // Broad, pointed leaves with curved midribs and a hollow ceramic pot.
 const plant=group('観葉植物',-2.95,0,-2.4);const pot=m('#c9b69b',.65);
 lathe(plant,pot,[[0,0],[.2,0],[.22,.04],[.28,.47],[.28,.5],[.25,.51],[.24,.46],[.19,.05],[0,.05]]);
 lathe(plant,m('#393128',1),[[0,0],[.245,0],[0,.01]],0,.455,0);
 for(let i=0;i<13;i++){let angle=i*2.4,height=.6+(i%5)*.17,reach=.35+(i%3)*.1;let end=[Math.cos(angle)*reach,height,Math.sin(angle)*reach];tube(plant,m('#576543',.7),[[0,.45,0],[end[0]*.3,height*.9,end[2]*.3],end],.009);
  const verts=[],uv=[],idx=[];for(let a=0;a<=16;a++){let t=a/16;for(let side of [-1,1]){let width=Math.sin(Math.PI*t)**.75*.14;verts.push(end[0]+Math.cos(angle)*t*.42+Math.sin(angle)*width*side,end[1]+Math.sin(t*Math.PI)*.12-t*t*.12,end[2]+Math.sin(angle)*t*.42-Math.cos(angle)*width*side);uv.push(side<0?0:1,t)}}for(let a=0;a<16;a++){let j=a*2;idx.push(j,j+1,j+2,j+1,j+3,j+2)}let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();obj(geo,new T.MeshPhysicalMaterial({color:i%2?'#47623d':'#617d4b',side:T.DoubleSide,roughness:.45,clearcoat:.3}),plant);
  tube(plant,m('#8b9b69',.6),[end,[end[0]+Math.cos(angle)*.2,end[1]+.1,end[2]+Math.sin(angle)*.2],[end[0]+Math.cos(angle)*.4,end[1]-.1,end[2]+Math.sin(angle)*.4]],.002);
 }
 // Rubber duck: pear-shaped body, lifted tail, neck, cheeks, flattened bill, wings.
 const duck=group('アヒル',-.6,.62,-1.95),yellow=new T.MeshPhysicalMaterial({color:'#efc542',roughness:.38,clearcoat:.3});
 sphere(duck,yellow,0,0,0,.19,.15,.25);sphere(duck,yellow,0,.15,.105,.11,.17,.105);sphere(duck,yellow,0,.27,.15,.135,.135,.13);
 let tail=sphere(duck,yellow,0,.08,-.21,.08,.1,.14);tail.rotation.x=-.65;
 for(let side of [-1,1]){let wing=sphere(duck,yellow,side*.17,.015,-.03,.035,.09,.135);wing.rotation.x=.2;sphere(duck,rubber,side*.105,.3,.227,.015,.018,.012);sphere(duck,white,side*.108,.307,.235,.004)}
 sphere(duck,m('#e69534',.4),0,.245,.29,.09,.027,.095);sphere(duck,m('#b66c27',.5),0,.232,.29,.081,.006,.09);
 // Hollow blown-glass wind bell, clapper, suspension string and paper strip.
 const chime=group('風鈴',2.8,2.65,-2.9);lathe(chime,glass,[[.22,0],[.225,.02],[.21,.14],[.15,.26],[.05,.31],[0,.315],[.025,.3],[.13,.245],[.19,.13],[.207,.015]]);tube(chime,linen,[[0,.3,0],[0,.7,0]],.003);sphere(chime,wood,0,.08,0,.035);tube(chime,linen,[[0,.08,0],[0,-.5,0]],.002);let paper=rounded(chime,m('#f5eee1',.95),.13,.28,.003,0,-.53,0,.001);paper.rotation.z=.08;
 const mirror=group('鏡',-3.88,2,.2);let frame=torus(mirror,gold,.5,.035,0,0,0);frame.rotation.y=Math.PI/2;frame.scale.y=1.35;let disc=obj(new T.CircleGeometry(.48,64),new T.MeshStandardMaterial({color:'#ffffff',metalness:1,roughness:.02,side:T.DoubleSide}),mirror,.015,0,0);disc.rotation.y=Math.PI/2;disc.scale.y=1.35;
 // Table lamp: open linen shade, rolled edges, bulb, socket, turned metal base.
 const lamp=group('ランプ',2.65,0,1.8);lathe(lamp,gold,[[0,0],[.27,0],[.29,.025],[.26,.06],[.1,.08],[.035,.15],[.025,1.22],[.08,1.25]]);
 let shade=obj(new T.CylinderGeometry(.22,.38,.45,64,1,true),new T.MeshStandardMaterial({color:'#efe3cf',map:asset('linen-color.png',true,[5,1]),roughness:.9,side:T.DoubleSide}),lamp,0,1.4,0);
 torus(lamp,gold,.22,.008,0,1.625,0,true);torus(lamp,gold,.38,.008,0,1.175,0,true);sphere(lamp,new T.MeshStandardMaterial({color:'#fff2d9',emissive:'#ffca7f',emissiveIntensity:.5}),0,1.35,0,.07,.11,.07);let light=new T.PointLight(0xffd9aa,2.3,4);light.position.y=1.35;lamp.add(light);
 group('水').userData.effect='water';group('入浴剤').userData.effect='bath';
 const foam=group('泡ぶろ');const bubble=new T.MeshPhysicalMaterial({color:'#ffffff',roughness:.2,metalness:0,clearcoat:1,iridescence:.65,transparent:true,opacity:.6});
 for(let i=0;i<175;i++){let r=.015+(i%9)*.009,x=Math.sin(i*13.3)*1.3,z=Math.cos(i*8.7)*.5;if((x/1.4)**2+(z/.57)**2<1)sphere(foam,bubble,x,.61+Math.sin(i)*.025,-2.05+z,r)}
 // Desk fan: fixed wire cage, rear motor housing, rotating shaped blades.
 const fan=group('扇風機',2.9,0,.5);lathe(fan,white,[[0,0],[.25,0],[.29,.025],[.28,.06],[.15,.1],[.035,.12],[.025,.83],[.055,.9]]);let head=new T.Group();head.position.set(0,1.05,0);fan.add(head);
 let motor=lathe(head,m('#ddd9cc',.3),[[0,0],[.1,0],[.12,.03],[.12,.2],[.09,.25],[0,.25]],0,0,-.18);motor.rotation.x=Math.PI/2;
 const fanHead=new T.Group();head.add(fanHead);animated.push(fanHead);
 for(let i=0;i<3;i++){let shape=new T.Shape();shape.moveTo(.02,.03);shape.bezierCurveTo(.1,.13,.14,.3,.04,.32);shape.bezierCurveTo(-.09,.32,-.19,.22,-.1,.13);shape.quadraticCurveTo(-.03,.08,.02,.03);let blade=obj(new T.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSize:.007,bevelThickness:.004,bevelSegments:2,steps:1,curveSegments:14}),m('#979f91',.3,.25),fanHead);blade.rotation.z=i*Math.PI*2/3}
 sphere(head,chrome,0,0,.07,.065,.065,.025);
 for(let j=0;j<5;j++)torus(head,chrome,.08+j*.06,.0035,0,0,.09);
 for(let i=0;i<32;i++){let a=i*Math.PI/16;let x=Math.cos(a)*.34,y=Math.sin(a)*.34;tube(head,chrome,[[0,0,.1],[x*.55,y*.55,.12],[x,y,.015]],.0025);tube(head,chrome,[[0,0,-.12],[x*.55,y*.55,-.1],[x,y,.015]],.0025)}torus(head,chrome,.34,.01,0,0,.015);
 const bathmat=group('バスマット',0,.02,-.55);rounded(bathmat,linen,1.85,.025,.72,0,0,0,.01);for(let i=0;i<42;i++){let x=(i-20.5)*.043;tube(bathmat,linen,[[x,.01,-.35],[x,.016,-.43]],.007);tube(bathmat,linen,[[x,.01,.35],[x,.016,.43]],.007)}
 // Turned oak table with bevelled top, three splayed legs and lower shelf.
 const table=group('テーブル',-2.6,0,.5);lathe(table,wood,[[0,.85],[.47,.85],[.5,.87],[.5,.92],[.48,.94],[0,.94]]);lathe(table,wood,[[0,.25],[.33,.25],[.34,.28],[0,.28]]);
 for(let i=0;i<3;i++){let a=i*2.094;tube(table,wood,[[Math.cos(a)*.42,.03,Math.sin(a)*.42],[Math.cos(a)*.28,.87,Math.sin(a)*.28]],.027)}
 const drink=group('飲み物',-2.6,.95,.5);lathe(drink,glass,[[0,0],[.078,0],[.086,.02],[.095,.25],[.087,.255],[.079,.035],[0,.03]]);lathe(drink,new T.MeshPhysicalMaterial({color:'#c18d32',roughness:.12,transmission:.65,thickness:.12,ior:1.34}),[[0,.03],[.077,.03],[.086,.18],[0,.18]]);
 for(let i=0;i<3;i++)rounded(drink,glass,.045,.04,.04,Math.sin(i*2)*.04,.19,Math.cos(i*2)*.04,.007);
 tube(drink,m('#e6dfbd',.5),[[.025,.03,0],[.025,.29,0],[.08,.35,0]],.006);let lemon=lathe(drink,m('#e4ce62',.6),[[0,0],[.055,0],[.055,.012],[0,.012]],-.065,.24,0);lemon.rotation.z=.4;
 for(let i=0;i<12;i++){
  let x=-3+(i%6)*1.2,z=i<6?-3.05:3.03;let g=group(['香りのボトル','タオル','キャンドル','ポンプボトル'][i%4],x,i<6?.43:.02,z);
  if(i%4===0){lathe(g,glass,[[0,0],[.095,0],[.105,.02],[.105,.22],[.08,.26],[.035,.28],[.035,.32],[.025,.32],[.025,.29],[.068,.25],[.09,.21],[.09,.03],[0,.03]]);lathe(g,wood,[[0,.31],[.045,.31],[.045,.35],[0,.35]]);for(let j=0;j<5;j++)tube(g,wood,[[0,.34,0],[Math.sin(j)*.045,.63+(j%2)*.1,Math.cos(j)*.045]],.003)}
  if(i%4===1){for(let j=0;j<3;j++){rounded(g,linen,.4,.055,.28,0,.03+j*.055,0,.024);tube(g,m('#c8bba5',.95),[[-.16,.04+j*.055,.145],[0,.035+j*.055,.147],[.16,.04+j*.055,.145]],.003)}}
  if(i%4===2){lathe(g,glass,[[0,0],[.115,0],[.12,.02],[.12,.19],[.109,.19],[.105,.03],[0,.03]]);lathe(g,m('#e7dcc0',.7),[[0,.03],[.105,.03],[.105,.16],[0,.16]]);tube(g,rubber,[[0,.16,0],[0,.18,0]],.003);sphere(g,new T.MeshStandardMaterial({color:'#ffbc57',emissive:'#ff9f2a',emissiveIntensity:2}),0,.2,0,.012,.026,.012)}
  if(i%4===3){let bottlemat=new T.MeshPhysicalMaterial({color:['#c9bdac','#e9e4d7','#bca88a'][Math.floor(i/4)],roughness:.27,clearcoat:.7});lathe(g,bottlemat,[[0,0],[.08,0],[.09,.02],[.09,.24],[.07,.28],[.025,.3],[.025,.34],[0,.34]]);lathe(g,gold,[[0,.31],[.035,.31],[.035,.34],[.012,.35],[.012,.4],[0,.4]]);tube(g,gold,[[0,.395,0],[.09,.395,0],[.09,.37,0]],.012);rounded(g,m('#f5eee0',.8),.11,.11,.002,0,.16,.09,.003)}
 }
 return {rewards,animated,water,chime,mirror};
}
