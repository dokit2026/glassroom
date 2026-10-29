// Actual relief geometry, plus engraved light/dark edges so patterns stay legible on a white background.
export function createPatternGeometry(T,type){
 const width=.606,height=1.52,geo=new T.BoxGeometry(width,height,.12,64,144,1),pos=geo.attributes.position;
 function relief(u,v){let x=u*4,y=v*10;
  switch(type){
   case 0:{let xx=x-Math.floor(x)-.5,yy=y-Math.floor(y)-.5;return Math.sqrt(Math.max(0,1-(xx*xx+yy*yy)/.19))*.012}
   case 1:return Math.sin(Math.hypot(x,y)*Math.PI*2)*.009;
   case 2:return 0;
   case 3:{let xx=Math.abs((x%1)-.5),yy=Math.abs((y%1)-.5);return (1-Math.max(xx,yy)*2)*.017}
   case 4:return (Math.sin(x*9+y*3)+Math.sin(y*12-x*4)+Math.sin(x*19+y*14))*.004;
   case 5:return Math.sin(y*5+Math.sin(x*2)*2)*.01+Math.cos(x*6+Math.cos(y*2))*.005;
   case 6:return (1-Math.abs((x*2%1)-.5)*2)*(1-Math.abs((y*2%1)-.5)*2)*.018;
   case 7:return (Math.cos(x*10)+Math.cos(y*8)*.3)*.009;
   default:return Math.sin(y*5+Math.sin(x*3)*1.5)*.012;
  }
 }
 for(let i=0;i<pos.count;i++){let z=pos.getZ(i);if(z>.059){let u=pos.getX(i)/width+.5,v=pos.getY(i)/height+.5;let fade=Math.min(1,u*30,(1-u)*30,v*60,(1-v)*60);pos.setZ(i,z+relief(u,v)*Math.max(0,fade))}}
 geo.computeVertexNormals();return geo;
}
