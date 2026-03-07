import { useState, useEffect, useRef } from "react";

// Neo pixel art - redesigned for clear silhouette
// Taller proportions, straight long coat, visible sunglasses
// 26 wide x 46 tall

const PALETTE = {
  0: "transparent",
  1: "#111118",      // darkest - outlines, hair
  2: "#d4a574",      // skin
  3: "#b8895c",      // skin shadow
  4: "#8b1a4a",      // coat darkest
  5: "#c2255c",      // coat dark
  6: "#d63384",      // coat main
  7: "#e85daa",      // coat light
  8: "#f0a0cc",      // coat highlight
  9: "#22222e",      // pants/shirt dark
  10: "#3a3a4e",     // sunglasses frame
  11: "#1e90ff",     // sunglasses lens reflection
  12: "#0d0d14",     // shoes
  13: "#2a2a38",     // hair highlight
  14: "#181820",     // inner coat / shirt
};

const _ = 0;

const SPRITE = [
  // --- HAIR TOP (rows 0-4) ---
  [_,_,_,_,_,_,_,_,_,1,1,1,1,1,1,1,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,1,1,13,1,1,1,13,1,1,1,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,1,13,1,1,1,1,1,1,13,1,1,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,1,1,1,1,1,1,1,1,1,1,1,1,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,1,1,1,1,1,1,1,1,1,1,1,1,_,_,_,_,_,_],
  // --- FACE (rows 5-12) ---
  [_,_,_,_,_,_,1,1,2,2,2,2,2,2,2,2,2,2,1,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,2,2,2,2,2,2,2,2,1,_,_,_,_,_,_],
  // sunglasses row - key recognition feature
  [_,_,_,_,_,_,1,2,10,11,10,2,2,2,10,11,10,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,10,11,10,2,2,2,10,11,10,2,2,1,_,_,_,_,_,_],
  // nose, mouth
  [_,_,_,_,_,_,1,2,2,2,2,2,2,2,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,2,3,2,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,2,2,2,2,3,3,3,2,2,2,2,2,1,_,_,_,_,_,_],
  [_,_,_,_,_,_,1,1,2,2,2,2,2,2,2,2,2,2,1,1,_,_,_,_,_,_],
  // --- NECK (row 13) ---
  [_,_,_,_,_,_,_,_,1,2,2,2,2,2,2,2,2,1,_,_,_,_,_,_,_,_],
  // --- HIGH COLLAR (rows 14-16) - iconic Matrix collar ---
  [_,_,_,_,_,5,6,5,1,14,14,14,14,14,14,14,14,1,5,6,5,_,_,_,_,_],
  [_,_,_,_,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,_,_,_,_],
  [_,_,_,_,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,_,_,_,_],
  // --- SHOULDERS + UPPER COAT (rows 17-21) ---
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  // --- ARMS VISIBLE + MID COAT (rows 22-27) ---
  [_,_,_,4,5,6,8,6,2,14,14,14,14,14,14,14,14,2,6,8,6,5,4,_,_,_],
  [_,_,_,4,5,6,8,2,2,14,14,14,14,14,14,14,14,2,2,8,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,2,3,14,14,14,14,14,14,14,14,3,2,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,1,1,1,1,1,1,1,1,1,5,6,7,6,5,4,_,_],
  [_,_,_,4,5,6,7,6,5,14,14,14,14,14,14,14,14,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,14,9,9,9,9,9,9,14,5,6,7,6,5,4,_,_,_],
  // --- LOWER COAT - straight hang (rows 28-38) ---
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
  // --- COAT HEM + SHOES (rows 39-45) ---
  [_,_,_,4,5,6,7,6,5,1,1,1,_,9,9,_,1,5,6,7,6,5,4,_,_,_],
  [_,_,_,4,5,6,7,6,5,4,_,_,_,9,9,_,_,5,6,7,6,5,4,_,_,_],
  [_,_,_,_,4,5,6,5,4,_,_,_,_,1,1,_,_,_,4,5,6,5,4,_,_,_],
  [_,_,_,_,_,4,5,4,_,_,_,_,1,12,12,1,_,_,_,4,5,4,_,_,_,_],
  [_,_,_,_,_,_,4,_,_,_,_,1,12,12,12,12,1,_,_,_,4,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,1,12,12,12,12,1,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,1,1,1,1,1,1,1,_,_,_,_,_,_,_,_],
];

// Matrix rain
const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

function MatrixRain({ width, height }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -50);
    let animId;
    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = i % 9 === 0
          ? `rgba(214, 51, 132, ${0.3 + Math.random() * 0.4})`
          : `rgba(0, ${140 + Math.random() * 115}, 0, ${0.5 + Math.random() * 0.5})`;
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animId);
  }, [width, height]);
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.25 }} />;
}

