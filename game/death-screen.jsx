import { useEffect, useRef, useState } from "react";

// Load Share Tech Mono font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap";
fontLink.rel = "stylesheet";
if (!document.querySelector('link[href*="Share+Tech+Mono"]')) document.head.appendChild(fontLink);

const _ = 0;

const NEO_PALETTE = {
  0: "transparent", 1: "#111118", 2: "#d4a574", 3: "#b8895c",
  4: "#8b1a4a", 5: "#c2255c", 6: "#d63384", 7: "#e85daa",
  8: "#f0a0cc", 9: "#22222e", 10: "#3a3a4e", 11: "#1e90ff",
  12: "#0d0d14", 13: "#2a2a38", 14: "#181820",
};

// Only head + collar (rows 0-18 of full sprite)
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

// Pyramid pile — like skull pile reference
// Dense, overlapping, wide base → narrow top, Neo sits on peak
const PILE = [
  // === GROUND / BASE — widest row (y 255-270) ===
  {x:-10,y:260,r:-8,s:2.8,f:0},{x:35,y:265,r:20,s:2.5,f:1},{x:78,y:258,r:-15,s:3,f:0},
  {x:122,y:263,r:12,s:2.6,f:1},{x:165,y:260,r:-5,s:2.9,f:0},{x:208,y:264,r:18,s:2.5,f:1},
  {x:248,y:258,r:-20,s:2.8,f:0},{x:288,y:262,r:10,s:2.7,f:1},{x:325,y:260,r:-12,s:2.5,f:0},
  // base fill — offset half-step
  {x:12,y:252,r:32,s:2.2,f:1},{x:56,y:248,r:-25,s:2.4,f:0},{x:100,y:252,r:15,s:2.3,f:1},
  {x:144,y:248,r:-18,s:2.5,f:0},{x:186,y:252,r:28,s:2.2,f:1},{x:228,y:248,r:-30,s:2.4,f:0},
  {x:268,y:252,r:12,s:2.3,f:1},{x:306,y:250,r:-22,s:2.2,f:0},
  // === ROW 2 (y ~225) ===
  {x:18,y:228,r:25,s:2.7,f:1},{x:62,y:222,r:-12,s:2.8,f:0},{x:108,y:228,r:8,s:2.5,f:1},
  {x:152,y:224,r:-22,s:2.7,f:0},{x:195,y:222,r:18,s:2.6,f:1},{x:238,y:226,r:-10,s:2.8,f:0},
  {x:278,y:224,r:15,s:2.5,f:1},
  // row 2 fill
  {x:40,y:218,r:-32,s:2,f:0},{x:130,y:216,r:28,s:2.1,f:1},{x:218,y:220,r:-18,s:2,f:0},
  {x:258,y:218,r:22,s:2.1,f:1},
  // === ROW 3 (y ~195) ===
  {x:42,y:198,r:-15,s:2.7,f:0},{x:88,y:194,r:22,s:2.5,f:1},{x:135,y:200,r:-8,s:2.8,f:0},
  {x:180,y:196,r:15,s:2.6,f:1},{x:224,y:198,r:-25,s:2.5,f:0},{x:264,y:195,r:10,s:2.4,f:1},
  // row 3 fill
  {x:65,y:190,r:30,s:2,f:1},{x:158,y:188,r:-26,s:2.1,f:0},{x:244,y:192,r:18,s:2,f:1},
  // === ROW 4 (y ~168) ===
  {x:68,y:170,r:12,s:2.6,f:0},{x:115,y:166,r:-20,s:2.7,f:1},{x:162,y:172,r:8,s:2.5,f:0},
  {x:208,y:168,r:-15,s:2.6,f:1},{x:248,y:170,r:22,s:2.3,f:0},
  // row 4 fill
  {x:92,y:162,r:-28,s:2,f:1},{x:185,y:160,r:25,s:2.1,f:0},
  // === ROW 5 (y ~140) — narrowing ===
  {x:92,y:142,r:-10,s:2.5,f:0},{x:140,y:138,r:18,s:2.6,f:1},{x:185,y:144,r:-22,s:2.4,f:0},
  {x:225,y:140,r:12,s:2.3,f:1},
  // row 5 fill
  {x:115,y:134,r:26,s:2,f:0},{x:205,y:132,r:-16,s:2.1,f:1},
  // === ROW 6 (y ~112) ===
  {x:112,y:115,r:15,s:2.4,f:1},{x:160,y:110,r:-12,s:2.5,f:0},{x:205,y:116,r:20,s:2.3,f:1},
  // row 6 fill
  {x:138,y:106,r:-24,s:2,f:0},{x:185,y:108,r:10,s:2,f:1},
  // === ROW 7 (y ~85) — under Neo ===
  {x:125,y:88,r:18,s:2.3,f:0},{x:168,y:84,r:-15,s:2.4,f:1},{x:208,y:90,r:8,s:2.2,f:0},
  // row 7 fill
  {x:148,y:80,r:-22,s:1.9,f:0},{x:190,y:78,r:14,s:1.9,f:1},
];

