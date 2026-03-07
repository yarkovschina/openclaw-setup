import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

const _ = 0;

const NEO_PALETTE = {
  0: "transparent", 1: "#111118", 2: "#d4a574", 3: "#b8895c",
  4: "#8b1a4a", 5: "#c2255c", 6: "#d63384", 7: "#e85daa",
  8: "#f0a0cc", 9: "#22222e", 10: "#3a3a4e", 11: "#1e90ff",
  12: "#0d0d14", 13: "#2a2a38", 14: "#181820",
};

const NEO_SPRITE = [
  [_,_,_,_,_,_,_,_,_,1,1,1,1,1,1,1,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,1,1,13,1,1,1,13,1,1,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,1,13,1,1,1,1,1,1,13,1,1,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,1,1,1,1,1,1,1,1,1,1,1,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,1,1,1,1,1,1,1,1,1,1,1,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,2,2,2,2,2,2,2,2,2,2,1,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,2,2,2,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,10,11,10,2,2,2,10,11,10,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,10,11,10,2,2,2,10,11,10,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,2,2,2,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,2,3,2,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,3,3,3,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,2,2,2,2,2,2,2,2,2,2,1,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,1,2,2,2,2,2,2,2,2,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,5,6,5,1,14,14,14,14,14,14,14,14,1,5,6,5,_,_,_,_,_],
  [_,_,_,_,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,_,_,_,_],
  [_,_,_,_,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,_,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,8,6,2,14,14,14,14,14,14,14,14,2,6,8,6,5,4,_,_,_],
  [_,_,_,4,5,6,8,2,2,14,14,14,14,14,14,14,14,2,2,8,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,2,3,14,14,14,14,14,14,14,14,3,2,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,1,1,1,1,1,1,1,1,1,5,6,7,6,5,4,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,9,9,9,9,9,9,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,9,9,9,9,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,9,9,9,9,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,9,9,9,9,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,1,9,9,1,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,1,9,9,1,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,1,9,9,1,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,1,9,9,1,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,1,9,9,1,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,9,1,9,9,1,9,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,1,1,9,9,1,1,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,9,9,1,_,9,9,_,1,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,1,1,1,_,9,9,_,1,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,4,_,_,_,9,9,_,_,5,6,7,6,5,4,_,_,_],
  [_,_,_,_,4,5,6,5,4,_,_,_,_,1,1,_,_,_,4,5,6,5,4,_,_,_],
  [_,_,_,_,_,4,5,4,_,_,_,_,1,12,12,1,_,_,_,4,5,4,_,_,_,_],
  [_,_,_,_,_,_,4,_,_,_,_,1,12,12,12,12,1,_,_,_,4,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,1,12,12,12,12,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,1,1,1,1,1,1,1,_,_,_,_,_,_,_,_],
];

const MONKEY_PALETTE = {
  0: "transparent", 1: "#1a1209", 2: "#5c3a1e", 3: "#8b5e34",
  4: "#a67442", 5: "#e8c89a", 6: "#c9a472", 7: "#cc1111",
  8: "#ffffff", 9: "#3d2214", 10: "#d4956a", 11: "#d4b896", 12: "#6b3f20",
};

