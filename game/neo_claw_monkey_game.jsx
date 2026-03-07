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

const TASKS = ["Schedule meetings","Research info","Sort inbox","Calendar slots","Call summaries","Follow-ups","Prepare reports","Competitor research","Task planning","Deadline tracking","Write specs","Gather requirements","Sort leads","Reply to clients","Update CRM","Triage requests","Find contractors","Sync the team","Bug tracking","Brief the boss"];

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

// Death screen data
const NEO_HEAD = [
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
];
const PILE = [
  {x:-10,y:260,r:-8,s:2.8,f:0},{x:35,y:265,r:20,s:2.5,f:1},{x:78,y:258,r:-15,s:3,f:0},
  {x:122,y:263,r:12,s:2.6,f:1},{x:165,y:260,r:-5,s:2.9,f:0},{x:208,y:264,r:18,s:2.5,f:1},
  {x:248,y:258,r:-20,s:2.8,f:0},{x:288,y:262,r:10,s:2.7,f:1},{x:325,y:260,r:-12,s:2.5,f:0},
  {x:12,y:252,r:32,s:2.2,f:1},{x:56,y:248,r:-25,s:2.4,f:0},{x:100,y:252,r:15,s:2.3,f:1},
  {x:144,y:248,r:-18,s:2.5,f:0},{x:186,y:252,r:28,s:2.2,f:1},{x:228,y:248,r:-30,s:2.4,f:0},
  {x:268,y:252,r:12,s:2.3,f:1},{x:306,y:250,r:-22,s:2.2,f:0},
  {x:18,y:228,r:25,s:2.7,f:1},{x:62,y:222,r:-12,s:2.8,f:0},{x:108,y:228,r:8,s:2.5,f:1},
  {x:152,y:224,r:-22,s:2.7,f:0},{x:195,y:222,r:18,s:2.6,f:1},{x:238,y:226,r:-10,s:2.8,f:0},
  {x:278,y:224,r:15,s:2.5,f:1},
  {x:40,y:218,r:-32,s:2,f:0},{x:130,y:216,r:28,s:2.1,f:1},{x:218,y:220,r:-18,s:2,f:0},{x:258,y:218,r:22,s:2.1,f:1},
  {x:42,y:198,r:-15,s:2.7,f:0},{x:88,y:194,r:22,s:2.5,f:1},{x:135,y:200,r:-8,s:2.8,f:0},
  {x:180,y:196,r:15,s:2.6,f:1},{x:224,y:198,r:-25,s:2.5,f:0},{x:264,y:195,r:10,s:2.4,f:1},
  {x:65,y:190,r:30,s:2,f:1},{x:158,y:188,r:-26,s:2.1,f:0},{x:244,y:192,r:18,s:2,f:1},
  {x:68,y:170,r:12,s:2.6,f:0},{x:115,y:166,r:-20,s:2.7,f:1},{x:162,y:172,r:8,s:2.5,f:0},
  {x:208,y:168,r:-15,s:2.6,f:1},{x:248,y:170,r:22,s:2.3,f:0},
  {x:92,y:162,r:-28,s:2,f:1},{x:185,y:160,r:25,s:2.1,f:0},
  {x:92,y:142,r:-10,s:2.5,f:0},{x:140,y:138,r:18,s:2.6,f:1},{x:185,y:144,r:-22,s:2.4,f:0},
  {x:225,y:140,r:12,s:2.3,f:1},
  {x:115,y:134,r:26,s:2,f:0},{x:205,y:132,r:-16,s:2.1,f:1},
  {x:112,y:115,r:15,s:2.4,f:1},{x:160,y:110,r:-12,s:2.5,f:0},{x:205,y:116,r:20,s:2.3,f:1},
  {x:138,y:106,r:-24,s:2,f:0},{x:185,y:108,r:10,s:2,f:1},
  {x:125,y:88,r:18,s:2.3,f:0},{x:168,y:84,r:-15,s:2.4,f:1},{x:208,y:90,r:8,s:2.2,f:0},
  {x:148,y:80,r:-22,s:1.9,f:0},{x:190,y:78,r:14,s:1.9,f:1},
];
const GLC = "@#$%&!?*<>~^{}|/\\";
function GlitchTitle() {
  const [gt, sGt] = useState("ick");
  const [ig, sIg] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      sIg(true); let f = 0;
      const iv = setInterval(() => {
        sGt("ick".split("").map(c => Math.random() > .35 ? GLC[Math.floor(Math.random() * GLC.length)] : c).join(""));
        f++; if (f > 6) { clearInterval(iv); sGt("ick"); sIg(false); }
      }, 60);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <h2 style={{fontSize:24,fontWeight:800,letterSpacing:".06em",color:"#fff",textShadow:"0 0 20px rgba(192,24,80,.25)",textTransform:"uppercase",margin:0}}>
      Buried under{" "}
      <span style={{textDecoration:"line-through",opacity:.5,display:"inline"}}>
        <span style={{color:"#c01850"}}>d</span>
        <span style={{display:"inline",color:"#c01850",textShadow:ig?"2px 0 #0088a0,-2px 0 #c01850":"none",transition:"text-shadow .05s"}}>{gt}</span>
        <span style={{color:"#c01850"}}>s</span>
      </span>{" "}
      <span style={{color:"#c01850"}}>tasks</span>
    </h2>
  );
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
  const [msg, sMsg] = useState("Throw claws at monkeys during reload. Grab the golden claw for a super strike!");
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
    sMsg("Throw claws at monkeys during reload. Grab the golden claw for a super strike!");
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
        lm="⚡ Golden claw appeared! Step on it!";
      }

      if(lsc&&lsc.active){
        const dx=(cp.x+PW/2)-(lsc.x+SS/2),dy=(cp.y+PH)-(lsc.y+SS/2);
        if(Math.sqrt(dx*dx+dy*dy)<PW*.7){
          const kc=ce.length;lk+=kc;if(lk>=WK){lk=WK;lg="won";}
          const cx=lsc.x+SS/2,cy=lsc.y+SS/2;
          for(let i=0;i<EXC;i++)lex.push(mkEx(cx,cy,i,EXC));
          ce.forEach(e=>{for(let i=0;i<6;i++)lex.push(mkEx(e.x+EW/2,e.y+EH/2,i,6));});
          ce=[];cb=cb.filter(b=>b.kind!=="enemy");lsc=null;lgl=GD;
          lm=lg==="won"?"Congratulations! You won the prize — 15% off.":"💥 SUPER CLAW! Destroyed "+kc+" monkeys!";
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
          if(ll<=0){ll=0;lg="lost";lm="open//neo is down. The monkeys won.";}
          else{lm="Hit! Dodge and throw claws during reload windows.";}continue;
        }
        if(m.kind==="claw"){let hi=-1;
          for(let i=0;i<ce.length;i++){const e=ce[i];
            if(e.phase==="reloading"&&m.x>e.x-10&&m.x<e.x+EW+10&&m.y>e.y&&m.y<e.y+EH){hi=i;break;}}
          if(hi!==-1){ce.splice(hi,1);lk+=1;
            if(lk>=WK){lk=WK;lg="won";lm="Congratulations! You won the prize — 15% off.";}
            else{lm="Direct hit! Keep going — target is 15 monkeys.";}continue;}}
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
  const F = "'Share Tech Mono','Courier New',monospace";

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e0e0e0",padding:16,fontFamily:F,position:"relative"}}>
      {/* Scanlines */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:50,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px)"}}/>

      <div style={{maxWidth:1100,margin:"0 auto"}}>
        {/* Header */}
        <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:16}}>
          <div>
            <div style={{fontSize:11,letterSpacing:".25em",color:"#0088a0",textTransform:"uppercase",marginBottom:6}}>// open//neo vs monkey work</div>
            <h1 style={{fontSize:32,fontWeight:800,letterSpacing:".04em",color:"#fff",margin:0}}>
              Destroy the <span style={{color:"#c01850"}}>monkey work</span>
            </h1>
            <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:6,letterSpacing:".03em"}}>
              Kill task monkeys during reload. Grab the golden claw for a super strike.
            </p>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["← → move","↑/Space jump","Enter/F claw","R restart"].map(t=>(
              <span key={t} style={{padding:"5px 12px",fontSize:11,letterSpacing:".1em",border:"1px solid rgba(0,136,160,.25)",borderRadius:4,background:"rgba(0,136,160,.06)",color:"#0088a0"}}>{t}</span>))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:16}}>
          {/* Arena */}
          <div style={{border:"1px solid rgba(192,24,80,.15)",borderRadius:12,background:"rgba(0,0,0,.3)",padding:10,overflow:"hidden"}}>
            <div className="relative" style={{
              width:"100%",height:H,borderRadius:8,overflow:"hidden",position:"relative",
              background:"linear-gradient(180deg,#0a0a0f 0%,#0e0e16 60%,#141420 100%)",
              border:"1px solid rgba(0,136,160,.1)",
              transform:`translate(${sh.x}px,${sh.y}px)`,transition:ga?"none":"transform .1s ease-out"}}>
              {/* Grid */}
              <div style={{position:"absolute",inset:0,opacity:.06,backgroundImage:"linear-gradient(rgba(0,136,160,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,136,160,.3) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
              {/* Glitch overlays */}
              {ga&&<><div style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",background:`rgba(192,24,80,${.1*gi})`,transform:`translateX(${Math.round((Math.random()-.5)*10*gi)}px)`,mixBlendMode:"screen"}}/><div style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",background:`rgba(0,136,160,${.07*gi})`,transform:`translateX(${Math.round((Math.random()-.5)*8*gi)}px)`,mixBlendMode:"screen"}}/><div style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",background:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,${.18*gi}) 2px,rgba(0,0,0,${.18*gi}) 4px)`}}/>{gi>.8&&<div style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",background:`rgba(255,215,0,${.35*gi})`}}/>}</>}
              {/* Ground */}
              <div style={{position:"absolute",left:0,right:0,top:GY,height:H-GY,background:"linear-gradient(180deg,#16161e 0%,#0e0e14 100%)",borderTop:"1px solid rgba(0,136,160,.15)"}}/>

              {/* Super claw */}
              {sc&&sc.active&&(
                <div style={{position:"absolute",zIndex:10,left:sc.x,top:sc.y,width:SS,height:SS}}>
                  <div style={{position:"absolute",inset:-14,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,215,0,.3) 0%,rgba(255,215,0,.08) 50%,transparent 70%)",animation:"sPulse 1.2s ease-in-out infinite"}}/>
                  <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",width:4,height:100,bottom:0,background:"linear-gradient(180deg,transparent 0%,rgba(255,215,0,.12) 30%,rgba(255,215,0,.35) 100%)"}}/>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,userSelect:"none",filter:"brightness(1.3) saturate(1.5) sepia(.6) hue-rotate(-10deg) drop-shadow(0 0 10px rgba(255,215,0,.8))",animation:"sBob 1s ease-in-out infinite"}}>🦞</div>
                  <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap",fontSize:9,textTransform:"uppercase",letterSpacing:".25em",fontWeight:700,color:"#ffd700",textShadow:"0 0 8px rgba(255,215,0,.5)"}}>SUPER</div>
                </div>
              )}

              {/* Explosion claws */}
              {ex.map((c,i)=>(
                <div key={`ex${i}`} style={{position:"absolute",userSelect:"none",pointerEvents:"none",zIndex:20,
                  left:c.x-c.sz/2,top:c.y-c.sz/2,width:c.sz,height:c.sz,
                  opacity:Math.min(1,c.life*2.5),transform:`rotate(${c.rot}deg)`,
                  fontSize:c.sz*.8,lineHeight:`${c.sz}px`,textAlign:"center",
                  filter:`brightness(${1+c.life}) saturate(${1+c.life}) sepia(${c.life*.5}) hue-rotate(-10deg) drop-shadow(0 0 ${c.life*8}px rgba(255,215,0,${c.life}))`}}>🦞</div>
              ))}

              {/* Bullets */}
              {bu.map(b=>(
                <div key={b.id} style={{position:"absolute",left:b.x-(b.kind==="claw"?13:18),top:b.y-(b.kind==="claw"?13:10)}}>
                  {b.kind==="claw"?<span style={{fontSize:25,display:"inline-block",userSelect:"none",transform:`rotate(${b.rot}deg)`}}>🦞</span>
                  :<SpriteCanvas sprite={PP_SPRITE} palette={PP_PALETTE} ps={PPS} flipX={b.dir===-1} style={{position:"relative",zIndex:2}}/>}
                </div>
              ))}

              {/* Enemies */}
              {en.map(e=>{const v=e.phase==="reloading",fp=pl.x+PW/2>e.x+EW/2;return(
                <div key={e.id} style={{position:"absolute",left:e.x,top:e.y,width:EW,height:EH}}>
                  <div style={{position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap",fontSize:10,padding:"2px 8px",borderRadius:4,border:`1px solid ${v?"#0088a0":"#c01850"}`,background:"rgba(0,0,0,.85)",color:v?"#0088a0":"rgba(255,255,255,.6)",letterSpacing:".05em"}}>{e.name}</div>
                  <SpriteCanvas sprite={MONKEY_SPRITE} palette={MONKEY_PALETTE} ps={MPS} flipX={!fp} style={{position:"absolute",left:0,top:0,filter:v?"drop-shadow(0 0 6px rgba(0,136,160,.4))":"drop-shadow(0 0 4px rgba(192,24,80,.2))"}}/>
                  <div style={{position:"absolute",bottom:-16,left:"50%",transform:"translateX(-50%)",fontSize:9,textTransform:"uppercase",letterSpacing:".2em",whiteSpace:"nowrap",color:v?"#0088a0":"#c01850"}}>{v?"Reloading":"Firing"}</div>
                  {v&&<div style={{position:"absolute",inset:0,borderRadius:4,border:"1px solid rgba(0,136,160,.3)",boxShadow:"0 0 16px rgba(0,136,160,.12)"}}/>}
                </div>);})}

              {/* Player */}
              <div style={{position:"absolute",left:pl.x,top:pl.y,width:PW,height:PH,opacity:pl.inv>0?(Math.floor(Date.now()/100)%2?.35:1):1}}>
                <SpriteCanvas sprite={NEO_SPRITE} palette={NEO_PALETTE} ps={NPS} flipX={pl.f===-1} style={{position:"absolute",left:0,top:0,filter:"drop-shadow(0 0 6px rgba(192,24,80,.25))"}}/>
                {pl.at>0&&<span style={{position:"absolute",fontSize:18,userSelect:"none",top:36,[pl.f===1?"right":"left"]:-16}}>🦞</span>}
                <div style={{position:"absolute",bottom:-14,left:"50%",transform:"translateX(-50%)",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",whiteSpace:"nowrap",color:"#0088a0",textShadow:"0 0 8px rgba(0,136,160,.3)"}}>open//neo</div>
              </div>

              {/* Win / Lose overlays */}
              {(gs==="won"||gs==="lost")&&(
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,zIndex:40}}>
                  {gs==="won"?(
                    <div style={{width:"100%",maxWidth:420,padding:32,textAlign:"center",border:"1px solid rgba(0,136,160,.2)",borderRadius:12,background:"linear-gradient(180deg,rgba(0,136,160,.05) 0%,rgba(10,10,15,.95) 40%)"}}>
                      <div style={{fontSize:11,letterSpacing:".25em",color:"#0088a0",textTransform:"uppercase",marginBottom:12}}>// victory</div>
                      <div style={{fontSize:48}}>🎁</div>
                      <h2 style={{fontSize:28,fontWeight:800,color:"#fff",margin:"12px 0 8px",letterSpacing:".04em"}}>You <span style={{color:"#0088a0"}}>won</span></h2>
                      <p style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>open//neo destroyed 15 task monkeys.</p>
                      <div style={{fontSize:40,fontWeight:900,letterSpacing:".06em",color:"#0088a0",margin:"16px 0 8px",textShadow:"0 0 20px rgba(0,136,160,.3)"}}>15% OFF</div>
                      <div style={{fontSize:13,color:"rgba(255,255,255,.4)",letterSpacing:".1em"}}>Promo: OPENNEO15</div>
                      <button onClick={reset} style={{marginTop:20,padding:"12px 32px",fontSize:13,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#fff",background:"#0088a0",border:"none",borderRadius:8,cursor:"pointer",boxShadow:"0 0 24px rgba(0,136,160,.25)",fontFamily:F}}>Play again</button>
                    </div>
                  ):(
                    <div style={{width:"100%",maxWidth:480,padding:32,textAlign:"center",border:"1px solid rgba(192,24,80,.15)",borderRadius:12,background:"linear-gradient(180deg,rgba(192,24,80,.04) 0%,rgba(10,10,15,.95) 40%)"}}>
                      <div style={{fontSize:11,letterSpacing:".25em",color:"#0088a0",textTransform:"uppercase",marginBottom:12}}>// game over</div>
                      <GlitchTitle/>
                      {/* Pile */}
                      <div style={{position:"relative",width:340,height:300,margin:"16px auto 12px",overflow:"hidden"}}>
                        <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:330,height:50,background:"radial-gradient(ellipse at center,rgba(192,24,80,.12) 0%,transparent 70%)",borderRadius:"50%"}}/>
                        {PILE.map((p,i)=>(
                          <div key={i} style={{position:"absolute",left:p.x,top:p.y,transform:`rotate(${p.r}deg)`,zIndex:Math.floor(p.y/8),opacity:.92}}>
                            <SpriteCanvas sprite={PP_SPRITE} palette={PP_PALETTE} ps={p.s} flipX={!!p.f} style={{width:Math.ceil(18*p.s),height:Math.ceil(10*p.s)}}/>
                          </div>
                        ))}
                        <div style={{position:"absolute",left:"50%",top:10,transform:"translateX(-50%)",zIndex:200,filter:"drop-shadow(0 3px 8px rgba(0,0,0,.7))"}}>
                          <SpriteCanvas sprite={NEO_HEAD} palette={NEO_PALETTE} ps={4.2} style={{width:Math.ceil(26*4.2),height:Math.ceil(19*4.2)}}/>
                        </div>
                      </div>
                      <p style={{fontSize:14,color:"rgba(255,255,255,.5)",letterSpacing:".04em"}}>The monkey work won this round.</p>
                      <button onClick={reset} style={{marginTop:20,padding:"14px 36px",fontSize:13,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"#fff",background:"#c01850",border:"none",borderRadius:8,cursor:"pointer",boxShadow:"0 0 24px rgba(192,24,80,.25)",fontFamily:F}}>Try again</button>
                      <div style={{marginTop:14,fontSize:10,color:"rgba(255,255,255,.15)",letterSpacing:".2em",textTransform:"uppercase"}}>[ press R to restart ]</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Progress */}
            <div style={{border:"1px solid rgba(0,136,160,.15)",borderRadius:12,padding:16,background:"rgba(0,0,0,.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}>
                <span style={{color:"rgba(255,255,255,.4)",letterSpacing:".1em",textTransform:"uppercase"}}>Mission</span>
                <span style={{fontWeight:700}}>{kills}/{WK}</span>
              </div>
              <div style={{height:10,borderRadius:6,background:"rgba(0,0,0,.3)",overflow:"hidden",border:"1px solid rgba(0,136,160,.15)"}}>
                <div style={{height:"100%",borderRadius:6,transition:"width .3s",width:`${prog}%`,background:"linear-gradient(90deg,#c01850,#0088a0)"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12,textAlign:"center"}}>
                <div style={{borderRadius:8,border:"1px solid rgba(0,136,160,.1)",padding:8,background:"rgba(0,0,0,.2)"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".15em"}}>Kills</div>
                  <div style={{fontSize:20,fontWeight:700,marginTop:2}}>{kills}</div>
                </div>
                <div style={{borderRadius:8,border:"1px solid rgba(0,136,160,.1)",padding:8,background:"rgba(0,0,0,.2)"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".15em"}}>Lives</div>
                  <div style={{fontSize:18,fontWeight:700,marginTop:2,color:"#c01850"}}>{"♥".repeat(lives)}{"♡".repeat(ML-lives)}</div>
                </div>
                <div style={{borderRadius:8,border:"1px solid rgba(0,136,160,.1)",padding:8,background:"rgba(0,0,0,.2)"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".15em"}}>Status</div>
                  <div style={{fontSize:12,fontWeight:700,marginTop:4,color:gs==="playing"?"#0088a0":gs==="won"?"#0088a0":"#c01850"}}>{gs==="playing"?"Fighting":gs==="won"?"Victory":"Defeated"}</div>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div style={{border:"1px solid rgba(0,136,160,.15)",borderRadius:12,padding:16,background:"rgba(0,0,0,.2)"}}>
              <div style={{fontSize:11,letterSpacing:".2em",color:"#0088a0",textTransform:"uppercase",marginBottom:10}}>// Rules</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.8}}>
                <p>1. Monkeys shoot at open//neo</p>
                <p>2. Kill them only during <span style={{color:"#0088a0"}}>Reload</span></p>
                <p>3. You have 3 lives</p>
                <p>4. Kill 15 monkeys to win</p>
                <p>5. <span style={{color:"#ffd700"}}>Golden claw</span> = kill all</p>
              </div>
            </div>

            {/* Hint */}
            <div style={{border:"1px solid rgba(192,24,80,.1)",borderRadius:12,padding:16,background:"rgba(0,0,0,.2)"}}>
              <div style={{fontSize:11,letterSpacing:".2em",color:"#c01850",textTransform:"uppercase",marginBottom:8}}>// Hint</div>
              <p style={{fontSize:12,color:"rgba(255,255,255,.35)",lineHeight:1.6}}>{msg}</p>
            </div>

            {/* Legend */}
            <div style={{border:"1px solid rgba(0,136,160,.1)",borderRadius:12,padding:16,background:"rgba(0,0,0,.2)"}}>
              <div style={{fontSize:11,letterSpacing:".2em",color:"#0088a0",textTransform:"uppercase",marginBottom:12}}>// Characters</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <SpriteCanvas sprite={NEO_SPRITE} palette={NEO_PALETTE} ps={1} style={{width:26,height:46}}/>
                <div><div style={{fontSize:12,fontWeight:700,color:"#0088a0"}}>open//neo</div><div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Hero. Throws claw 🦞</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <SpriteCanvas sprite={MONKEY_SPRITE} palette={MONKEY_PALETTE} ps={1} style={{width:28,height:28}}/>
                <div><div style={{fontSize:12,fontWeight:700,color:"#c01850"}}>Task Monkey</div><div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Enemy. Shoots tasks</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",filter:"sepia(.6) hue-rotate(-10deg) brightness(1.3) saturate(1.5)",fontSize:22}}>🦞</div>
                <div><div style={{fontSize:12,fontWeight:700,color:"#ffd700"}}>Golden Claw</div><div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Super strike. Kills all</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{marginTop:16,textAlign:"center",fontSize:10,color:"rgba(255,255,255,.1)",letterSpacing:".2em",textTransform:"uppercase"}}>
          [ open//neo vs monkey work · openclaw ]
        </div>
      </div>
      <style>{`@keyframes sPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.4);opacity:1}}@keyframes sBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>
    </div>
  );
}

export default function NeoClawMonkeyGame() { return <Game />; }
