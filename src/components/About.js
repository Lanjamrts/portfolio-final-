import { useEffect, useRef, useState } from "react";
import { OWNER, STATS } from "../data/portfolioData.js";

const css = `
  /* ── About ── */
  .about { position: relative; overflow: hidden; }

  .about__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 50% 60% at 90% 40%, rgba(123,47,247,0.07) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 10% 80%, rgba(0,245,212,0.04) 0%, transparent 60%);
  }

  .about__inner {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: start;
  }

  /* ── Heading ── */
  .about__heading-ghost {
    display: block;
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(52px, 6vw, 88px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.05);
    letter-spacing: -0.05em;
    line-height: 0.9;
    user-select: none;
    margin-bottom: -8px;
  }
  .about__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(34px, 4vw, 56px); line-height: 1.0;
    letter-spacing: -0.04em; color: var(--text-primary);
    margin-bottom: 28px;
  }

  /* ── About text ── */
  .about__text {
    font-size: 15px; line-height: 1.85;
    color: var(--text-secondary); margin-bottom: 44px;
    max-width: 480px;
  }

  /* ── Stat cards ── */
  .about__cards {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    margin-bottom: 40px;
  }
  .about__card {
    position: relative; overflow: hidden;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 24px 22px;
    transition: all 0.35s var(--ease-out);
    cursor: default;
  }
  .about__card-shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.35s;
    border-radius: 20px;
    pointer-events: none;
  }
  .about__card:hover { border-color: var(--border-glow); transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 48px rgba(0,0,0,0.4); }
  .about__card:hover .about__card-shimmer { opacity: 1; }
  .about__card-inner { position: relative; z-index: 1; }
  .about__card-icon { font-size: 26px; margin-bottom: 14px; display: block; }
  .about__card-value {
    font-family: var(--font-display); font-size: 36px; font-weight: 800;
    color: var(--text-primary); line-height: 1; letter-spacing: -0.03em;
    margin-bottom: 6px;
  }
  .about__card-suffix { color: var(--accent); }
  .about__card-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── Traits / Pills ── */
  .about__traits {
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .trait {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--silver-400);
    transition: all 0.3s var(--ease-spring);
    cursor: default;
    position: relative; overflow: hidden;
  }
  .trait::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.25s;
    border-radius: 100px;
  }
  .trait:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-3px) scale(1.06);
    box-shadow: 0 4px 16px rgba(0,245,212,0.15);
  }
  .trait:hover::before { opacity: 1; }

  /* ── Timeline ── */
  .about__timeline-label {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 32px;
    display: flex; align-items: center; gap: 12px;
  }
  .about__timeline-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--accent-dim), transparent);
  }

  .timeline { position: relative; }
  .timeline__track {
    position: absolute;
    left: 20px; top: 8px; bottom: 0; width: 1px;
    background: var(--bg-elevated); overflow: hidden;
  }
  .timeline__track-fill {
    position: absolute; top: 0; left: 0; width: 100%;
    background: linear-gradient(to bottom, var(--accent), var(--accent2), rgba(123,47,247,0.15));
    height: 0%; transition: height 1.4s var(--ease-out);
  }
  .timeline__track-fill.drawn { height: 100%; }

  .timeline__item {
    display: flex; gap: 28px; margin-bottom: 36px;
    position: relative;
    opacity: 0; transform: translateX(24px);
    transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
  }
  .timeline__item.ti-visible { opacity: 1; transform: translateX(0); }
  .timeline__item:last-child { margin-bottom: 0; }

  .timeline__dot {
    flex-shrink: 0;
    width: 40px; height: 40px; border-radius: 12px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; position: relative; z-index: 1;
    transition: all 0.35s var(--ease-spring);
  }
  .timeline__item:hover .timeline__dot {
    border-color: var(--accent); background: var(--accent-dim);
    transform: scale(1.12) rotate(6deg);
    box-shadow: 0 0 20px var(--accent-glow);
  }

  .timeline__content {
    flex: 1;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px 22px;
    transition: all 0.35s var(--ease-out);
    position: relative; overflow: hidden;
  }
  .timeline__content-glow {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), transparent 50%);
    opacity: 0; transition: opacity 0.35s;
    pointer-events: none; border-radius: 16px;
  }
  .timeline__item:hover .timeline__content {
    border-color: var(--border-glow);
    transform: translateX(8px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .timeline__item:hover .timeline__content-glow { opacity: 1; }

  .timeline__date {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .timeline__heading {
    font-family: var(--font-display); font-size: 16px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 4px; letter-spacing: -0.01em;
  }
  .timeline__sub  { font-size: 13px; color: var(--text-secondary); margin-bottom: 10px; }
  .timeline__desc { font-size: 13px; color: var(--text-muted); line-height: 1.7; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .about__inner { grid-template-columns: 1fr; gap: 56px; }
  }
  @media (max-width: 480px) {
    .about__cards { grid-template-columns: 1fr; }
  }
`;

