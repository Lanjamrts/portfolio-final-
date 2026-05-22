import { useEffect } from "react";
import { SKILL_CATEGORIES } from "../data/portfolioData.js";

const css = `
  .skills { position: relative; overflow: hidden; }

  .skills__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 50% 60% at 10% 50%, rgba(79,195,247,0.05) 0%, transparent 70%);
  }

  .skills__inner { position: relative; z-index: 1; }

  .skills__header { margin-bottom: 56px; }

  .skills__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(32px, 4vw, 52px); line-height: 1.05;
    letter-spacing: -0.03em;
  }
  .skills__heading em { font-style: normal; color: var(--accent); }

  .skills__categories {
    display: flex; flex-direction: column; gap: 40px;
  }

  .skills__category {}

  .skills__category-title {
    font-family: var(--font-mono); font-size: 12px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  .skills__list {
    display: flex; flex-wrap: wrap; gap: 12px;
  }

  .skill-chip {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 12px 18px 12px 14px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 14px;
    transition: all 0.3s var(--ease-out);
  }
  .skill-chip:hover {
    border-color: var(--border-glow);
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.35);
    background: var(--bg-card);
  }

  .skill-chip__icon-wrap {
    width: 32px; height: 32px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-surface);
    border-radius: 8px; border: 1px solid var(--border);
    padding: 5px;
  }

  .skill-chip__icon {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
  }

  .skill-chip__name {
    font-family: var(--font-display); font-size: 14px; font-weight: 600;
    color: var(--text-primary); white-space: nowrap;
  }

  @media (max-width: 480px) {
    .skill-chip { padding: 10px 14px 10px 12px; }
    .skill-chip__name { font-size: 13px; white-space: normal; }
  }
`;

function SkillIcon({ skill }) {
  const src = skill.iconUrl
    ? skill.iconUrl
    : `https://cdn.simpleicons.org/${skill.icon}/${skill.color || "E8E8F0"}`;

  return (
    <img
      src={src}
      alt=""
      className="skill-chip__icon"
      loading="lazy"
      decoding="async"
    />
  );
}

export default function Skills() {
  useEffect(() => {
    if (!document.getElementById("skills-css")) {
      const s = document.createElement("style");
      s.id = "skills-css";
      s.textContent = css;
      document.head.appendChild(s);
    }

    const revealObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 }
    );
    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => revealObs.observe(el));
    return () => revealObs.disconnect();
  }, []);

  return (
    <section id="skills" className="skills section">
      <div className="skills__bg" />
      <div className="container skills__inner">
        <div className="reveal" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "var(--accent)",
                textTransform: "uppercase",
              }}
            >
              02 / Compétences
            </span>
            <div style={{ height: 1, width: 80, background: "var(--border)" }} />
          </div>
        </div>

        <div className="skills__header">
          <h2 className="skills__heading reveal-left">
            Compétences <em>techniques</em>
          </h2>
        </div>

        <div className="skills__categories">
          {SKILL_CATEGORIES.map((category, ci) => (
            <div
              key={category.id}
              className="skills__category reveal"
              style={{ transitionDelay: `${ci * 0.06}s` }}
            >
              <h3 className="skills__category-title">{category.title}</h3>
              <div className="skills__list">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-chip" data-hover>
                    <div className="skill-chip__icon-wrap">
                      <SkillIcon skill={skill} />
                    </div>
                    <span className="skill-chip__name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
