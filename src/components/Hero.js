import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext.js";
import { OWNER } from "../data/portfolioData.js";

const css = `
  /* ── Hero ── */
  .hero {
    position: relative; overflow: hidden;
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    padding-top: 100px;
  }

  /* ── Aurora background ── */
  .hero__aurora {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    overflow: hidden;
  }
  .hero__aurora-layer {
    position: absolute; border-radius: 50%; filter: blur(100px);
    animation: auroraFloat 10s ease-in-out infinite alternate;
  }
  .hero__aurora-layer--1 {
    width: 700px; height: 500px;
    background: radial-gradient(ellipse, rgba(0,245,212,0.09) 0%, transparent 70%);
    top: -150px; left: -200px;
    animation-duration: 12s;
  }
  .hero__aurora-layer--2 {
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(123,47,247,0.08) 0%, transparent 70%);
    bottom: -200px; right: -150px;
    animation-duration: 15s; animation-delay: -5s;
  }
  .hero__aurora-layer--3 {
    width: 400px; height: 400px;
    background: radial-gradient(ellipse, rgba(0,245,212,0.05) 0%, transparent 70%);
    top: 40%; right: 20%;
    animation-duration: 8s; animation-delay: -3s;
  }
  .hero__aurora-layer--4 {
    width: 300px; height: 300px;
    background: radial-gradient(ellipse, rgba(255,107,107,0.04) 0%, transparent 70%);
    top: 20%; left: 40%;
    animation-duration: 18s; animation-delay: -8s;
  }
  @keyframes auroraFloat {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, -40px) scale(1.1); }
  }

  /* Grid overlay */
  .hero__grid {
    position: absolute; inset: 0; z-index: 0;
    background:
      linear-gradient(rgba(0,245,212,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,212,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%);
    pointer-events: none;
  }

  /* Canvas */
  .hero__canvas {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
  }

  /* Inner layout */
  .hero__inner {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center; gap: 60px;
  }

  /* ── Badge ── */
  .hero__badge {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 7px 18px; border-radius: 100px;
    border: 1px solid rgba(0,245,212,0.25);
    background: rgba(0,245,212,0.06);
    margin-bottom: 36px;
    width: fit-content;
    animation: slideDown 0.7s var(--ease-out) 0.1s both;
    position: relative; overflow: hidden;
  }
  .hero__badge::before {
    content: ''; position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,245,212,0.12), transparent);
    animation: badgeShimmer 3s linear infinite;
  }
  @keyframes badgeShimmer { to { left: 100%; } }
  .hero__badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 10px rgba(74,222,128,0.8);
    animation: dotPulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes dotPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(74,222,128,0.8); }
    50%       { transform: scale(0.8); box-shadow: 0 0 4px rgba(74,222,128,0.4); }
  }
  .hero__badge-text {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.1em; color: var(--accent);
    text-transform: uppercase; white-space: nowrap;
  }

  /* ── Split-text headline ── */
  .hero__headline {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(36px, 6vw, 76px);
    line-height: 1.02; letter-spacing: -0.04em;
    color: var(--text-primary);
    margin-bottom: 12px;
    overflow: hidden;
  }
  .hero__headline-line {
    display: block; overflow: hidden;
  }
  .hero__headline-word {
    display: inline-block;
    animation: wordSlideUp 0.8s var(--ease-out) both;
  }
  .hero__headline-word--accent {
    background: linear-gradient(135deg, var(--accent) 0%, #00c9a7 50%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% auto;
    animation: wordSlideUp 0.8s var(--ease-out) both, gradientMove 4s linear infinite;
  }
  @keyframes wordSlideUp {
    from { opacity: 0; transform: translateY(110%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes gradientMove {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }

  /* ── Typewriter name ── */
  .hero__name-wrap {
    margin-bottom: 28px;
    animation: fadeIn 0.8s var(--ease-out) 0.7s both;
  }
  .hero__name {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(18px, 2.5vw, 28px);
    letter-spacing: -0.01em;
    color: var(--text-secondary);
  }
  .hero__name-typed {
    color: var(--text-primary);
    border-right: 2px solid var(--accent);
    padding-right: 2px;
    animation: blink 0.9s step-end infinite;
  }
  @keyframes blink { 50% { border-color: transparent; } }

  /* ── Bio ── */
  .hero__bio {
    font-size: clamp(15px, 1.5vw, 17px); line-height: 1.8;
    color: var(--text-secondary); max-width: 500px;
    margin-bottom: 48px;
    animation: fadeIn 0.8s var(--ease-out) 0.9s both;
  }

  /* ── CTA ── */
  .hero__cta {
    display: flex; flex-wrap: wrap; align-items: center; gap: 16px;
    margin-bottom: 40px;
    animation: fadeIn 0.8s var(--ease-out) 1.1s both;
  }

  /* ── Socials ── */
  .hero__socials {
    display: flex; gap: 12px;
    animation: fadeIn 0.8s var(--ease-out) 1.3s both;
  }
  .hero__social {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-400);
    transition: all 0.3s var(--ease-spring);
    position: relative; overflow: hidden;
  }
  .hero__social::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.3s;
  }
  .hero__social:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 24px rgba(0,245,212,0.2);
  }
  .hero__social:hover::before { opacity: 1; }
  .hero__social svg { position: relative; z-index: 1; }

  /* ── Photo column ── */
  .hero__photo-wrap {
    animation: fadeIn 0.9s var(--ease-out) 0.5s both;
    flex-shrink: 0; position: relative;
  }
  .hero__photo-ring {
    position: relative;
    width: 320px; height: 390px;
  }
  /* Rotating border */
  .hero__photo-ring::before {
    content: '';
    position: absolute; inset: -3px;
    border-radius: 28px;
    background: conic-gradient(
      from 0deg,
      var(--accent),
      var(--accent2),
      transparent 40%,
      transparent 60%,
      var(--accent2),
      var(--accent)
    );
    animation: rotateBorder 6s linear infinite;
    z-index: 0;
  }
  @keyframes rotateBorder {
    to { transform: rotate(360deg); }
  }
  .hero__photo-inner {
    position: relative; z-index: 1;
    width: 100%; height: 100%;
    border-radius: 26px; overflow: hidden;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
  }
  .hero__photo-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 15%;
    filter: grayscale(15%) contrast(1.05);
    transition: filter 0.5s, transform 0.6s var(--ease-out);
    display: block;
  }
  .hero__photo-img:hover { filter: grayscale(0%) contrast(1.1); transform: scale(1.03); }

  /* Glow behind photo */
  .hero__photo-glow {
    position: absolute; inset: -40px; z-index: -1;
    background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,245,212,0.12) 0%, transparent 70%);
    filter: blur(30px);
    animation: photoGlowPulse 5s ease-in-out infinite;
  }
  @keyframes photoGlowPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.08); }
  }

  /* Floating badges on photo */
  .hero__float-badge {
    position: absolute; z-index: 3;
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 12px;
    background: rgba(7,7,13,0.85);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.04em; color: var(--text-primary);
    white-space: nowrap;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .hero__float-badge--tl {
    top: -16px; left: -32px;
    animation: floatUp 4s ease-in-out infinite;
  }
  .hero__float-badge--br {
    bottom: -16px; right: -28px;
    animation: floatUp 4s ease-in-out infinite reverse;
    animation-delay: -2s;
  }
  .hero__float-badge-icon { font-size: 16px; }
  @keyframes floatUp {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  /* Placeholder photo */
  .hero__photo-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
  }
  .hero__photo-placeholder-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: var(--accent-dim); border: 2px solid var(--border-glow);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
  }
  .hero__photo-placeholder p {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--text-muted); text-align: center; letter-spacing: 0.1em;
  }

  /* ── Scroll cue ── */
  .hero__scroll {
    position: absolute; bottom: 40px; left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    animation: fadeIn 1s var(--ease-out) 1.6s both;
    cursor: pointer;
    z-index: 2;
  }
  .hero__scroll-text {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--text-muted);
  }
  .hero__scroll-mouse {
    width: 24px; height: 38px; border-radius: 12px;
    border: 1.5px solid var(--text-muted);
    display: flex; justify-content: center; padding-top: 6px;
  }
  .hero__scroll-wheel {
    width: 3px; height: 8px; border-radius: 2px;
    background: var(--accent);
    animation: scrollWheel 2s ease-in-out infinite;
  }
  @keyframes scrollWheel {
    0%   { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(12px); opacity: 0; }
  }

  /* ── Animations ── */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── CV Buttons (subtle) ── */
  .btn-cv-group {
    display: flex; gap: 8px;
  }
  .btn-cv {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 22px; border-radius: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.3s var(--ease-out);
    text-decoration: none;
    position: relative; overflow: hidden;
  }
  .btn-cv::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-cv:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }
  .btn-cv:hover::before { opacity: 1; }
  .btn-cv svg { transition: transform 0.3s var(--ease-spring); }
  .btn-cv:hover svg { transform: translateY(2px); }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hero__inner {
      grid-template-columns: 1fr;
      gap: 48px; text-align: left;
    }
    .hero__photo-wrap {
      justify-self: center; order: -1;
    }
    .hero__photo-ring { width: 280px; height: 340px; }
    .hero__float-badge--tl { top: -12px; left: -16px; }
    .hero__float-badge--br { bottom: -12px; right: -16px; }
  }
  @media (max-width: 768px) {
    .btn-cv-group { gap: 6px; }
    .btn-cv { padding: 10px 16px; font-size: 10px; }
  }
  @media (max-width: 600px) {
    .hero__photo-ring { width: 240px; height: 290px; }
    .hero__cta { flex-direction: column; align-items: flex-start; }
    .hero__float-badge { display: none; }
    .btn-cv-group { flex-direction: column; width: 100%; }
    .btn-cv { width: 100%; justify-content: center; padding: 12px 16px; font-size: 10px; }
  }
  @media (max-width: 400px) {
    .btn-cv { padding: 10px 14px; font-size: 9px; gap: 6px; }
    .btn-cv svg { width: 11px; height: 11px; }
  }
`;

