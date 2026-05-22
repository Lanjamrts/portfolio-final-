import { useState, useEffect } from "react";
import Navbar   from "./components/Navbar.js";
import Hero     from "./components/Hero.js";
import About    from "./components/About.js";
import Skills   from "./components/Skills.js";
import Projects from "./components/Projects.js";
import Contact  from "./components/Contact.js";

// ─── Global CSS Variables & Reset ────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* ── Palette ── */
    --bg-void:     #050507;
    --bg-deep:     #0a0a0f;
    --bg-surface:  #111118;
    --bg-elevated: #18181f;
    --bg-card:     #1e1e28;

    --silver-100:  #e8e8f0;
    --silver-200:  #c8c8d8;
    --silver-400:  #8888a0;
    --silver-600:  #555568;
    --silver-800:  #2a2a38;

    --accent:      #4fc3f7;
    --accent-dim:  rgba(79,195,247,0.15);
    --accent-glow: rgba(79,195,247,0.35);
    --violet:      #a78bfa;
    --violet-dim:  rgba(167,139,250,0.12);

    --text-primary:   #f0f0f8;
    --text-secondary: #9090a8;
    --text-muted:     #55556a;

    --border:      rgba(255,255,255,0.06);
    --border-glow: rgba(79,195,247,0.2);

    /* ── Typography ── */
    --font-display: 'Syne', sans-serif;
    --font-body:    'Inter', sans-serif;
    --font-mono:    'Space Mono', monospace;

    /* ── Spacing ── */
    --section-py: clamp(80px, 10vw, 140px);
    --container:  min(1200px, 92vw);

    /* ── Transitions ── */
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg-void);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection { background: var(--accent-dim); color: var(--accent); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-void); }
  ::-webkit-scrollbar-thumb { background: var(--silver-600); border-radius: 2px; }

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
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  /* ── Loader ── */
  .loader-wrap {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg-void);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 24px;
    transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
  }
  .loader-wrap.exit { opacity: 0; pointer-events: none; transform: scale(1.04); }

  .loader-logo {
    font-family: var(--font-display); font-size: clamp(28px, 5vw, 44px); font-weight: 800;
    letter-spacing: -0.02em; color: var(--text-primary);
  }
  .loader-logo span { color: var(--accent); }

  .loader-bar {
    width: 180px; height: 2px; background: var(--bg-elevated); border-radius: 2px; overflow: hidden;
  }
  .loader-bar-fill {
    height: 100%; background: linear-gradient(90deg, var(--accent), var(--violet));
    border-radius: 2px;
    animation: loadFill 1.8s var(--ease-out) forwards;
  }
  @keyframes loadFill { from { width: 0; } to { width: 100%; } }

  .loader-sub {
    font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.15em;
    animation: blink 1s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0.3; } }

  /* ── Cursor ── */
  .cursor {
    position: fixed; pointer-events: none; z-index: 10000;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, opacity 0.2s;
  }
  .cursor-ring {
    width: 36px; height: 36px; border-radius: 50%;
    border: 1px solid rgba(79,195,247,0.5);
    transform: translate(-50%, -50%);
    transition: all 0.15s var(--ease-out);
    position: absolute; top: 0; left: 0;
  }
  .cursor.hovering .cursor-dot { width: 16px; height: 16px; opacity: 0.7; }
  .cursor.hovering .cursor-ring { width: 52px; height: 52px; border-color: var(--violet); }

  /* ── Back to top ── */
  .back-top {
    position: fixed; bottom: 32px; right: 32px; z-index: 500;
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-200); font-size: 18px;
    transition: all 0.3s var(--ease-out);
    opacity: 0; transform: translateY(20px);
  }
  .back-top.visible { opacity: 1; transform: translateY(0); }
  .back-top:hover { background: var(--accent-dim); border-color: var(--border-glow); color: var(--accent); transform: translateY(-3px); }

  /* ── Scroll-reveal base ── */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out); }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }

  /* ── Noise overlay ── */
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
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

// ─── Loader Component ─────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setExit(true);
      setTimeout(onDone, 650);
    }, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`loader-wrap${exit ? " exit" : ""}`}>
      <div className="loader-logo">
        LA<span>.</span>
      </div>
      <div className="loader-bar">
        <div className="loader-bar-fill" />
      </div>
      <div className="loader-sub">INITIALISATION...</div>
    </div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let ringX = -100, ringY = -100;
    let raf;

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      setHovering(
        target.matches('a, button, [data-hover], input, textarea, select')
      );
    };

    const animate = () => {
      ringX += (pos.x - ringX) * 0.12;
      ringY += (pos.y - ringY) * 0.12;
      setRing({ x: ringX, y: ringY });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [pos.x, pos.y]);

  return (
    <div className={`cursor${hovering ? " hovering" : ""}`} style={{ left: pos.x, top: pos.y }}>
      <div className="cursor-dot" />
      <div className="cursor-ring" style={{ left: ring.x - pos.x, top: ring.y - pos.y }} />
    </div>
  );
}

// ─── Back To Top ──────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      className={`back-top${visible ? " visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
    >
      ↑
    </button>
  );
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ─── Section Label ────────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em",
        color: "var(--accent)", textTransform: "uppercase",
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "var(--border)", maxWidth: 80 }} />
    </div>
  );
}

// ─── Placeholder sections (à remplacer étape par étape) ──────────────────────

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
            {/* Les autres sections seront ajoutées étape par étape */}
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </div>
      )}
    </>
  );
}