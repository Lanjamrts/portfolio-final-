import { useState, useEffect, useRef } from "react";
import { OWNER } from "../data/portfolioData.js";

const css = `
  /* ── Hero wrapper ── */
  .hero {
    position: relative; overflow: hidden;
    min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    padding-top: 90px;
  }

  /* ── Animated grid background ── */
  .hero__grid {
    position: absolute; inset: 0; z-index: 0; overflow: hidden;
    background:
      linear-gradient(rgba(79,195,247,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79,195,247,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  /* ── Glowing orbs ── */
  .hero__orb {
    position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none;
  }
  .hero__orb--1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(79,195,247,0.12) 0%, transparent 70%);
    top: -100px; left: -150px;
    animation: orbFloat1 12s ease-in-out infinite;
  }
  .hero__orb--2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    animation: orbFloat2 15s ease-in-out infinite;
  }
  .hero__orb--3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(79,195,247,0.07) 0%, transparent 70%);
    top: 50%; right: 20%;
    animation: orbFloat3 9s ease-in-out infinite;
  }

  @keyframes orbFloat1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(60px, 40px) scale(1.1); }
  }
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-40px, -60px) scale(1.08); }
  }
  @keyframes orbFloat3 {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
  }

  /* ── Hero inner layout ── */
  .hero__inner {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center; gap: 48px;
  }

  .hero__content {
    container-type: inline-size;
    min-width: 0;
    max-width: 100%;
  }

  /* ── Status badge ── */
  .hero__badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 100px;
    background: rgba(79,195,247,0.08); border: 1px solid rgba(79,195,247,0.2);
    margin-bottom: 32px;
    animation: fadeDown 0.8s var(--ease-out) 0.1s both;
  }
  .hero__badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 8px #4ade80;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.85); }
  }
  .hero__badge span {
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
    color: var(--accent); text-transform: uppercase;
  }

  /* ── Titre principal (le plus visible) ── */
  .hero__headline {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(30px, 10.5cqi, 68px);
    line-height: 1.05; letter-spacing: -0.03em;
    color: var(--text-primary);
    margin-bottom: 14px;
    max-width: 100%;
    animation: slideUp 0.9s var(--ease-out) 0.2s both;
  }
  .hero__headline-accent { color: var(--accent); }

  /* ── Nom (plus petit que le titre) ── */
  .hero__name {
    font-family: var(--font-display); font-weight: 700;
    font-size: clamp(22px, 7cqi, 44px);
    line-height: 1.15; letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: 24px;
    max-width: 100%;
  }
  .hero__name-line {
    display: block;
    max-width: 100%;
    padding-bottom: 0.04em;
    animation: slideUp 0.9s var(--ease-out) both;
  }
  .hero__name-line:nth-child(1) { animation-delay: 0.35s; }
  .hero__name-line:nth-child(2) {
    animation-delay: 0.48s;
    font-size: clamp(18px, 5.5cqi, 36px);
    letter-spacing: 0;
    white-space: nowrap;
    color: var(--silver-400);
  }

  /* ── Bio ── */
  .hero__bio {
    font-size: clamp(15px, 1.6vw, 17px); line-height: 1.75;
    color: var(--text-secondary); max-width: 520px;
    margin-bottom: 44px;
    animation: fadeIn 0.8s var(--ease-out) 0.65s both;
  }

  /* ── CTA row ── */
  .hero__cta {
    display: flex; flex-wrap: wrap; align-items: center; gap: 16px;
    animation: fadeIn 0.8s var(--ease-out) 0.8s both;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--violet) 100%);
    color: var(--bg-void); font-family: var(--font-mono);
    font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.3s var(--ease-out);
    position: relative; overflow: hidden;
  }
  .btn-primary::after {
    content: ""; position: absolute; inset: 0;
    background: rgba(255,255,255,0.15);
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(79,195,247,0.35); }
  .btn-primary:hover::after { opacity: 1; }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 12px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--text-primary); font-family: var(--font-mono);
    font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.3s var(--ease-out);
  }
  .btn-secondary:hover { border-color: var(--border-glow); background: var(--accent-dim); color: var(--accent); transform: translateY(-2px); }

  /* ── Social pills ── */
  .hero__socials {
    display: flex; gap: 10px; margin-top: 28px;
    animation: fadeIn 0.8s var(--ease-out) 0.95s both;
  }
  .hero__social {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    transition: all 0.25s var(--ease-out);
  }
  .hero__social:hover {
    border-color: var(--border-glow); background: var(--accent-dim);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 24px rgba(79,195,247,0.2);
  }

  /* ── Profile photo column ── */
  .hero__photo-wrap {
    position: relative;
    animation: fadeIn 0.9s var(--ease-out) 0.5s both;
    flex-shrink: 0;
  }
  .hero__photo-frame {
    position: relative; width: 300px; height: 360px;
  }
  .hero__photo-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center 18%;
    border-radius: 20px;
    border: 1px solid var(--border);
    filter: grayscale(20%);
    transition: filter 0.4s;
    display: block;
  }
  .hero__photo-img:hover { filter: grayscale(0%); }

  /* Placeholder quand pas de photo */
  .hero__photo-placeholder {
    width: 100%; height: 100%;
    border-radius: 20px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
  }
  .hero__photo-placeholder-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--accent-dim); border: 1px solid var(--border-glow);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }
  .hero__photo-placeholder p {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--text-muted); text-align: center; letter-spacing: 0.1em;
    padding: 0 20px;
  }

  /* Corner accents */
  .hero__photo-frame::before,
  .hero__photo-frame::after {
    content: ""; position: absolute;
    width: 20px; height: 20px;
    border-color: var(--accent); border-style: solid;
    z-index: 2;
  }
  .hero__photo-frame::before {
    top: -8px; left: -8px;
    border-width: 2px 0 0 2px;
    border-radius: 4px 0 0 0;
  }
  .hero__photo-frame::after {
    bottom: -8px; right: -8px;
    border-width: 0 2px 2px 0;
    border-radius: 0 0 4px 0;
  }
  .hero__photo-glow {
    position: absolute; inset: -20px; z-index: -1;
    background: radial-gradient(circle, rgba(79,195,247,0.15) 0%, transparent 70%);
    filter: blur(20px);
    animation: photoGlow 4s ease-in-out infinite;
  }
  @keyframes photoGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  /* Photo upload hint */
  .hero__photo-hint {
    position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%);
    white-space: nowrap;
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  /* ── Scroll cue ── */
  .hero__scroll {
    position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    animation: fadeIn 1s var(--ease-out) 1.2s both;
    cursor: pointer;
  }
  .hero__scroll span {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .hero__scroll-line {
    width: 1px; height: 44px;
    background: linear-gradient(to bottom, var(--accent), transparent);
    animation: scrollLine 2s ease-in-out infinite;
  }
  @keyframes scrollLine {
    0%, 100% { opacity: 1; transform: scaleY(1) translateY(0); }
    50% { opacity: 0.4; transform: scaleY(0.6) translateY(8px); }
  }

  /* ── Canvas particles ── */
  .hero__canvas {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
  }

  /* ── Animations ── */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(60px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .hero__inner {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .hero__photo-wrap {
      justify-self: center;
      order: -1;
    }
    .hero__headline { font-size: clamp(28px, 7.5vw, 52px); }
    .hero__name { font-size: clamp(22px, 6vw, 38px); }
    .hero__name-line:nth-child(2) { font-size: clamp(18px, 5vw, 30px); }
  }
  @media (max-width: 480px) {
    .hero__cta { flex-direction: column; align-items: flex-start; }
    .hero__headline { font-size: clamp(24px, 7vw, 38px); }
    .hero__name { font-size: clamp(20px, 6.5vw, 32px); }
    .hero__name-line:nth-child(2) { font-size: clamp(17px, 5.5vw, 26px); }
  }
`;