const GLITCH_CHARS = "@#$%&!?*<>~^{}|/\\";

function GlitchTitle() {
  const [glitchText, setGlitchText] = useState("ick");
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Periodically trigger glitch bursts
    const trigger = setInterval(() => {
      setIsGlitching(true);
      let flicks = 0;
      const iv = setInterval(() => {
        setGlitchText(
          "ick".split("").map(c =>
            Math.random() > 0.35 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
          ).join("")
        );
        flicks++;
        if (flicks > 6) {
          clearInterval(iv);
          setGlitchText("ick");
          setIsGlitching(false);
        }
      }, 60);
    }, 2200);
    return () => clearInterval(trigger);
  }, []);

  return (
    <h2 style={{
      fontSize: 28, fontWeight: 800, letterSpacing: "0.06em",
      color: "#ffffff", textShadow: "0 0 20px rgba(255,45,123,0.25)",
      fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      textTransform: "uppercase", margin: 0,
    }}>
      Buried under{" "}
      <span style={{ textDecoration: "line-through", opacity: 0.5, position: "relative", display: "inline" }}>
        <span style={{ color: "#ff2d7b" }}>d</span>
        <span style={{
          display: "inline",
          color: isGlitching ? "#ff2d7b" : "#ff2d7b",
          textShadow: isGlitching ? "2px 0 #00c8d4, -2px 0 #ff2d7b" : "none",
          transition: "text-shadow 0.05s",
        }}>{glitchText}</span>
        <span style={{ color: "#ff2d7b" }}>s</span>
      </span>{" "}
      <span style={{ color: "#ff2d7b" }}>tasks</span>
    </h2>
  );
}

export default function DeathScreen() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Share Tech Mono', 'Courier New', monospace", color: "#e0e0e0",
    }}>
      {/* Scan lines */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
      }} />

      <div style={{
        width: "100%", maxWidth: 520, padding: 40, textAlign: "center",
        border: "1px solid rgba(255,45,123,0.15)", borderRadius: 16,
        background: "linear-gradient(180deg, rgba(255,45,123,0.03) 0%, rgba(10,10,15,0.95) 40%)",
        position: "relative", zIndex: 5,
      }}>
        {/* Section label */}
        <div style={{
          fontSize: 11, letterSpacing: "0.25em", color: "#00c8d4", marginBottom: 16,
          textTransform: "uppercase",
        }}>
          // game over
        </div>

        <GlitchTitle />

        {/* Pile scene */}
        <div className="relative mx-auto" style={{ width: 340, height: 300, marginTop: 20, marginBottom: 16 }}>

          {/* Ground shadow */}
          <div className="absolute" style={{
            bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: 330, height: 50,
            background: "radial-gradient(ellipse at center, rgba(255,45,123,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />

          {/* Projectile pyramid */}
          {PILE.map((p, i) => (
            <div key={i} className="absolute" style={{
              left: p.x, top: p.y,
              transform: `rotate(${p.r}deg)`,
              zIndex: Math.floor(p.y / 8),
              opacity: 0.92,
            }}>
              <SpriteCanvas sprite={PP_SPRITE} palette={PP_PALETTE} ps={p.s} flipX={!!p.f}
                style={{ width: Math.ceil(18 * p.s), height: Math.ceil(10 * p.s) }} />
            </div>
          ))}

          {/* Neo head + collar sitting on top of pile */}
          <div className="absolute" style={{
            left: "50%", top: 10,
            transform: "translateX(-50%)",
            zIndex: 200,
            filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7))",
          }}>
            <SpriteCanvas sprite={NEO_HEAD} palette={NEO_PALETTE} ps={4.2}
              style={{
                width: Math.ceil(26 * 4.2),
                height: Math.ceil(19 * 4.2),
              }} />
          </div>
        </div>

        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em",
          lineHeight: 1.7, margin: 0,
        }}>
          The monkey work won this round.
        </p>

        <a href="#" onClick={(e) => { e.preventDefault(); }} style={{
          display: "inline-block", marginTop: 24,
          padding: "14px 36px", fontSize: 13,
          fontFamily: "'Share Tech Mono', 'Courier New', monospace",
          fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#ffffff", background: "#ff2d7b",
          border: "none", borderRadius: 8, cursor: "pointer",
          textDecoration: "none",
          boxShadow: "0 0 24px rgba(255,45,123,0.25)",
          transition: "all 0.2s ease",
        }}>
          Try again
        </a>

        <div style={{
          marginTop: 20, fontSize: 10, color: "rgba(255,255,255,0.15)",
          letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          [ press R to restart ]
        </div>
      </div>
    </div>
  );
}