const TIMELINE = [
  {
    icon: "🎓",
    date: "2023 — 2024",
    heading: "INSI Ambanidia",
    sub: "Parcours transversal — Développement web",
    desc: "Acquisition de compétences fondamentales et avancées en développement web : HTML/CSS, frameworks CSS (Bootstrap, Tailwind), algorithmes, langage C, PHP et Symfony.",
  },
  {
    icon: "⚡",
    date: "2024 — 2025",
    heading: "Génie Logiciel",
    sub: "INSI Ambanidia — Développement full-stack",
    desc: "Transition vers le parcours Génie Logiciel : développement avancé full-stack (MERN, MEVN, MEAN), projets académiques et personnels, apprentissage continu.",
  },
  {
    icon: "🚀",
    date: "2025 — Aujourd'hui",
    heading: "Perfectionnement",
    sub: "Projets académiques & personnels",
    desc: "Perfectionnement des technologies maîtrisées, gestion de projets complets, et exploration de nouvelles technologies (Flutter, NestJS, Docker, etc.).",
  },
];

const TRAITS = [
  "Curieux", "Motivé", "Créatif", "Rigoureux",
  "Team player", "Problem solver", "Autodidacte", "Detail-oriented",
];

/* Animated counter */
function AnimCounter({ target, duration = 1200, active }) {
  const ref = useRef(null);
  const ran  = useRef(false);
  useEffect(() => {
    if (!active || ran.current) return;
    const el = ref.current;
    if (!el) return;
    const n = parseFloat(target);
    if (isNaN(n)) { el.textContent = target; return; }
    ran.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(n * ease);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return <span ref={ref}>{active ? undefined : target}</span>;
}

export default function About() {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const itemRefs    = useRef([]);
  const [counters,  setCounters]  = useState(false);

  useEffect(() => {
    if (!document.getElementById("about-css")) {
      const s = document.createElement("style");
      s.id = "about-css"; s.textContent = css;
      document.head.appendChild(s);
    }

    /* Generic reveal */
    const revealObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-pop"
    ).forEach((el) => revealObs.observe(el));

    /* Timeline items */
    const timeObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("ti-visible"); }),
      { threshold: 0.2 }
    );
    itemRefs.current.forEach((el) => el && timeObs.observe(el));

    /* Timeline track draw */
    const trackObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && trackRef.current)
          trackRef.current.classList.add("drawn");
      }),
      { threshold: 0.15 }
    );
    if (sectionRef.current) trackObs.observe(sectionRef.current);

    /* Counter trigger */
    let counterDone = false;
    const cntObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting && !counterDone) {
          counterDone = true;
          setCounters(true);
        }
      }),
      { threshold: 0.3 }
    );
    if (sectionRef.current) cntObs.observe(sectionRef.current);

    return () => {
      revealObs.disconnect(); timeObs.disconnect();
      trackObs.disconnect();  cntObs.disconnect();
    };
  }, []);

  return (
    <section id="about" className="about section" ref={sectionRef}>
      <div className="about__bg" />
      <div className="container">

        <div className="reveal" style={{ marginBottom: 52 }}>
          <span className="section-label">01 / À propos</span>
        </div>

        <div className="about__inner">
          {/* ── LEFT ── */}
          <div>
            <div className="reveal-left">
              <span className="about__heading-ghost">About</span>
              <h2 className="about__heading">Qui suis&#8209;je&nbsp;?</h2>
            </div>

            <p className="about__text reveal" style={{ transitionDelay: "0.12s" }}>
              {OWNER.about}
            </p>

            {/* Stat cards */}
            <div className="about__cards">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className="about__card reveal-scale"
                  style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="about__card-shimmer" />
                  <div className="about__card-inner">
                    <span className="about__card-icon">{stat.icon}</span>
                    <div className="about__card-value">
                      <AnimCounter target={stat.value} active={counters} />
                      <span className="about__card-suffix">{stat.suffix}</span>
                    </div>
                    <div className="about__card-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div className="about__traits reveal" style={{ transitionDelay: "0.5s" }}>
              {TRAITS.map((t) => (
                <span key={t} className="trait">
                  <span style={{ position: "relative", zIndex: 1 }}>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Timeline ── */}
          <div className="reveal-right">
            <p className="about__timeline-label">Parcours</p>
            <div className="timeline">
              <div className="timeline__track">
                <div className="timeline__track-fill" ref={trackRef} />
              </div>
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="timeline__item"
                  ref={(el) => (itemRefs.current[i] = el)}
                  style={{ transitionDelay: `${0.15 + i * 0.18}s` }}
                >
                  <div className="timeline__dot">{item.icon}</div>
                  <div className="timeline__content">
                    <div className="timeline__content-glow" />
                    <div className="timeline__date">{item.date}</div>
                    <div className="timeline__heading">{item.heading}</div>
                    <div className="timeline__sub">{item.sub}</div>
                    <div className="timeline__desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}