import { useState, useEffect, useRef } from "react";

const PIXEL_SIZE = 5;

// Angry Monkey sprite - 24x28 pixel art
const PALETTE = {
  0: "transparent",
  1: "#1a1209",      // darkest outline
  2: "#5c3a1e",      // dark brown fur
  3: "#8b5e34",      // mid brown fur
  4: "#a67442",      // light brown fur
  5: "#e8c89a",      // face skin
  6: "#c9a472",      // face shadow
  7: "#cc1111",      // angry red eyes
  8: "#ffffff",      // eye whites
  9: "#3d2214",      // nose/mouth/brow
  10: "#d4956a",     // ear inner
  11: "#d4b896",     // belly
  12: "#6b3f20",     // tail
};

const _ = 0;

const MONKEY_SPRITE = [
  // 28px wide, tail grows from lower back and curls upward like a real monkey
  // Row 0-2: Top of head
  [_,_,_,_,_,_,_,_,_,1,1,1,1,1,1,1,1,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,1,2,3,3,3,3,3,3,2,1,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,3,4,4,3,3,4,4,3,2,1,_,_,_,_,_,_,_,_,_],
  // Row 3-6: Big round ears (no tail here now)
  [_,_,_,1,1,1,1,2,3,4,4,3,3,3,3,4,4,3,2,1,1,1,_,_,_,_,_,_],
  [_,_,1,10,10,10,1,3,3,3,3,3,3,3,3,3,3,3,1,10,10,10,1,_,_,_,_,_],
  [_,1,2,10,5,10,1,3,3,3,3,3,3,3,3,3,3,3,1,10,5,10,2,1,_,_,_,_],
  [_,_,1,10,10,10,1,3,3,3,3,3,3,3,3,3,3,3,1,10,10,10,1,_,_,_,_,_],
  // Row 7: Upper face
  [_,_,_,1,1,1,3,3,5,5,5,5,5,5,5,5,5,3,3,1,1,1,_,_,_,_,_,_],
  // Row 8: angry brow
  [_,_,_,_,_,1,3,5,9,9,5,5,5,5,5,9,9,5,3,1,_,_,_,_,_,_,_,_],
  // Row 9-10: red eyes
  [_,_,_,_,_,1,3,5,8,7,5,5,5,5,5,8,7,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,8,7,5,5,5,5,5,8,7,5,3,1,_,_,_,_,_,_,_,_],
  // Row 11-14: nose / mouth / chin
  [_,_,_,_,_,1,3,5,5,5,5,9,9,9,5,5,5,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,5,9,9,1,1,1,9,9,5,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,1,3,5,6,5,5,6,6,6,5,5,6,5,3,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,3,5,5,5,5,5,5,5,5,5,3,1,_,_,_,_,_,_,_,_,_],
  // Row 15: neck
  [_,_,_,_,_,_,_,1,1,3,3,3,3,3,3,3,1,1,_,_,_,_,_,_,_,_,_,_],
  // Row 16-20: body + arms (tail tip curls at top right)
  [_,_,_,_,1,1,1,2,3,3,11,11,11,11,11,3,3,2,1,1,1,_,_,_,_,1,12,1],
  [_,_,_,1,2,3,2,2,3,11,11,11,11,11,11,11,3,2,2,3,2,1,_,_,_,1,12,1],
  [_,_,1,2,3,4,3,2,3,11,11,11,11,11,11,11,3,2,3,4,3,2,1,_,1,12,1,_],
  [_,_,1,2,3,4,5,1,3,3,11,11,11,11,11,3,3,1,5,4,3,2,1,_,1,12,1,_],
  [_,_,_,1,2,3,5,1,2,3,3,3,3,3,3,3,3,2,1,5,3,2,1,1,12,1,_,_],
  // Row 21-22: lower body — tail exits from back
  [_,_,_,_,1,1,1,1,2,3,3,3,3,3,3,3,3,2,1,1,1,12,12,1,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,2,3,3,3,3,3,2,2,2,1,_,_,_,_,_,_,_,_,_],
  // Row 23-24: legs
  [_,_,_,_,_,_,_,1,2,2,3,1,1,3,3,2,2,2,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,2,2,1,_,_,1,2,2,2,1,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,3,1,1,_,_,1,1,3,3,1,_,_,_,_,_,_,_,_,_,_],
  // Row 26-27: feet
  [_,_,_,_,_,_,1,1,3,3,1,_,_,1,3,3,3,1,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,1,1,1,_,_,1,1,1,1,1,1,_,_,_,_,_,_,_,_,_],
];

// Pixel phallus projectile sprite - 18x10
const PP_PALETTE = {
  0: "transparent",
  1: "#f0c4c8",  // skin lightest / highlight
  2: "#e0a0a4",  // skin light
  3: "#c8787e",  // skin mid
  4: "#a05058",  // skin dark
  5: "#7a3840",  // outline / darkest
  6: "#d4909a",  // mid-light
};

const PP_SPRITE = [
  // balls at base, shaft, bulbous head with ridge
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

function drawSprite(canvas, sprite, palette, ps, glitchOffset = 0) {
  const w = sprite[0].length;
  const h = sprite.length;
  canvas.width = w * ps;
  canvas.height = h * ps;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < sprite[y].length; x++) {
      const c = sprite[y][x];
      if (c === 0) continue;
      ctx.fillStyle = palette[c];
      ctx.fillRect(Math.floor(x * ps + glitchOffset), y * ps, Math.ceil(ps), Math.ceil(ps));
    }
  }
}