/* ── Aurora Constellation Canvas ──────────────────────────────────────────── */
function StarCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, stars, raf;

    const COLORS = ["rgba(0,245,212,", "rgba(123,47,247,", "rgba(0,245,212,"];

    const init = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: 80 }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  Math.random() * 1.5 + 0.4,
        a:  Math.random() * 0.5 + 0.1,
        colorIdx: i % COLORS.length,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mp = mouseRef.current;

      stars.forEach((p) => {
        if (mp.x !== null) {
          const dx   = p.x - mp.x;
          const dy   = p.y - mp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const f = (180 - dist) / 180;
            p.vx += (dx / dist) * f * 0.8;
            p.vy += (dy / dist) * f * 0.8;
          }
        }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx;  p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.colorIdx] + p.a + ")";
        ctx.fill();
      });

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx   = stars[i].x - stars[j].x;
          const dy   = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = 0.06 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(0,245,212,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    const obs = new ResizeObserver(init);
    obs.observe(canvas);
    init(); draw();
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" />;
}

/* ── Typewriter hook ───────────────────────────────────────────────────────── */
function useTypewriter(words, speed = 100, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wIdx,    setWIdx]    = useState(0);
  const [cIdx,    setCIdx]    = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wIdx];
    let timeout;
    if (!deleting) {
      if (cIdx < word.length) {
        timeout = setTimeout(() => setCIdx(c => c + 1), speed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (cIdx > 0) {
        timeout = setTimeout(() => setCIdx(c => c - 1), speed / 2);
      } else {
        setDeleting(false);
        setWIdx(w => (w + 1) % words.length);
      }
    }
    setDisplay(word.slice(0, cIdx));
    return () => clearTimeout(timeout);
  }, [cIdx, deleting, wIdx, words, speed, pause]);

  return display;
}

