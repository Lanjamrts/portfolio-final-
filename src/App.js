import { useState, useEffect, useRef } from "react";
import Navbar   from "./components/Navbar.js";
import Hero     from "./components/Hero.js";
import About    from "./components/About.js";
import Skills   from "./components/Skills.js";
import Projects from "./components/Projects.js";
import Contact  from "./components/Contact.js";

// ─── Global CSS Variables & Reset ────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── Palette Aurora Noir ── */
    --bg-void:     #030305;
    --bg-deep:     #07070d;
    --bg-surface:  #0d0d18;
    --bg-elevated: #141425;
    --bg-card:     #1a1a30;

    --silver-100:  #eaeaf5;
    --silver-200:  #c8c8e0;
    --silver-400:  #8080aa;
    --silver-600:  #505078;
    --silver-800:  #252540;

    /* Aurora accent colors */
    --accent:      #00f5d4;
    --accent-dim:  rgba(0,245,212,0.1);
    --accent-glow: rgba(0,245,212,0.4);
    --accent2:     #7b2ff7;
    --accent2-dim: rgba(123,47,247,0.12);
    --accent2-glow:rgba(123,47,247,0.4);
    --accent3:     #ff6b6b;
    --gold:        #ffd100;

    --text-primary:   #f0f0fc;
    --text-secondary: #8080a8;
    --text-muted:     #404060;

    --border:      rgba(255,255,255,0.05);
    --border-glow: rgba(0,245,212,0.25);
    --border-violet: rgba(123,47,247,0.25);

    /* ── Typography ── */
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body:    'Plus Jakarta Sans', sans-serif;
    --font-mono:    'JetBrains Mono', monospace;

    /* ── Spacing ── */
    --section-py: clamp(80px, 10vw, 140px);
    --container:  min(1200px, 92vw);

    /* ── Transitions ── */
    --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out:  cubic-bezier(0.45, 0, 0.55, 1);
    --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-elastic: cubic-bezier(0.68, -0.3, 0.27, 1.3);
    --ease-bounce:  cubic-bezier(0.34, 1.8, 0.64, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg-void);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  ::selection { background: var(--accent-dim); color: var(--accent); }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg-void); }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--accent), var(--accent2));
    border-radius: 3px;
  }

  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }

  /* ── Utility classes ── */
  .container { width: var(--container); margin: 0 auto; }
  .section { padding: var(--section-py) 0; }

  .tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 100px;
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--silver-400);
  }

  .glass {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  /* ── Grain / Noise overlay ── */
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    opacity: 0.35;
  }

  /* ── Gradient mesh background (global) ── */
  body::after {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 0% 0%, rgba(0,245,212,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 60% at 100% 100%, rgba(123,47,247,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,245,212,0.02) 0%, transparent 60%);
    animation: bgPulse 12s ease-in-out infinite alternate;
  }
  @keyframes bgPulse {
    0%   { opacity: 0.7; transform: scale(1); }
    100% { opacity: 1;   transform: scale(1.05); }
  }

  /* ── Loader ── */
  .loader-wrap {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg-void);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 32px;
    transition: opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out);
  }
  .loader-wrap.exit {
    opacity: 0; pointer-events: none;
    transform: scale(1.1) translateY(-20px);
    filter: blur(12px);
  }

  .loader-logo-wrap {
    position: relative;
    display: flex; align-items: center; gap: 4px;
  }
  .loader-char {
    font-family: var(--font-display); font-size: clamp(36px, 6vw, 56px); font-weight: 800;
    letter-spacing: -0.03em; color: var(--text-primary);
    opacity: 0; transform: translateY(30px);
    animation: charReveal 0.5s var(--ease-spring) forwards;
  }
  .loader-char:nth-child(1) { animation-delay: 0.0s; }
  .loader-char:nth-child(2) { animation-delay: 0.07s; }
  .loader-char:nth-child(3) { animation-delay: 0.14s; }
  .loader-char:nth-child(4) { animation-delay: 0.21s; color: var(--accent); }
  .loader-char:nth-child(5) { animation-delay: 0.28s; }
  .loader-char:nth-child(6) { animation-delay: 0.35s; }
  .loader-char:nth-child(7) { animation-delay: 0.42s; }
  .loader-char:nth-child(8) { animation-delay: 0.49s; }
  .loader-char:nth-child(9) { animation-delay: 0.56s; }
  .loader-char:nth-child(10) { animation-delay: 0.63s; }
  @keyframes charReveal {
    to { opacity: 1; transform: translateY(0); }
  }

  .loader-line-wrap {
    width: 240px; height: 2px;
    background: var(--bg-elevated); border-radius: 2px; overflow: hidden;
    opacity: 0; animation: fadeIn 0.4s ease 0.6s forwards;
  }
  .loader-line-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent));
    background-size: 200% 100%;
    border-radius: 2px;
    animation: loadFill 1.4s var(--ease-out) 0.6s forwards, shimmer 2s linear infinite;
    width: 0;
  }
  @keyframes loadFill { from { width: 0; } to { width: 100%; } }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .loader-sub {
    font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
    letter-spacing: 0.25em; text-transform: uppercase;
    opacity: 0; animation: fadeIn 0.4s ease 0.8s forwards;
  }
  @keyframes fadeIn { to { opacity: 1; } }

  /* ── Custom Cursor ── */
  .cursor {
    position: fixed; pointer-events: none; z-index: 10000;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent);
    transform: translate(-50%, -50%);
    transition: width 0.2s var(--ease-spring), height 0.2s var(--ease-spring), opacity 0.2s;
    box-shadow: 0 0 10px var(--accent-glow);
  }
  .cursor-ring {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1.5px solid rgba(0,245,212,0.6);
    transform: translate(-50%, -50%);
    transition: all 0.12s var(--ease-out);
    position: absolute; top: 0; left: 0;
  }
  .cursor.hovering .cursor-dot  { width: 12px; height: 12px; opacity: 0.5; }
  .cursor.hovering .cursor-ring { width: 56px; height: 56px; border-color: var(--accent2); opacity: 0.8; }
  .cursor.clicking .cursor-ring { width: 28px; height: 28px; }

  /* ── Back to top ── */
  .back-top {
    position: fixed; bottom: 32px; right: 32px; z-index: 500;
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-200); font-size: 18px;
    transition: all 0.4s var(--ease-spring);
    opacity: 0; transform: translateY(24px) scale(0.8);
    overflow: hidden;
  }
  .back-top::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.3s;
  }
  .back-top.visible { opacity: 1; transform: translateY(0) scale(1); }
  .back-top:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 32px rgba(0,245,212,0.2), 0 0 0 1px var(--border-glow);
  }
  .back-top:hover::before { opacity: 1; }

  /* ── Scroll-reveal base ── */
  .reveal          { opacity: 0; transform: translateY(48px); transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
  .reveal.visible  { opacity: 1; transform: translateY(0); }
  .reveal-left     { opacity: 0; transform: translateX(-60px); transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
  .reveal-left.visible  { opacity: 1; transform: translateX(0); }
  .reveal-right    { opacity: 0; transform: translateX(60px); transition: opacity 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }
  .reveal-scale    { opacity: 0; transform: scale(0.85) translateY(20px); transition: opacity 0.9s var(--ease-spring), transform 0.9s var(--ease-spring); }
  .reveal-scale.visible { opacity: 1; transform: scale(1) translateY(0); }
  .reveal-blur     { opacity: 0; filter: blur(12px); transform: translateY(24px); transition: opacity 0.9s var(--ease-out), filter 0.9s var(--ease-out), transform 0.9s var(--ease-out); }
  .reveal-blur.visible  { opacity: 1; filter: blur(0); transform: translateY(0); }
  .reveal-pop      { opacity: 0; transform: scale(0.6) translateY(20px); transition: opacity 0.6s var(--ease-bounce), transform 0.6s var(--ease-bounce); }
  .reveal-pop.visible   { opacity: 1; transform: scale(1) translateY(0); }

  /* ── Section label ── */
  .section-label {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 20px;
  }
  .section-label::before {
    content: ''; display: block;
    width: 32px; height: 1px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }

  /* ── Section divider ── */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-glow), transparent);
    opacity: 0.4;
    margin: 0 auto;
    width: min(90vw, 900px);
  }

  /* ── Gradient text ── */
  .gradient-text {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Glow text ── */
  .glow-text {
    text-shadow: 0 0 30px var(--accent-glow), 0 0 60px var(--accent-glow);
  }

  /* ── Premium button styles ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 32px; border-radius: 14px;
    background: linear-gradient(135deg, var(--accent) 0%, #00c9a7 100%);
    color: var(--bg-void); font-family: var(--font-mono);
    font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    transition: all 0.3s var(--ease-out);
    position: relative; overflow: hidden;
    box-shadow: 0 0 0 0 var(--accent-glow);
  }
  .btn-primary::before {
    content: ''; position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.5s;
  }
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,245,212,0.4), 0 0 0 1px rgba(0,245,212,0.5);
  }
  .btn-primary:hover::before { left: 100%; }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 32px; border-radius: 14px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-primary); font-family: var(--font-mono);
    font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
    transition: all 0.3s var(--ease-out);
    position: relative; overflow: hidden;
  }
  .btn-secondary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-secondary:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .btn-secondary:hover::before { opacity: 1; }

  /* ── Hover lift ── */
  .hover-lift {
    transition: transform 0.35s var(--ease-out), box-shadow 0.35s var(--ease-out);
  }
  .hover-lift:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.5);
  }

  @media (max-width: 768px) {
    .back-top { bottom: 20px; right: 20px; }
    .cursor { display: none; }
  }