const MONKEY_SPRITE = [
  [_,_,_,_,_,_,_,_,_,1,1,1,1,1,1,1,1,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,1,2,3,3,3,3,3,3,2,1,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,3,4,4,3,3,4,4,3,2,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,1,1,1,1,2,3,4,4,3,3,3,3,4,4,3,2,1,1,1,_,_,_,_,_,_],
  [_,_,1,10,10,10,1,3,3,3,3,3,3,3,3,3,3,3,1,10,10,10,1,_,_,_,_,_],
  [_,1,2,10,5,10,1,3,3,3,3,3,3,3,3,3,3,3,1,10,5,10,2,1,_,_,_,_],
  [_,_,1,10,10,10,1,3,3,3,3,3,3,3,3,3,3,3,1,10,10,10,1,_,_,_,_,_],
  [_,_,_,1,1,1,3,3,5,5,5,5,5,5,5,5,5,3,3,1,1,1,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,9,9,5,5,5,5,5,9,9,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,8,7,5,5,5,5,5,8,7,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,8,7,5,5,5,5,5,8,7,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,5,5,5,9,9,9,5,5,5,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,5,9,9,1,1,1,9,9,5,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,6,5,5,6,6,6,5,5,6,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,3,5,5,5,5,5,5,5,5,5,3,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,1,3,3,3,3,3,3,3,1,1,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,1,1,1,2,3,3,11,11,11,11,11,3,3,2,1,1,1,_,_,_,_,1,12,1],
  [_,_,_,1,2,3,2,2,3,11,11,11,11,11,11,11,3,2,2,3,2,1,_,_,_,1,12,1],
  [_,_,1,2,3,4,3,2,3,11,11,11,11,11,11,11,3,2,3,4,3,2,1,_,1,12,1,_],
  [_,_,1,2,3,4,5,1,3,3,11,11,11,11,11,3,3,1,5,4,3,2,1,_,1,12,1,_],
  [_,_,_,1,2,3,5,1,2,3,3,3,3,3,3,3,3,2,1,5,3,2,1,1,12,1,_,_],
  [_,_,_,_,1,1,1,1,2,3,3,3,3,3,3,3,3,2,1,1,1,12,12,1,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,2,3,3,3,3,3,2,2,2,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,2,3,1,1,3,3,2,2,2,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,2,1,_,_,1,2,2,2,1,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,3,1,1,_,_,1,1,3,3,1,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,3,3,1,_,_,1,3,3,3,1,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,1,1,1,_,_,1,1,1,1,1,1,_,_,_,_,_,_,_,_,_],
];

const PP_PALETTE = { 0:"transparent",1:"#f0c4c8",2:"#e0a0a4",3:"#c8787e",4:"#a05058",5:"#7a3840",6:"#d4909a" };
const PP_SPRITE = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,5,5,5,_,_],
  [_,5,5,_,_,_,_,_,_,_,_,_,5,3,1,3,5,_],
  [5,4,3,5,5,5,5,5,5,5,5,5,4,2,1,2,4,5],
  [5,3,1,6,4,3,2,2,2,2,2,3,3,1,1,1,3,5],
  [5,2,1,2,3,2,1,1,1,1,1,2,2,1,1,1,2,5],
  [5,2,1,2,3,2,1,1,1,1,1,2,2,1,1,1,2,5],
  [5,3,1,6,4,3,2,2,2,2,2,3,3,1,1,1,3,5],
  [5,4,3,5,5,5,5,5,5,5,5,5,4,2,1,2,4,5],
  [_,5,5,_,_,_,_,_,_,_,_,_,5,3,1,3,5,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,5,5,5,_,_],
];

function drawSprite(canvas, sprite, palette, ps, flipX = false) {
  const w = sprite[0].length, h = sprite.length;
  canvas.width = Math.ceil(w * ps); canvas.height = Math.ceil(h * ps);
  const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (flipX) { ctx.save(); ctx.scale(-1, 1); ctx.translate(-canvas.width, 0); }
  for (let y = 0; y < h; y++) for (let x = 0; x < sprite[y].length; x++) {
    const c = sprite[y][x]; if (c === 0) continue;
    ctx.fillStyle = palette[c];
    ctx.fillRect(Math.floor(x * ps), Math.floor(y * ps), Math.ceil(ps), Math.ceil(ps));
  }
  if (flipX) ctx.restore();
}

function SpriteCanvas({ sprite, palette, ps, flipX = false, style = {} }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) drawSprite(ref.current, sprite, palette, ps, flipX); }, [sprite, palette, ps, flipX]);
  return <canvas ref={ref} style={{ imageRendering: "pixelated", ...style }} />;
}

const TASKS = ["Планирование встреч","Поиск информации","Разбор почты","Календарь и слоты","Сводка созвонов","Фоллоу-апы","Подготовка отчётов","Ресёрч конкурентов","Постановка задач","Контроль дедлайнов","Составление ТЗ","Сбор требований","Сортировка лидов","Ответы клиентам","Обновление CRM","Триаж запросов","Подбор подрядчиков","Синхронизация команды","Поиск багов","Брифинг руководителю"];