export default function Hero() {
  const { lang, t } = useLanguage();
  const heroRef = useRef(null);

  const roles = useTypewriter(t("hero.roles"), 80, 2400);

  useEffect(() => {
    if (!document.getElementById("hero-css")) {
      const s = document.createElement("style");
      s.id = "hero-css"; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const p = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
      hero.querySelectorAll(".hero__aurora-layer").forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        el.style.transform = `translateY(${p * 60 * dir}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasPhoto = !!OWNER.avatar;

  const line1 = t("hero.headlineLine1");
  const line2 = t("hero.headlineLine2");

  return (
    <section id="hero" className="hero section" ref={heroRef}>
      <div className="hero__aurora">
        <div className="hero__aurora-layer hero__aurora-layer--1" />
        <div className="hero__aurora-layer hero__aurora-layer--2" />
        <div className="hero__aurora-layer hero__aurora-layer--3" />
        <div className="hero__aurora-layer hero__aurora-layer--4" />
      </div>
      <div className="hero__grid" />
      <StarCanvas />

      <div className="container hero__inner">
        <div className="hero__content">

          <div className="hero__badge">
            <div className="hero__badge-dot" />
            <span className="hero__badge-text">{t("hero.badge")}</span>
          </div>

          <h1 className="hero__headline">
            <span className="hero__headline-line">
              {line1.map((w, i) => (
                <span key={i} className="hero__headline-word" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  {w}
                </span>
              ))}
            </span>
            <span className="hero__headline-line">
              <span className="hero__headline-word hero__headline-word--accent" style={{ animationDelay: "0.4s" }}>
                {line2[0]}
              </span>
            </span>
          </h1>

          <div className="hero__name-wrap">
            <p className="hero__name">
              {OWNER.firstName} {OWNER.lastName} —{" "}
              <span className="hero__name-typed">{roles}</span>
            </p>
          </div>

          <p className="hero__bio">{lang === "en" ? OWNER.bioEn : OWNER.bio}</p>

          <div className="hero__cta">
            <button className="btn-primary" data-hover
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              {t("hero.viewProjects")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="btn-secondary" data-hover
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              {t("hero.contactMe")}
            </button>
            <div className="btn-cv-group">
              <a href="/ANDRIANJATOVO-Lanja-Mirantsoa.pdf" target="_blank" rel="noreferrer"
                className="btn-cv" data-hover>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {t("hero.viewCv")}
              </a>
              <a href="/ANDRIANJATOVO-Lanja-Mirantsoa.pdf" download="CV-Lanja-Mirantsoa.pdf"
                className="btn-cv" data-hover>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {t("hero.downloadCv")}
              </a>
            </div>
          </div>

          <div className="hero__socials">
            {OWNER.socials.github && (
              <a href={OWNER.socials.github} target="_blank" rel="noreferrer"
                className="hero__social" data-hover title="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            )}
            {OWNER.socials.linkedin && (
              <a href={OWNER.socials.linkedin} target="_blank" rel="noreferrer"
                className="hero__social" data-hover title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {OWNER.socials.facebook && (
              <a href={OWNER.socials.facebook} target="_blank" rel="noreferrer"
                className="hero__social" data-hover title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="hero__photo-wrap">
          <div className="hero__photo-ring">
            <div className="hero__photo-glow" />
            <div className="hero__photo-inner">
              {hasPhoto ? (
                <img src={OWNER.avatar} alt={OWNER.fullName} className="hero__photo-img" />
              ) : (
                <div className="hero__photo-placeholder">
                  <div className="hero__photo-placeholder-icon">👤</div>
                  <p>{t("hero.photoPlaceholder").split("\n").map((l, i) => <span key={i}>{i > 0 && <br/>}{l}</span>)}</p>
                </div>
              )}
            </div>

            <div className="hero__float-badge hero__float-badge--tl">
              <span className="hero__float-badge-icon">⚡</span>
              <span>{t("hero.floatBadge1")}</span>
            </div>
            <div className="hero__float-badge hero__float-badge--br">
              <span className="hero__float-badge-icon">🚀</span>
              <span>{t("hero.floatBadge2")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll"
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
        <span className="hero__scroll-text">{t("hero.scroll")}</span>
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
      </div>
    </section>
  );
}