`;

// ─── Inject CSS ───────────────────────────────────────────────────────────────
if (!document.getElementById("portfolio-global-css")) {
  const style = document.createElement("style");
  style.id = "portfolio-global-css";
  style.textContent = globalCSS;
  document.head.appendChild(style);
}

// ─── Loader ───────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [exit, setExit] = useState(false);
  const name = "Lanja.dev";

  useEffect(() => {
    const t = setTimeout(() => {
      setExit(true);
      setTimeout(onDone, 900);
    }, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`loader-wrap${exit ? " exit" : ""}`}>
      <div className="loader-logo-wrap">
        {name.split("").map((ch, i) => (
          <span key={i} className="loader-char">{ch}</span>
        ))}
      </div>
      <div className="loader-line-wrap">
        <div className="loader-line-fill" />
      </div>
      <div className="loader-sub">initialisation en cours</div>
    </div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function Cursor() {
  const posRef  = useRef({ x: -200, y: -200 });
  const ringRef = useRef({ x: -200, y: -200 });
  const [state, setState] = useState({ x: -200, y: -200, ringX: -200, ringY: -200, hovering: false, clicking: false });
  const hoverRef   = useRef(false);
  const clickRef   = useRef(false);

  useEffect(() => {
    let raf;
    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      hoverRef.current = !!e.target.closest('a, button, [data-hover], input, textarea, select');
    };
    const onDown = () => { clickRef.current = true; };
    const onUp   = () => { clickRef.current = false; };

    const animate = () => {
      const r = ringRef.current;
      const p = posRef.current;
      r.x += (p.x - r.x) * 0.1;
      r.y += (p.y - r.y) * 0.1;
      setState({ x: p.x, y: p.y, ringX: r.x, ringY: r.y, hovering: hoverRef.current, clicking: clickRef.current });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cls = `cursor${state.hovering ? " hovering" : ""}${state.clicking ? " clicking" : ""}`;
  return (
    <div className={cls} style={{ left: state.x, top: state.y }}>
      <div className="cursor-dot" />
      <div className="cursor-ring" style={{ left: state.ringX - state.x, top: state.ringY - state.y }} />
    </div>
  );
}

// ─── Back To Top ──────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      className={`back-top${visible ? " visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Haut de page"
      data-hover
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Cursor />
      <BackToTop />
      {loaded && (
        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar />
          <main>
            <Hero />
            <div className="section-divider" />
            <About />
            <div className="section-divider" />
            <Skills />
            <div className="section-divider" />
            <Projects />
            <div className="section-divider" />
            <Contact />
          </main>
        </div>
      )}
    </>
  );
}