function NeoSprite({ pixelSize, glitch }) {
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
    const ps = pixelSize;
    const w = 26;
    const h = SPRITE.length;
    canvas.width = w * ps;
    canvas.height = h * ps;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < h; y++) {
      const row = SPRITE[y];
      const rowShift = glitch && Math.random() > 0.96 ? Math.round((Math.random() - 0.5) * 6) : 0;
      for (let x = 0; x < row.length; x++) {
        const c = row[x];
        if (c === 0) continue;
        ctx.fillStyle = PALETTE[c];
        ctx.fillRect((x * ps) + gOff + rowShift, y * ps, ps, ps);
      }
    }
  }, [pixelSize, glitch, gOff]);

  return <canvas ref={canvasRef} style={{ imageRendering: "pixelated", position: "relative", zIndex: 2 }} />;
}

export default function PixelNeo() {
  const [glitch, setGlitch] = useState(true);
  const [scale, setScale] = useState(5);
  const [showQuote, setShowQuote] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const quotes = [
    "I know kung fu.",
    "There is no spoon.",
    "Free your mind.",
    "The Matrix has you.",
    "Follow the white rabbit.",
    "Wake up, Neo...",
    "Whoa.",
    "Dodge this.",
  ];

  return (
    <div style={{
      background: "#050508", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden",
    }}>
      <MatrixRain width={900} height={1000} />

      <div style={{
        position: "relative", zIndex: 3, color: "#d63384",
        fontSize: "12px", letterSpacing: "8px", textTransform: "uppercase",
        marginBottom: "8px", textShadow: "0 0 20px #d6338466",
      }}>
        ▸ THE MATRIX ◂
      </div>

      <div style={{
        position: "relative", zIndex: 3, color: "#0f0",
        fontSize: "32px", fontWeight: "bold", letterSpacing: "14px",
        marginBottom: "24px", textShadow: "0 0 12px #0f0, 0 0 40px #0f066",
      }}>
        N E O
      </div>

      <div
        style={{
          position: "relative", zIndex: 2, cursor: "pointer",
          background: "radial-gradient(ellipse at center bottom, #d6338410 0%, transparent 60%)",
          padding: "16px 30px 24px",
        }}
        onClick={() => {
          setShowQuote(true);
          setQuoteIdx((p) => (p + 1) % quotes.length);
          setTimeout(() => setShowQuote(false), 2200);
        }}
      >
        <NeoSprite pixelSize={scale} glitch={glitch} />
        <div style={{
          position: "absolute", bottom: "12px", left: "50%",
          transform: "translateX(-50%)", width: "80px", height: "10px",
          background: "radial-gradient(ellipse, rgba(214,51,132,0.25) 0%, transparent 70%)",
          borderRadius: "50%", zIndex: 1,
        }} />
      </div>

      {showQuote && (
        <div style={{
          position: "relative", zIndex: 3, marginTop: "14px",
          padding: "6px 18px", background: "#0a0a12",
          border: "1px solid #d63384", borderRadius: "3px",
          color: "#0f0", fontSize: "13px",
          textShadow: "0 0 6px #0f066",
          animation: "fadeIn 0.3s ease",
        }}>
          {quotes[quoteIdx]}
        </div>
      )}

      <div style={{
        position: "relative", zIndex: 3, marginTop: "28px",
        display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <button
          onClick={() => setGlitch((g) => !g)}
          style={{
            background: glitch ? "#d63384" : "#161620",
            border: "1px solid #d63384",
            color: glitch ? "#fff" : "#d63384",
            padding: "7px 16px", borderRadius: "3px", cursor: "pointer",
            fontFamily: "'Courier New', monospace", fontSize: "11px",
            letterSpacing: "2px", textTransform: "uppercase",
          }}
        >
          {glitch ? "⚡ Glitch ON" : "⚡ Glitch OFF"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#444", fontSize: "11px", letterSpacing: "2px" }}>SCALE</span>
          {[3, 5, 7, 9].map((s) => (
            <button key={s} onClick={() => setScale(s)} style={{
              background: scale === s ? "#0f3" : "#161620",
              border: `1px solid ${scale === s ? "#0f3" : "#2a2a3a"}`,
              color: scale === s ? "#000" : "#0f3",
              width: "30px", height: "30px", borderRadius: "3px",
              cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: "11px",
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        position: "relative", zIndex: 3, marginTop: "20px",
        color: "#282830", fontSize: "10px", letterSpacing: "3px",
      }}>
        [ click neo for quotes ]
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
