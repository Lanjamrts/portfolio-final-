import { useEffect, useRef } from "react";
import { SKILL_CATEGORIES } from "../data/portfolioData.js";

const css = `
  /* ── Skills ── */
  .skills { position: relative; overflow: hidden; }

  .skills__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 50% 60% at 5% 50%, rgba(0,245,212,0.05) 0%, transparent 65%),
      radial-gradient(ellipse 40% 50% at 95% 20%, rgba(123,47,247,0.05) 0%, transparent 65%);
  }

  .skills__inner { position: relative; z-index: 1; }

  /* ── Marquee banner ── */
  .skills__marquee-wrap {
    width: 100%; overflow: hidden;
    margin-bottom: 72px; position: relative;
  }
  .skills__marquee-wrap::before,
  .skills__marquee-wrap::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 100px; z-index: 2;
    pointer-events: none;
  }
  .skills__marquee-wrap::before {
    left: 0;
    background: linear-gradient(90deg, var(--bg-void), transparent);
  }
  .skills__marquee-wrap::after {
    right: 0;
    background: linear-gradient(-90deg, var(--bg-void), transparent);
  }
  .skills__marquee {
    display: flex; gap: 40px;
    width: max-content;
    animation: marqueeScroll 28s linear infinite;
    padding: 16px 0;
  }
  .skills__marquee:hover { animation-play-state: paused; }
  @keyframes marqueeScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .skills__marquee-item {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); font-size: 12px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--silver-600); white-space: nowrap;
    user-select: none;
  }
  .skills__marquee-item::before {
    content: '✦';
    color: var(--accent-dim);
    opacity: 0.4; font-size: 8px;
  }

  /* ── Header ── */
  .skills__header { margin-bottom: 64px; }
  .skills__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(34px, 4vw, 56px); line-height: 1.0;
    letter-spacing: -0.04em;
  }
  .skills__heading-ghost {
    display: block;
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(52px, 6vw, 88px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
    letter-spacing: -0.05em; line-height: 0.9;
    user-select: none; margin-bottom: -8px;
  }
  .skills__heading-accent {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Categories ── */
  .skills__categories { display: flex; flex-direction: column; gap: 48px; }
  .skills__category {}

  .skills__category-title {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .skills__category-title::after {
    content: ''; flex: 1; max-width: 60px; height: 1px;
    background: linear-gradient(90deg, var(--accent-dim), transparent);
  }

  .skills__list { display: flex; flex-wrap: wrap; gap: 10px; }

  /* ── Skill chip ── */
  .skill-chip {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 12px 18px 12px 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.35s var(--ease-spring);
    cursor: default;
    position: relative; overflow: hidden;
  }
  .skill-chip-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.3s;
    pointer-events: none;
  }
  .skill-chip:hover {
    border-color: var(--border-glow);
    transform: translateY(-6px) scale(1.04);
    box-shadow:
      0 16px 40px rgba(0,0,0,0.5),
      0 0 24px rgba(0,245,212,0.15),
      0 0 0 1px rgba(0,245,212,0.15);
  }
  .skill-chip:hover .skill-chip-bg { opacity: 1; }
  .skill-chip:hover .skill-chip__icon-wrap {
    border-color: rgba(0,245,212,0.4);
    background: rgba(0,245,212,0.08);
    transform: scale(1.1) rotate(-5deg);
  }

  .skill-chip__icon-wrap {
    width: 34px; height: 34px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-surface);
    border-radius: 10px; border: 1px solid var(--border);
    padding: 6px;
    transition: all 0.3s var(--ease-spring);
    position: relative; z-index: 1;
  }
  .skill-chip__icon {
    width: 100%; height: 100%;
    object-fit: contain; display: block;
    transition: transform 0.3s;
  }
  .skill-chip__name {
    font-family: var(--font-display); font-size: 14px; font-weight: 600;
    color: var(--text-primary); white-space: nowrap;
    position: relative; z-index: 1;
    transition: color 0.3s;
  }
  .skill-chip:hover .skill-chip__name { color: var(--text-primary); }

  @media (max-width: 480px) {
    .skill-chip { padding: 10px 14px 10px 10px; }
    .skill-chip__name { font-size: 13px; white-space: normal; }
  }
`;

const ALL_SKILLS = ["React", "Next.js", "Vue", "Node.js", "Flutter", "MongoDB",
  "PostgreSQL", "Docker", "GraphQL", "TypeScript", "NestJS", "Figma",
  "Git", "Tailwind", "Express", "MySQL", "Redis", "Symfony"];

export default function Skills() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("skills-css")) {
      const s = document.createElement("style");
      s.id = "skills-css"; s.textContent = css;
      document.head.appendChild(s);
    }

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-pop"
    ).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Duplicate marquee items for seamless loop */
  const marqueeItems = [...ALL_SKILLS, ...ALL_SKILLS];

  return (
    <section id="skills" className="skills section">
      <div className="skills__bg" />
      <div className="skills__inner">

        {/* Scrolling marquee */}
        <div className="skills__marquee-wrap">
          <div className="skills__marquee" ref={marqueeRef}>
            {marqueeItems.map((name, i) => (
              <span key={i} className="skills__marquee-item">{name}</span>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="reveal" style={{ marginBottom: 16 }}>
            <span className="section-label">02 / Compétences</span>
          </div>

          <div className="skills__header">
            <div className="reveal-left">
              <span className="skills__heading-ghost">Skills</span>
              <h2 className="skills__heading">
                Compétences{" "}
                <span className="skills__heading-accent">techniques</span>
              </h2>
            </div>
          </div>

          <div className="skills__categories">
            {SKILL_CATEGORIES.map((cat, ci) => (
              <div key={cat.id} className="skills__category">
                <h3
                  className="skills__category-title reveal-left"
                  style={{ transitionDelay: `${ci * 0.06}s` }}
                >
                  {cat.title}
                </h3>
                <div className="skills__list">
                  {cat.skills.map((skill, si) => {
                    const iconSrc = skill.iconUrl
                      ? skill.iconUrl
                      : `https://cdn.simpleicons.org/${skill.icon}/${skill.color || "E8E8F0"}`;
                    return (
                      <div
                        key={skill.name}
                        className="skill-chip reveal-pop"
                        data-hover
                        style={{ transitionDelay: `${0.08 + ci * 0.06 + si * 0.04}s` }}
                      >
                        <div className="skill-chip-bg" />
                        <div className="skill-chip__icon-wrap">
                          <img
                            src={iconSrc}
                            alt=""
                            className="skill-chip__icon"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <span className="skill-chip__name">{skill.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
