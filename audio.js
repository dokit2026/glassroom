// Audio starts only after the OPEN gesture, as required by browser autoplay rules.
export function createAudio(){
 let ctx=null,output=null;
 function unlock(){try{if(!ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;ctx=new Audio();const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-12;compressor.ratio.value=5;output=ctx.createGain();output.gain.value=.23;output.connect(compressor);compressor.connect(ctx.destination)}ctx.resume().catch(()=>{})}catch{ctx=null}}
 function note(f=800,d=.3,type='sine',volume=.22,delay=0,slide=null){if(!ctx)return;const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);o.connect(g);g.connect(output);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.007);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.02);o.onended=()=>{o.disconnect();g.disconnect()}}
 function noise(d=.35,f=1800,q=.7,volume=.2,delay=0){if(!ctx)return;const t=ctx.currentTime+delay,n=Math.ceil(ctx.sampleRate*d),buffer=ctx.createBuffer(1,n,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<n;i++)data[i]=Math.random()*2-1;const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=f;filter.Q.value=q;source.connect(filter);filter.connect(g);g.connect(output);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);source.start(t);source.onended=()=>{source.disconnect();filter.disconnect();g.disconnect()}}
 function play(name){unlock();
  if(/風鈴/.test(name)){[2100,3157,4230,5513].forEach((f,i)=>note(f,2.3-i*.3,'sine',.18/(i+1),i*.012));return}
  if(/アヒル/.test(name)){for(let i=0;i<2;i++){note(510,.15,'sawtooth',.10,i*.19,290);note(1020,.13,'sine',.12,i*.19,600)}return}
  if(/水|入浴剤|泡|バスタブ/.test(name)){noise(.8,900,.5,.26);for(let i=0;i<6;i++)note(500+i*113,.09,'sine',.12,i*.095,220+i*40);return}
  if(/扇風機/.test(name)){noise(.9,400,.4,.18);note(90,.8,'sine',.14);return}
  if(/植物|タオル|バスマット/.test(name)){noise(.32,2400,.3,.19);noise(.22,3600,.5,.1,.13);return}
  if(/テーブル/.test(name)){note(180,.12,'triangle',.28,0,100);noise(.07,700,.7,.18);return}
  if(/ランプ|ポンプ/.test(name)){noise(.055,2200,1,.23);note(760,.05,'triangle',.12,.015,360);return}
  if(/キャンドル/.test(name)){noise(.45,650,.4,.14);return}
  // Glass, mirror and bottles have a short resonant clink.
  [1350,2401,3710].forEach((f,i)=>note(f,.6-i*.13,'sine',.19/(i+1),i*.004));
 }
 return {unlock,note,play};
}