function MonkeySprite({ scale = 1, glitch = false }) {
  const canvasRef = useRef(null);
  const [gOff, setGOff] = useState(0);

  useEffect(() => {
    if (!glitch) return;
    const iv = setInterval(() => {
      setGOff(Math.random() > 0.82 ? Math.round((Math.random() - 0.5) * 6) : 0);
    }, 80);
    return () => clearInterval(iv);
  }, [glitch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ps = PIXEL_SIZE * scale;
    drawSprite(canvas, MONKEY_SPRITE, PALETTE, ps, gOff);
  }, [scale, glitch, gOff]);

  // sprite is 28x28 with tail from lower back curling upward

  return <canvas ref={canvasRef} style={{ imageRendering: "pixelated", position: "relative", zIndex: 2 }} />;
}

function ProjectileSprite({ scale = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ps = PIXEL_SIZE * scale;
    drawSprite(canvas, PP_SPRITE, PP_PALETTE, ps);
  }, [scale]);

  return <canvas ref={canvasRef} style={{ imageRendering: "pixelated", position: "relative", zIndex: 2 }} />;
}

export default function PixelMonkeyShowcase() {
  const [glitch, setGlitch] = useState(false);
  const [scale, setScale] = useState(2);

  return (
    <div style={{
      background: "#0a0a0f",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      <div style={{
        position: "relative", zIndex: 3, color: "#dc2626",
        fontSize: "12px", letterSpacing: "8px", textTransform: "uppercase",
        marginBottom: "8px", textShadow: "0 0 16px #dc262644",
      }}>
        ▸ CLAW MONKEYS ◂
      </div>

      <div style={{
        position: "relative", zIndex: 3, color: "#f87171",
        fontSize: "28px", fontWeight: "bold", letterSpacing: "10px",
        marginBottom: "32px", textShadow: "0 0 10px #f8717144",
      }}>
        ANGRY ENEMY
      </div>

      {/* Main monkey */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
        marginBottom: "16px",
      }}>
        <div style={{ position: "relative" }}>
          <MonkeySprite scale={scale} glitch={glitch} />
          {/* Glow under monkey */}
          <div style={{
            position: "absolute", bottom: "-6px", left: "50%",
            transform: "translateX(-50%)", width: "80px", height: "10px",
            background: "radial-gradient(ellipse, rgba(220,38,38,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
        </div>

        {/* Task label */}
        <div style={{
          padding: "5px 14px", background: "#0a0a14",
          border: "1px solid #333", borderRadius: "20px",
          color: "#ccc", fontSize: "11px",
        }}>
          Разбор почты и inbox
        </div>
      </div>

      {/* Weapon preview */}
      <div style={{
        position: "relative", zIndex: 3,
        marginBottom: "32px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
      }}>
        <div style={{
          color: "#666", fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase",
        }}>projectile</div>

        <div style={{
          display: "flex", gap: "24px", alignItems: "center",
        }}>
          {/* Flying left */}
          <div style={{ transform: "scaleX(-1)" }}>
            <ProjectileSprite scale={scale} />
          </div>
          {/* Flying right */}
          <ProjectileSprite scale={scale} />
        </div>

        <div style={{
          color: "#555", fontSize: "10px", letterSpacing: "3px",
        }}>← direction →</div>
      </div>

      {/* In-game preview: monkey shooting */}
      <div style={{
        position: "relative", zIndex: 3,
        padding: "16px 24px",
        background: "#111116",
        border: "1px solid #222",
        borderRadius: "12px",
        marginBottom: "28px",
        display: "flex", alignItems: "center", gap: "16px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MonkeySprite scale={1} glitch={false} />
          <div style={{ color: "#f87171", fontSize: "9px", letterSpacing: "2px", marginTop: "4px" }}>СТРЕЛЯЕТ</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ color: "#444", fontSize: "20px" }}>→</div>
          <ProjectileSprite scale={1} />
          <div style={{ color: "#444", fontSize: "14px" }}>→</div>
          <ProjectileSprite scale={1} />
          <div style={{ color: "#444", fontSize: "14px" }}>→</div>
        </div>
        <div style={{ color: "#666", fontSize: "11px", maxWidth: "120px", lineHeight: "1.5" }}>
          летит в<br/>open//neo
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: "relative", zIndex: 3,
        display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <button
          onClick={() => setGlitch(g => !g)}
          style={{
            background: glitch ? "#dc2626" : "#161620",
            border: "1px solid #dc2626",
            color: glitch ? "#fff" : "#dc2626",
            padding: "7px 16px", borderRadius: "3px", cursor: "pointer",
            fontFamily: "'Courier New', monospace", fontSize: "11px",
            letterSpacing: "2px", textTransform: "uppercase",
          }}
        >
          {glitch ? "⚡ Glitch ON" : "⚡ Glitch OFF"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#444", fontSize: "11px", letterSpacing: "2px" }}>SCALE</span>
          {[1, 2, 3, 4].map(s => (
            <button key={s} onClick={() => setScale(s)} style={{
              background: scale === s ? "#f87171" : "#161620",
              border: `1px solid ${scale === s ? "#f87171" : "#2a2a3a"}`,
              color: scale === s ? "#000" : "#f87171",
              width: "30px", height: "30px", borderRadius: "3px",
              cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: "11px",
            }}>
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div style={{
        position: "relative", zIndex: 3, marginTop: "20px",
        color: "#222", fontSize: "10px", letterSpacing: "3px",
      }}>
        [ angry monkey + projectile for open//neo game ]
      </div>
    </div>
  );
}