const W = 920, H = 560, GY = 470;
const MPS = 3, NPS = MPS * 1.05, PPS = 2;
const PW = Math.ceil(26 * NPS), PH = Math.ceil(46 * NPS);
const EW = 28 * MPS, EH = 28 * MPS;
const SPD = 8, JV = -15, GR = 0.82, WK = 15, ML = 3;
const SI = 16000, SS = 54, EXC = 24, GD = 600;

const cl = (v,a,b) => Math.max(a, Math.min(b, v));
const rn = (a,b) => Math.random() * (b - a) + a;

function mkE(id, sc) {
  const x = Math.random() > .5 ? rn(40,180) : rn(W-240,W-120);
  const fc = Math.max(1400, 2500 - sc * 40), rd = Math.max(1000, 1800 - sc * 20);
  return { id, name: TASKS[id % TASKS.length], x, y: GY - EH, vx: Math.random() > .5 ? 1 : -1,
    speed: rn(.8,1.6) + Math.min(sc * .03, 1.1), phase: "aiming", pt: fc, fc, rd };
}
function mkB(id,x,y,dir,speed=7.2,kind="enemy") { return {id,x,y,dir,speed,kind,rot:0}; }
function mkEx(cx,cy,i,t) {
  const a = (i/t)*Math.PI*2 + (Math.random()-.5)*.5, s = rn(3,10);
  return { x:cx, y:cy, vx:Math.cos(a)*s, vy:Math.sin(a)*s - rn(2,6), rot:0, life:1, sz:rn(10,24) };
}

