/* ───────────── phase 3: post-processing shader (bloom · grain · vignette · CA · grade) ───────────── */
// per-stage film look: lift = shadow tint, gain = highlight tint
const GRADES=[
 {lift:[.035,.02,0],  gain:[1.05,.98,.86],sat:.85,con:1.05,bloom:.9, grain:.07, vig:.55,ca:.006}, // studio: 70s film stock
 {lift:[.02,0,.045],  gain:[1.03,.94,1.08],sat:1.18,con:1.1,bloom:1.5,grain:.06, vig:.5, ca:.010}, // hustle: neon night
 {lift:[.03,.015,0],  gain:[1.08,1.0,.9], sat:1.06,con:1.03,bloom:1.1,grain:.045,vig:.4, ca:.005}, // downtown: golden hour
 {lift:[.02,.012,0],gain:[1.03,1.0,.95],sat:1.0,con:1.04,bloom:1.1,grain:.03,vig:.42,ca:.004}, // estate: marble + gold
 {lift:[0,.012,.035], gain:[.98,1.0,1.06],sat:1.0, con:1.1, bloom:1.35,grain:.03,vig:.5, ca:.004}, // penthouse: cool night
];
const MOODS={
 normal:   {gain:[1,1,1],        sat:1,   con:1,   lift:[0,0,0],       msg:'Market: normal.'},
 boom:     {gain:[1.07,1.02,.93],sat:1.2, con:1.03,lift:[.012,.006,0],  msg:'Market: boom. Everything looks warm, bright and a little overpriced.'},
 recession:{gain:[.9,.96,1.06],  sat:.55, con:.94, lift:[0,.006,.03],  msg:'Market: recession. Colder light, fewer buyers, more motivated sellers.'},
};
let fxLevel=1,mood='normal';const FX_STEPS=[[0.42,'Shaders: subtle'],[1,'Shaders: full'],[0,'Shaders: off']];let fxStep=1;const cur={};
const scr=$('screen');
const gl=scr.getContext('webgl',{antialias:false,preserveDrawingBuffer:false});
let post=()=>{};
if(!gl){scr.replaceWith(cv)}
else{
 const VS='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
 const FS=`precision highp float;
 uniform sampler2D u_tex,u_blur;uniform vec2 u_res;uniform float u_time,u_fx,u_sat,u_con,u_bloom,u_grain,u_vig,u_ca;uniform vec3 u_lift,u_gain;varying vec2 v;
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){
  vec3 raw=texture2D(u_tex,v).rgb;
  vec2 d=v-.5;float ca=u_ca*dot(d,d)*4.;
  vec3 col=vec3(texture2D(u_tex,v+d*ca).r,raw.g,texture2D(u_tex,v-d*ca).b);
  vec3 b=vec3(0.);
  for(int i=0;i<28;i++){float fi=float(i);float r=sqrt((fi+.5)/28.)*14.;float a=fi*2.39996;
   vec3 s=texture2D(u_blur,v+vec2(cos(a),sin(a))*r/u_res).rgb;float lum=dot(s,vec3(.299,.587,.114));b+=s*smoothstep(.62,.98,lum);}
  col+=b/28.*u_bloom;
  col=col*u_gain+u_lift*(1.-col);
  float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,u_sat);col=(col-.5)*u_con+.5;
  col*=1.-u_vig*smoothstep(.2,.85,length(d*vec2(1.25,1.)));
  vec2 px=floor(v*u_res);col+=(hash(px+vec2(mod(u_time,97.)*13.,mod(u_time,89.)*7.))-.5)*u_grain;
  gl_FragColor=vec4(mix(raw,clamp(col,0.,1.),u_fx),1.);
 }`;
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
 const prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);gl.useProgram(prog);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const pa=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(pa);gl.vertexAttribPointer(pa,2,gl.FLOAT,false,0,0);
 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
 const mkTex=(filter,unit)=>{const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);return t};
 const texSharp=mkTex(gl.NEAREST,0),texSoft=mkTex(gl.LINEAR,1);
 const U={};['u_tex','u_blur','u_res','u_time','u_fx','u_sat','u_con','u_bloom','u_grain','u_vig','u_ca','u_lift','u_gain'].forEach(n=>U[n]=gl.getUniformLocation(prog,n));
 gl.uniform1i(U.u_tex,0);gl.uniform1i(U.u_blur,1);gl.uniform2f(U.u_res,W,H);
 post=function(){
  const g=GRADES[si],m=MOODS[mood],sleepy=pose=='lie'?lampsOff:0;
  const k=fxLevel,mk2=(a,n)=>n+(a-n)*k;const tgt={lift:g.lift.map((x,i)=>mk2(x+m.lift[i],0)),gain:g.gain.map((x,i)=>mk2(x*m.gain[i],1)),sat:mk2(g.sat*m.sat,1),con:mk2(g.con*m.con,1),bloom:g.bloom*k*.8,grain:g.grain*k*.7,vig:(g.vig+sleepy*.4)*Math.min(1,k*1.3),ca:g.ca*k*.6,fx:k>0?1:0};
  for(const k in tgt){const x=tgt[k];if(cur[k]===undefined)cur[k]=Array.isArray(x)?[...x]:x;else if(Array.isArray(x))cur[k]=cur[k].map((c,i)=>c+(x[i]-c)*.06);else cur[k]+=(x-cur[k])*.06}
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texSharp);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cv);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,texSoft);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cv);
  gl.uniform1f(U.u_time,Math.floor(time/6));gl.uniform1f(U.u_fx,cur.fx);gl.uniform1f(U.u_sat,cur.sat);gl.uniform1f(U.u_con,cur.con);
  gl.uniform1f(U.u_bloom,cur.bloom);gl.uniform1f(U.u_grain,cur.grain);gl.uniform1f(U.u_vig,cur.vig);gl.uniform1f(U.u_ca,cur.ca);
  gl.uniform3fv(U.u_lift,cur.lift);gl.uniform3fv(U.u_gain,cur.gain);
  gl.viewport(0,0,scr.width,scr.height);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 };
}
// dev controls: FX toggle + market mood
{
 const sep=document.createElement('span');sep.textContent='· FX';dev.appendChild(sep);
 const fxB=document.createElement('button');fxB.textContent='Shaders: full';fxB.setAttribute('aria-pressed','true');dev.appendChild(fxB);
 const mB=document.createElement('button');mB.textContent='Market: normal';dev.appendChild(mB);
 const toggleFx=()=>{fxStep=(fxStep+1)%3;[fxLevel]=FX_STEPS[fxStep];fxB.textContent=FX_STEPS[fxStep][1];fxB.setAttribute('aria-pressed',fxLevel>0)};
 const cycleMood=()=>{mood={normal:'boom',boom:'recession',recession:'normal'}[mood];mB.textContent='Market: '+mood;mB.setAttribute('aria-pressed',mood!='normal');say(MOODS[mood].msg)};
 fxB.onclick=toggleFx;mB.onclick=cycleMood;
 addEventListener('keydown',e=>{if(mode!='free')return;const k=e.key.toLowerCase();if(k==='f')toggleFx();if(k==='m')cycleMood()});
}
