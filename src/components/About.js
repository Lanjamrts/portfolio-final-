import { useEffect } from "react";
import { OWNER } from "../data/portfolioData.js";

const css = `
  /* ── About Section ── */
  .about { position: relative; overflow: hidden; }

  .about__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 50% at 80% 50%, rgba(167,139,250,0.06) 0%, transparent 70%);
  }

  .about__inner {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: start;
  }

  /* ── Left: text + stats cards ── */
  .about__left {}

  .about__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(32px, 4vw, 52px); line-height: 1.05;
    letter-spacing: -0.03em; color: var(--text-primary);
    margin-bottom: 24px;
  }
  .about__heading em {
    font-style: normal; color: transparent;
    -webkit-text-stroke: 1px var(--silver-400);
  }

  .about__text {
    font-size: 15px; line-height: 1.8;
    color: var(--text-secondary); margin-bottom: 40px;
  }

  /* Mini stat cards */
  .about__cards {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }
  .about__card {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px;
    transition: all 0.3s var(--ease-out);
    position: relative; overflow: hidden;
  }
  .about__card::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 16px;
  }
  .about__card:hover { border-color: var(--border-glow); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
  .about__card:hover::before { opacity: 1; }
  .about__card-icon { font-size: 22px; margin-bottom: 10px; }
  .about__card-value {
    font-family: var(--font-display); font-size: 28px; font-weight: 800;
    color: var(--text-primary); line-height: 1;
    margin-bottom: 4px;
  }
  .about__card-value span { color: var(--accent); }
  .about__card-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── Right: timeline ── */
  .about__right {}

  .about__timeline-title {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 28px;
  }

  .timeline { position: relative; }
  .timeline::before {
    content: ""; position: absolute;
    left: 15px; top: 6px; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, var(--accent), rgba(79,195,247,0.1));
  }

  .timeline__item {
    display: flex; gap: 24px; margin-bottom: 32px;
    position: relative;
    transition: all 0.3s;
  }
  .timeline__item:last-child { margin-bottom: 0; }

  .timeline__dot {
    flex-shrink: 0;
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--bg-elevated); border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; position: relative; z-index: 1;
    transition: all 0.3s;
  }
  .timeline__item:hover .timeline__dot {
    border-color: var(--accent); background: var(--accent-dim);
    box-shadow: 0 0 16px var(--accent-glow);
  }

  .timeline__content {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px 20px; flex: 1;
    transition: all 0.3s var(--ease-out);
  }
  .timeline__item:hover .timeline__content {
    border-color: var(--border-glow);
    transform: translateX(4px);
  }

  .timeline__date {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 6px;
  }
  .timeline__heading {
    font-family: var(--font-display); font-size: 15px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 4px;
  }
  .timeline__sub {
    font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;
  }
  .timeline__desc {
    font-size: 13px; color: var(--text-muted); line-height: 1.6;
  }

  /* ── Traits / badges ── */
  .about__traits {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-top: 32px;
  }
  .trait {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--silver-400);
    transition: all 0.25s;
  }
  .trait:hover { border-color: var(--border-glow); color: var(--accent); background: var(--accent-dim); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .about__inner { grid-template-columns: 1fr; gap: 48px; }
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
    desc: "Acquisition de compétences fondamentales et avancées en développement web : maîtrise de HTML et CSS, frameworks CSS (Bootstrap, Tailwind), initiation aux algorithmes et au langage C, ainsi qu'aux bases de PHP et au framework Symfony.",
  },
  {
    icon: "⚡",
    date: "2024 — 2025",
    heading: "Génie Logiciel",
    sub: "INSI Ambanidia — Développement full-stack",
    desc: "Transition vers le parcours Génie Logiciel : consolidation du développement avancé et initiation au full-stack via divers frameworks (MERN, MEVN, MEAN, etc.), réalisation de projets académiques et personnels, et démonstration d'une capacité d'apprentissage de nouvelles technologies.",
  },
  {
    icon: "🚀",
    date: "2025 — Aujourd'hui",
    heading: "Perfectionnement",
    sub: "Projets académiques & personnels",
    desc: "Perfectionnement des technologies maîtrisées à travers différents projets académiques et personnels, développement de la gestion du temps et poursuite de l'apprentissage de nouvelles technologies.",
  },
];

const TRAITS = [
  "Curieux", "Motivé", "Créatif", "Rigoureux",
  "Team player", "Problem solver", "Autodidacte", "Detail-oriented",
];

const CARDS = [
  { icon: "🏆", value: "15", suffix: "+", label: "Projets réalisés" },
  { icon: "⚡", value: "8", suffix: "", label: "Technologies" },
  { icon: "📅", value: "3", suffix: "+", label: "Années de passion" },
  { icon: "💡", value: "∞", suffix: "", label: "Idées à créer" },
];

export default function About() {
  useEffect(() => {
    if (!document.getElementById("about-css")) {
      const s = document.createElement("style");
      s.id = "about-css"; s.textContent = css;
      document.head.appendChild(s);
    }

    // Scroll reveal
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="about section">
      <div className="about__bg" />
      <div className="container">

        {/* Section label */}
        <div className="reveal" style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "var(--accent)", textTransform: "uppercase" }}>
              01 / À propos
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)", maxWidth: 80 }} />
          </div>
        </div>

        <div className="about__inner">

          {/* LEFT */}
          <div className="about__left">
            <h2 className="about__heading reveal-left">
              Qui suis-<em>je</em> ?
            </h2>

            <p className="about__text reveal" style={{ transitionDelay: "0.1s" }}>
              {OWNER.about}
            </p>

            {/* Stat cards */}
            <div className="about__cards">
              {CARDS.map((c, i) => (
                <div
                  key={i}
                  className="about__card reveal"
                  style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="about__card-icon">{c.icon}</div>
                  <div className="about__card-value">
                    {c.value}<span>{c.suffix}</span>
                  </div>
                  <div className="about__card-label">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div className="about__traits reveal" style={{ transitionDelay: "0.4s" }}>
              {TRAITS.map((t) => (
                <span key={t} className="trait">{t}</span>
              ))}
            </div>
          </div>

          {/* RIGHT: Timeline */}
          <div className="about__right reveal-right">
            <p className="about__timeline-title">Parcours</p>
            <div className="timeline">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="timeline__item reveal"
                  style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="timeline__dot">{item.icon}</div>
                  <div className="timeline__content">
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