// Particle canvas
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles, raf;

    const init = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.4 + 0.1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,195,247,${p.a})`;
        ctx.fill();
      });

      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79,195,247,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    const obs = new ResizeObserver(init);
    obs.observe(canvas);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="hero__canvas" />;
}

export default function Hero() {
  useEffect(() => {
    if (!document.getElementById("hero-css")) {
      const s = document.createElement("style");
      s.id = "hero-css"; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const hasPhoto = !!OWNER.avatar;

  return (
    <section id="hero" className="hero section">
      {/* Background layers */}
      <div className="hero__grid" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />
      <ParticleCanvas />

      <div className="container hero__inner">
        {/* ── Left: text content ── */}
        <div className="hero__content">
          <div className="hero__badge">
            <div className="hero__badge-dot" />
            <span>Disponible pour des opportunités</span>
          </div>

          <h1 className="hero__headline">
            {OWNER.title.replace(/\s*Full-Stack\s*$/i, "")}{" "}
            <span className="hero__headline-accent">Full-Stack</span>
          </h1>

          <p className="hero__name">
            <span className="hero__name-line">{OWNER.firstName}</span>
            <span className="hero__name-line">{OWNER.lastName}</span>
          </p>

          <p className="hero__bio">{OWNER.bio}</p>

          <div className="hero__cta">
            <button
              className="btn-primary"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              data-hover
            >
              Voir mes projets →
            </button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-hover
            >
              Me contacter
            </button>
          </div>

          <div className="hero__socials">
            {OWNER.socials.github && (
              <a href={OWNER.socials.github} target="_blank" rel="noreferrer" className="hero__social" data-hover title="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            )}
            {OWNER.socials.linkedin && (
              <a href={OWNER.socials.linkedin} target="_blank" rel="noreferrer" className="hero__social" data-hover title="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {OWNER.socials.facebook && (
              <a href={OWNER.socials.facebook} target="_blank" rel="noreferrer" className="hero__social" data-hover title="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* ── Right: profile photo ── */}
        <div className="hero__photo-wrap">
          <div className="hero__photo-frame">
            <div className="hero__photo-glow" />
            {hasPhoto ? (
              <img src={OWNER.avatar} alt={OWNER.fullName} className="hero__photo-img" />
            ) : (
              <div className="hero__photo-placeholder">
                <div className="hero__photo-placeholder-icon">👤</div>
                <p>AJOUTE TA PHOTO<br/>dans portfolioData.js</p>
              </div>
            )}
          </div>
          {!hasPhoto && (
            <p className="hero__photo-hint">avatar: "/ta-photo.jpg"</p>
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero__scroll" onClick={scrollToAbout}>
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}