function Game() {
  const [lives, sL] = useState(ML);
  const [kills, sK] = useState(0);
  const [pl, sP] = useState({ x:W/2-PW/2, y:GY-PH, vy:0, f:1, inv:0, cd:0, at:0 });
  const [en, sE] = useState([mkE(1,0), mkE(2,0)]);
  const [bu, sB] = useState([]);
  const [keys, sKy] = useState({ l:0, r:0, u:0, a:0 });
  const [nid, sNid] = useState(3);
  const [bid, sBid] = useState(1);
  const [msg, sMsg] = useState("Мети клешню и добивай обезьян во время перезарядки. Лови золотую клешню!");
  const [gs, sGs] = useState("playing");
  const [sc, sSc] = useState(null);
  const [ex, sEx] = useState([]);
  const [gl, sGl] = useState(0);
  const [sh, sSh] = useState({x:0,y:0});
  const sct = useRef(SI * .55);
  const fr = useRef(null);
  const R = {
    k:useRef(keys), p:useRef(pl), e:useRef(en), b:useRef(bu),
    i:useRef({nid:3,bid:1}), s:useRef({gs:"playing",kills:0,lives:ML}),
    sc:useRef(null), ex:useRef([]), gl:useRef(0),
  };
  useEffect(()=>{R.k.current=keys},[keys]);
  useEffect(()=>{R.p.current=pl},[pl]);
  useEffect(()=>{R.e.current=en},[en]);
  useEffect(()=>{R.b.current=bu},[bu]);
  useEffect(()=>{R.i.current={nid,bid}},[nid,bid]);
  useEffect(()=>{R.s.current={gs,kills,lives}},[gs,kills,lives]);
  useEffect(()=>{R.sc.current=sc},[sc]);
  useEffect(()=>{R.ex.current=ex},[ex]);
  useEffect(()=>{R.gl.current=gl},[gl]);

  const reset = useCallback(() => {
    const fe=[mkE(1,0),mkE(2,0)], fp={x:W/2-PW/2,y:GY-PH,vy:0,f:1,inv:0,cd:0,at:0};
    sL(ML);sK(0);sP(fp);sE(fe);sB([]);sNid(3);sBid(1);
    sMsg("Мети клешню и добивай обезьян во время перезарядки. Лови золотую клешню!");
    sGs("playing");sSc(null);sEx([]);sGl(0);sSh({x:0,y:0});sct.current=SI*.55;
    R.p.current=fp;R.e.current=fe;R.b.current=[];R.i.current={nid:3,bid:1};
    R.s.current={gs:"playing",kills:0,lives:ML};R.sc.current=null;R.ex.current=[];R.gl.current=0;
  },[]);

  useEffect(()=>{
    const d=e=>{
      if(["ArrowLeft","a","A"].includes(e.key))sKy(k=>({...k,l:1}));
      if(["ArrowRight","d","D"].includes(e.key))sKy(k=>({...k,r:1}));
      if(["ArrowUp","w","W"," "].includes(e.key)){e.preventDefault();sKy(k=>({...k,u:1}));}
      if(["Enter","f","F"].includes(e.key)){e.preventDefault();sKy(k=>({...k,a:1}));}
      if(e.key==="r"||e.key==="R")reset();
    };
    const u=e=>{
      if(["ArrowLeft","a","A"].includes(e.key))sKy(k=>({...k,l:0}));
      if(["ArrowRight","d","D"].includes(e.key))sKy(k=>({...k,r:0}));
      if(["ArrowUp","w","W"," "].includes(e.key))sKy(k=>({...k,u:0}));
      if(["Enter","f","F"].includes(e.key))sKy(k=>({...k,a:0}));
    };
    window.addEventListener("keydown",d);window.addEventListener("keyup",u);
    return()=>{window.removeEventListener("keydown",d);window.removeEventListener("keyup",u);};
  },[reset]);

  useEffect(()=>{
    let last=performance.now();
    const loop=now=>{
      const dt=Math.min(33,now-last);last=now;
      const sn=R.s.current;
      let lex=R.ex.current.map(c=>({...c}));
      if(lex.length>0){
        lex=lex.map(c=>({...c,x:c.x+c.vx,y:c.y+c.vy,vy:c.vy+.28,rot:c.rot+16,life:c.life-.017})).filter(c=>c.life>0);
        sEx(lex);R.ex.current=lex;
      }
      if(sn.gs!=="playing"){fr.current=requestAnimationFrame(loop);return;}

      const K=R.k.current;
      let cp={...R.p.current},ce=R.e.current.map(e=>({...e})),cb=R.b.current.map(b=>({...b}));
      let{nid:lid,bid:lbid}=R.i.current;
      let lk=sn.kills,ll=sn.lives,lg=sn.gs,lm=null;
      let lsc=R.sc.current?{...R.sc.current}:null;
      let lgl=R.gl.current;

      cp.inv=Math.max(0,cp.inv-dt);cp.cd=Math.max(0,cp.cd-dt);cp.at=Math.max(0,cp.at-dt);
      if(K.l){cp.x-=SPD;cp.f=-1;}if(K.r){cp.x+=SPD;cp.f=1;}
      if(K.u&&cp.y>=GY-PH-.1)cp.vy=JV;
      cp.vy+=GR;cp.y+=cp.vy;
      if(cp.y>GY-PH){cp.y=GY-PH;cp.vy=0;}
      cp.x=cl(cp.x,8,W-PW-8);

      if(K.a&&cp.cd<=0){
        cp.cd=520;cp.at=170;
        cb.push(mkB(lbid++,cp.x+(cp.f===1?PW-2:-6),cp.y+80,cp.f,10.5,"claw"));
      }

      sct.current-=dt;
      if(sct.current<=0&&!lsc){
        lsc={x:rn(100,W-140),y:GY-SS,active:1};
        sct.current=SI+rn(-3000,3000);
        lm="⚡ Золотая клешня! Наступи на неё!";
      }

      if(lsc&&lsc.active){
        const dx=(cp.x+PW/2)-(lsc.x+SS/2),dy=(cp.y+PH)-(lsc.y+SS/2);
        if(Math.sqrt(dx*dx+dy*dy)<PW*.7){
          const kc=ce.length;lk+=kc;if(lk>=WK){lk=WK;lg="won";}
          const cx=lsc.x+SS/2,cy=lsc.y+SS/2;
          for(let i=0;i<EXC;i++)lex.push(mkEx(cx,cy,i,EXC));
          ce.forEach(e=>{for(let i=0;i<6;i++)lex.push(mkEx(e.x+EW/2,e.y+EH/2,i,6));});
          ce=[];cb=cb.filter(b=>b.kind!=="enemy");lsc=null;lgl=GD;
          lm=lg==="won"?"Поздравляем! Ты выбил приз — скидку 15%.":"💥 СУПЕР-КЛЕШНЯ! Уничтожено "+kc+" обезьян!";
        }
      }

      if(lgl>0){lgl=Math.max(0,lgl-dt);const i=lgl/GD;
        sSh({x:Math.round((Math.random()-.5)*14*i),y:Math.round((Math.random()-.5)*10*i)});
      }else{sSh({x:0,y:0});}

      ce=ce.map(enemy=>{
        let x=enemy.x+enemy.vx*enemy.speed,vx=enemy.vx;
        if(x<20||x>W-EW-20)vx*=-1;x=cl(x,20,W-EW-20);
        let pt=enemy.pt-dt,ph=enemy.phase,shoot=false;
        if(pt<=0){if(ph==="aiming"){ph="reloading";pt=enemy.rd;shoot=true;}else{ph="aiming";pt=enemy.fc;}}
        if(shoot){const dir=cp.x+PW/2<x+EW/2?-1:1;
          cb.push(mkB(lbid++,x+EW/2,enemy.y+EH/2,dir,6.7+Math.min(lk*.08,1.4),"enemy"));}
        return{...enemy,x,vx,phase:ph,pt};
      });

      const surv=[];
      for(const b of cb){
        const m={...b,x:b.x+b.dir*b.speed,rot:(b.rot||0)+(b.kind==="claw"?28:0)};
        if(m.kind==="enemy"&&m.x>cp.x&&m.x<cp.x+PW&&m.y>cp.y&&m.y<cp.y+PH&&cp.inv<=0){
          cp.inv=1200;ll-=1;
          if(ll<=0){ll=0;lg="lost";lm="open//neo пал. Обезьяны победили.";}
          else{lm="Попадание! Уходи и кидай клешню в окно перезарядки.";}continue;
        }
        if(m.kind==="claw"){let hi=-1;
          for(let i=0;i<ce.length;i++){const e=ce[i];
            if(e.phase==="reloading"&&m.x>e.x-10&&m.x<e.x+EW+10&&m.y>e.y&&m.y<e.y+EH){hi=i;break;}}
          if(hi!==-1){ce.splice(hi,1);lk+=1;
            if(lk>=WK){lk=WK;lg="won";lm="Поздравляем! Ты выбил приз — скидку 15%.";}
            else{lm="Точное попадание! Продолжай — цель 15 обезьян.";}continue;}}
        if(m.x>-40&&m.x<W+40&&lg==="playing")surv.push(m);
      }
      cb=surv;
      while(lg==="playing"&&ce.length<2)ce.push(mkE(lid++,lk));

      sP(cp);sE(ce);sB(cb);sK(lk);sL(ll);sGs(lg);if(lm)sMsg(lm);
      sNid(lid);sBid(lbid);sSc(lsc);sEx(lex);sGl(lgl);
      R.p.current=cp;R.e.current=ce;R.b.current=cb;
      R.i.current={nid:lid,bid:lbid};R.s.current={gs:lg,kills:lk,lives:ll};
      R.sc.current=lsc;R.ex.current=lex;R.gl.current=lgl;
      fr.current=requestAnimationFrame(loop);
    };
    fr.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(fr.current);
  },[]);

  const prog=useMemo(()=>cl((kills/WK)*100,0,100),[kills]);
  const ga=gl>0,gi=gl/GD;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4" style={{fontFamily:"'Courier New',monospace"}}>
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">open//neo vs claw monkeys</h1>
            <p className="text-neutral-400 mt-2 max-w-3xl text-sm">Обезьяны стреляют в open//neo. Добивай их клешнёй во время перезарядки. Лови золотую клешню для суперудара!</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {["← → двигаться","↑/Space прыгать","Enter/F клешня","R рестарт"].map(t=>(
              <span key={t} className="px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900">{t}</span>))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-3">
            <div className="relative rounded-xl overflow-hidden border border-neutral-800" style={{
              width:"100%",height:H,background:"linear-gradient(180deg,#0a0a12 0%,#111118 60%,#1a1a24 100%)",
              transform:`translate(${sh.x}px,${sh.y}px)`,transition:ga?"none":"transform .1s ease-out"}}>
              <div className="absolute inset-0 opacity-10" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>
              {ga&&<><div className="absolute inset-0 z-30 pointer-events-none" style={{background:`rgba(255,0,50,${.1*gi})`,transform:`translateX(${Math.round((Math.random()-.5)*10*gi)}px)`,mixBlendMode:"screen"}}/><div className="absolute inset-0 z-30 pointer-events-none" style={{background:`rgba(0,255,100,${.07*gi})`,transform:`translateX(${Math.round((Math.random()-.5)*8*gi)}px)`,mixBlendMode:"screen"}}/><div className="absolute inset-0 z-30 pointer-events-none" style={{background:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,${.18*gi}) 2px,rgba(0,0,0,${.18*gi}) 4px)`}}/>{gi>.8&&<div className="absolute inset-0 z-30 pointer-events-none" style={{background:`rgba(255,215,0,${.35*gi})`}}/>}</>}
              <div className="absolute left-0 right-0 border-t border-neutral-600/40" style={{top:GY,height:H-GY,background:"linear-gradient(180deg,#1e1e28 0%,#141418 100%)"}}/>

              {sc&&sc.active&&(
                <div className="absolute z-10" style={{left:sc.x,top:sc.y,width:SS,height:SS}}>
                  <div className="absolute inset-[-14px] rounded-full" style={{background:"radial-gradient(circle,rgba(255,215,0,.3) 0%,rgba(255,215,0,.08) 50%,transparent 70%)",animation:"sPulse 1.2s ease-in-out infinite"}}/>
                  <div className="absolute left-1/2 -translate-x-1/2" style={{width:4,height:100,bottom:0,background:"linear-gradient(180deg,transparent 0%,rgba(255,215,0,.12) 30%,rgba(255,215,0,.35) 100%)"}}/>
                  <div className="absolute inset-0 flex items-center justify-center text-[42px] select-none" style={{filter:"brightness(1.3) saturate(1.5) sepia(.6) hue-rotate(-10deg) drop-shadow(0 0 10px rgba(255,215,0,.8))",animation:"sBob 1s ease-in-out infinite"}}>🦞</div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[.25em] font-bold" style={{color:"#ffd700",textShadow:"0 0 8px rgba(255,215,0,.5)"}}>SUPER</div>
                </div>
              )}

              {ex.map((c,i)=>(
                <div key={`ex${i}`} className="absolute select-none pointer-events-none z-20" style={{
                  left:c.x-c.sz/2,top:c.y-c.sz/2,width:c.sz,height:c.sz,
                  opacity:Math.min(1,c.life*2.5),transform:`rotate(${c.rot}deg)`,
                  fontSize:c.sz*.8,lineHeight:`${c.sz}px`,textAlign:"center",
                  filter:`brightness(${1+c.life}) saturate(${1+c.life}) sepia(${c.life*.5}) hue-rotate(-10deg) drop-shadow(0 0 ${c.life*8}px rgba(255,215,0,${c.life}))`}}>🦞</div>
              ))}

              {bu.map(b=>(
                <div key={b.id} className="absolute" style={{left:b.x-(b.kind==="claw"?13:18),top:b.y-(b.kind==="claw"?13:10)}}>
                  {b.kind==="claw"?<span className="text-[25px] inline-block select-none" style={{transform:`rotate(${b.rot}deg)`}}>🦞</span>
                  :<SpriteCanvas sprite={PP_SPRITE} palette={PP_PALETTE} ps={PPS} flipX={b.dir===-1} style={{position:"relative",zIndex:2}}/>}
                </div>
              ))}

              {en.map(e=>{const v=e.phase==="reloading",fp=pl.x+PW/2>e.x+EW/2;return(
                <div key={e.id} className="absolute" style={{left:e.x,top:e.y,width:EW,height:EH}}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-2 py-0.5 rounded-full border bg-neutral-950/90" style={{borderColor:v?"#34d399":"#fb923c"}}>{e.name}</div>
                  <SpriteCanvas sprite={MONKEY_SPRITE} palette={MONKEY_PALETTE} ps={MPS} flipX={!fp} style={{position:"absolute",left:0,top:0,filter:v?"drop-shadow(0 0 6px rgba(52,211,153,.4))":"drop-shadow(0 0 4px rgba(251,146,60,.2))"}}/>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[.2em] whitespace-nowrap" style={{color:v?"#34d399":"#fb923c"}}>{v?"Перезарядка":"Стреляет"}</div>
                  {v&&<div className="absolute inset-0 rounded-md border border-emerald-400/30" style={{boxShadow:"0 0 16px rgba(52,211,153,.15)"}}/>}
                </div>);})}

              <div className="absolute" style={{left:pl.x,top:pl.y,width:PW,height:PH,opacity:pl.inv>0?(Math.floor(Date.now()/100)%2?.35:1):1}}>
                <SpriteCanvas sprite={NEO_SPRITE} palette={NEO_PALETTE} ps={NPS} flipX={pl.f===-1} style={{position:"absolute",left:0,top:0,filter:"drop-shadow(0 0 6px rgba(214,51,132,.25))"}}/>
                {pl.at>0&&<span className="absolute text-[18px] select-none" style={{top:36,[pl.f===1?"right":"left"]:-16}}>🦞</span>}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-[.22em] uppercase whitespace-nowrap" style={{color:"#67e8f9",textShadow:"0 0 8px rgba(103,232,249,.3)"}}>open//neo</div>
              </div>

              {(gs==="won"||gs==="lost")&&(
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-20">
                  <div className="w-full max-w-md bg-neutral-950 border border-neutral-700 rounded-2xl p-8 text-center space-y-5">
                    {gs==="won"?<><div className="text-5xl">🎁</div><h2 className="text-3xl font-bold">Поздравляем!</h2><p className="text-neutral-300">open//neo уничтожил 15 обезьян.</p><div className="text-5xl font-black tracking-tight text-emerald-400">СКИДКА 15%</div><div className="text-neutral-400">Промокод: OPENNEO15</div></>:<>
                    <h2 className="text-3xl font-bold text-red-400">Game Over</h2>
                    <div className="relative mx-auto" style={{width:160,height:200}}>
                      {/* Neo sprite centered */}
                      <div className="absolute" style={{left:50,top:10,zIndex:2}}>
                        <SpriteCanvas sprite={NEO_SPRITE} palette={NEO_PALETTE} ps={1.4} style={{width:Math.ceil(26*1.4),height:Math.ceil(46*1.4)}}/>
                      </div>
                      {/* Projectiles piled around Neo up to neck */}
                      {[
                        {x:15,y:140,r:-30,s:2.2},{x:55,y:148,r:15,s:2},{x:90,y:135,r:-10,s:2.3},{x:120,y:142,r:25,s:2},
                        {x:5,y:115,r:40,s:2.1},{x:40,y:120,r:-20,s:2},{x:75,y:125,r:5,s:2.2},{x:110,y:118,r:-35,s:2.1},{x:135,y:122,r:18,s:2},
                        {x:20,y:95,r:-15,s:2},{x:55,y:100,r:30,s:2.1},{x:85,y:98,r:-25,s:2},{x:115,y:102,r:10,s:2.2},
                        {x:10,y:72,r:22,s:1.9},{x:48,y:78,r:-8,s:2},{x:80,y:75,r:35,s:2.1},{x:112,y:80,r:-20,s:1.9},{x:130,y:70,r:12,s:2},
                        {x:28,y:52,r:-28,s:1.8},{x:60,y:55,r:15,s:1.9},{x:92,y:50,r:-5,s:2},{x:118,y:58,r:28,s:1.8},
                      ].map((p,i)=>(
                        <div key={`pp${i}`} className="absolute" style={{left:p.x,top:p.y,transform:`rotate(${p.r}deg)`,zIndex:p.y>90?3:1,opacity:0.9}}>
                          <SpriteCanvas sprite={PP_SPRITE} palette={PP_PALETTE} ps={p.s} style={{width:Math.ceil(18*p.s),height:Math.ceil(10*p.s)}}/>
                        </div>
                      ))}
                    </div>
                    <p className="text-neutral-300">open//neo потерял все 3 жизни.</p>
                    </>}
                    <button onClick={reset} className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors">↻ Играть ещё раз</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-sm"><span className="text-neutral-400">Прогресс</span><span className="font-bold">{kills}/{WK}</span></div>
              <div className="h-3 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700"><div className="h-full rounded-full transition-all duration-300" style={{width:`${prog}%`,background:"linear-gradient(90deg,#ec4899,#34d399,#67e8f9)"}}/></div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-neutral-800 p-2 bg-neutral-950/70"><div className="text-[10px] text-neutral-400 uppercase">Фраги</div><div className="text-xl font-bold">{kills}</div></div>
                <div className="rounded-xl border border-neutral-800 p-2 bg-neutral-950/70"><div className="text-[10px] text-neutral-400 uppercase">Жизни</div><div className="text-xl font-bold text-red-400">{"♥".repeat(lives)}{"♡".repeat(ML-lives)}</div></div>
                <div className="rounded-xl border border-neutral-800 p-2 bg-neutral-950/70"><div className="text-[10px] text-neutral-400 uppercase">Статус</div><div className="text-sm font-bold mt-1" style={{color:gs==="playing"?"#67e8f9":gs==="won"?"#34d399":"#f87171"}}>{gs==="playing"?"В бою":gs==="won"?"Победа":"Поражение"}</div></div>
              </div>
            </div>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">Правила</h3>
              <div className="text-xs text-neutral-400 space-y-1.5 leading-5">
                <p>1. Обезьяны стреляют в open//neo.</p>
                <p>2. Убить обезьяну можно только в <span className="text-emerald-400">«Перезарядку»</span>.</p>
                <p>3. У open//neo 3 жизни.</p>
                <p>4. Победа — 15 убитых обезьян.</p>
                <p>5. <span style={{color:"#ffd700"}}>Золотая клешня</span> — суперудар, убивает всех!</p>
              </div>
            </div>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4"><h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-2">Подсказка</h3><p className="text-xs text-neutral-400 leading-5">{msg}</p></div>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-3">Персонажи</h3>
              <div className="flex items-center gap-3 mb-3"><SpriteCanvas sprite={NEO_SPRITE} palette={NEO_PALETTE} ps={1} style={{width:26,height:46}}/><div><div className="text-xs font-bold text-cyan-300">open//neo</div><div className="text-[10px] text-neutral-500">Герой. Мечет клешню 🦞</div></div></div>
              <div className="flex items-center gap-3 mb-3"><SpriteCanvas sprite={MONKEY_SPRITE} palette={MONKEY_PALETTE} ps={1} style={{width:28,height:28}}/><div><div className="text-xs font-bold text-orange-300">Claw Monkey</div><div className="text-[10px] text-neutral-500">Враг. Стреляет задачами</div></div></div>
              <div className="flex items-center gap-3"><div className="flex items-center justify-center" style={{width:28,height:28,filter:"sepia(.6) hue-rotate(-10deg) brightness(1.3) saturate(1.5)",fontSize:22}}>🦞</div><div><div className="text-xs font-bold" style={{color:"#ffd700"}}>Золотая клешня</div><div className="text-[10px] text-neutral-500">Суперудар. Убивает всех</div></div></div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes sPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.4);opacity:1}}@keyframes sBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>
    </div>
  );
}

export default function NeoClawMonkeyGame() { return <Game />; }
