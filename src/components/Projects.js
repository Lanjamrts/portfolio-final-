import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../LanguageContext.js";
import { PROJECTS, PROJECTS_FOOTER, PROJECT_FILTERS } from "../data/portfolioData.js";

const css = `
  /* ── Projects ── */
  .projects { position: relative; overflow: hidden; }

  .projects__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 55% 50% at 95% 30%, rgba(123,47,247,0.07) 0%, transparent 65%),
      radial-gradient(ellipse 40% 40% at 5% 70%, rgba(0,245,212,0.04) 0%, transparent 60%);
  }

  .projects__inner { position: relative; z-index: 1; }

  /* ── Header ── */
  .projects__header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap; gap: 24px;
    margin-bottom: 52px;
  }
  .projects__heading-ghost {
    display: block;
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(52px, 6vw, 88px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
    letter-spacing: -0.05em; line-height: 0.9;
    user-select: none; margin-bottom: -8px;
  }
  .projects__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(34px, 4vw, 56px); line-height: 1.0;
    letter-spacing: -0.04em;
  }
  .projects__heading em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }



  /* ── Filter Bar ── */
  .projects__filters {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: 40px;
  }
  .projects__filter-btn {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 7px 18px; border-radius: 100px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--silver-400); cursor: pointer;
    transition: all 0.25s var(--ease-out);
  }
  .projects__filter-btn:hover {
    border-color: var(--accent-dim);
    color: var(--accent);
    background: var(--accent-dim);
  }
  .projects__filter-btn.active {
    background: var(--accent);
    color: var(--bg-void);
    border-color: var(--accent);
    font-weight: 700;
  }

  /* ── Grid ── */
  .projects__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  /* ── Card ── */
  .project-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 22px; overflow: hidden;
    display: flex; flex-direction: column;
    transition: all 0.4s var(--ease-out);
    position: relative;
  }
  /* Rotating glow border on hover */
  .project-card::before {
    content: '';
    position: absolute; inset: -2px;
    border-radius: 24px;
    background: conic-gradient(
      from var(--angle, 0deg),
      var(--accent) 0%,
      var(--accent2) 25%,
      transparent 40%,
      transparent 60%,
      var(--accent2) 75%,
      var(--accent) 100%
    );
    opacity: 0; z-index: 0;
    transition: opacity 0.4s;
    animation: cardBorderRotate 3s linear infinite;
  }
  @keyframes cardBorderRotate {
    to { --angle: 360deg; }
  }
  .project-card::after {
    content: '';
    position: absolute; inset: 1px;
    border-radius: 22px;
    background: var(--bg-elevated);
    z-index: 0;
  }
  .project-card:hover { transform: translateY(-8px); box-shadow: 0 32px 64px rgba(0,0,0,0.5); }
  .project-card:hover::before { opacity: 1; }
  .project-card-content { position: relative; z-index: 1; display: flex; flex-direction: column; flex: 1; }

  /* ── Preview ── */
  .project-card__preview {
    position: relative; aspect-ratio: 16/9;
    background: var(--bg-surface);
    overflow: hidden; cursor: pointer;
    border: none; padding: 0; width: 100%; text-align: left;
  }
  .project-card__preview img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s var(--ease-out), filter 0.4s;
    filter: brightness(0.9) saturate(0.9);
  }
  .project-card:hover .project-card__preview img {
    transform: scale(1.06);
    filter: brightness(1) saturate(1.1);
  }

  .project-card__preview-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top,
      rgba(3,3,5,0.9) 0%,
      rgba(3,3,5,0.3) 40%,
      transparent 100%);
    opacity: 0; transition: opacity 0.4s;
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 24px;
  }
  .project-card__preview:hover .project-card__preview-overlay { opacity: 1; }

  .project-card__preview-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; border-radius: 100px;
    background: var(--accent); color: var(--bg-void);
    font-family: var(--font-mono); font-size: 11px;
    font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    transform: translateY(12px); transition: transform 0.4s var(--ease-spring);
  }
  .project-card__preview:hover .project-card__preview-btn {
    transform: translateY(0);
  }

  /* ── Body ── */
  .project-card__body {
    padding: 24px 26px 28px;
    flex: 1; display: flex; flex-direction: column;
  }

  .project-card__category {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .project-card__category::before {
    content: ''; display: block; width: 20px; height: 1px;
    background: var(--accent);
  }

  .project-card__title {
    font-family: var(--font-display); font-size: 20px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 12px;
    letter-spacing: -0.02em;
    transition: color 0.3s;
  }
  .project-card:hover .project-card__title { color: var(--accent); }

  .project-card__desc {
    font-size: 14px; line-height: 1.7;
    color: var(--text-secondary); margin-bottom: 20px; flex: 1;
  }

  .project-card__techs {
    display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px;
  }
  .project-card__tech {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 11px; border-radius: 100px;
    background: var(--bg-surface); border: 1px solid var(--border);
    color: var(--silver-400);
    transition: all 0.2s;
  }
  .project-card:hover .project-card__tech {
    border-color: rgba(0,245,212,0.15);
    color: var(--silver-200);
  }

  .project-card__actions {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin-top: auto;
  }

  .project-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.07em; text-transform: uppercase;
    transition: all 0.25s var(--ease-out);
  }
  .project-btn--github {
    background: var(--bg-surface); border: 1px solid var(--border);
    color: var(--text-primary);
  }
  .project-btn--github:hover {
    border-color: var(--border-glow);
    background: var(--accent-dim); color: var(--accent);
    transform: translateY(-2px);
  }
  .project-btn--demo {
    background: linear-gradient(135deg, var(--accent) 0%, #00c9a7 100%);
    color: var(--bg-void); font-weight: 700;
    position: relative; overflow: hidden;
  }
  .project-btn--demo::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  .project-btn--demo:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,245,212,0.4); }
  .project-btn--demo:hover::before { left: 100%; }

  /* ── Footer ── */
  .projects__footer {
    margin-top: 60px; padding: 32px 40px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 20px; text-align: center;
    position: relative; overflow: hidden;
  }
  .projects__footer::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim) 0%, transparent 50%, var(--accent2-dim) 100%);
    opacity: 0.5; pointer-events: none;
  }
  .projects__footer-content { position: relative; z-index: 1; }
  .projects__footer p { font-size: 14px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 6px; }
  .projects__footer p:last-child { margin-bottom: 0; }
  .projects__footer strong { color: var(--accent); font-weight: 600; }
  .projects__footer a {
    color: var(--accent); text-decoration: underline;
    text-underline-offset: 4px; text-decoration-color: rgba(0,245,212,0.4);
    transition: text-decoration-color 0.2s;
  }
  .projects__footer a:hover { text-decoration-color: var(--accent); }

  @media (max-width: 700px) {
    .projects__header { flex-direction: column; align-items: flex-start; }
    .projects__grid { grid-template-columns: 1fr; }
    .projects__footer { padding: 24px 20px; }
  }
`;

/* ── 3D Tilt wrapper ── */
function TiltCard({ children }) {
  const ref      = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef= useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);
  const rafRef    = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    targetRef.current = { x: -y * 14, y: x * 14 };
  }, []);

  const onEnter = useCallback(() => {
    activeRef.current = true;
    const loop = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      c.x += (t.x - c.x) * 0.1;
      c.y += (t.y - c.y) * 0.1;
      if (ref.current) {
        ref.current.style.transform =
          `perspective(900px) rotateX(${c.x}deg) rotateY(${c.y}deg) scale3d(1.02,1.02,1.02) translateY(-8px)`;
      }
      if (activeRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const onLeave = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
    targetRef.current = { x: 0, y: 0 };
    if (ref.current) {
      ref.current.style.transition = "transform 0.6s var(--ease-out)";
      ref.current.style.transform  = "perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1) translateY(0)";
      setTimeout(() => {
        if (ref.current) ref.current.style.transition = "";
      }, 600);
    }
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

export default function Projects() {
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    if (!document.getElementById("projects-css")) {
      const s = document.createElement("style");
      s.id = "projects-css"; s.textContent = css;
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

  return (
    <section id="projects" className="projects section">
      <div className="projects__bg" />
      <div className="container projects__inner">

        <div className="reveal" style={{ marginBottom: 16 }}>
          <span className="section-label">{t("projects.sectionLabel")}</span>
        </div>

        <div className="projects__header">
          <div className="reveal-left">
            <span className="projects__heading-ghost">{t("projects.ghostHeading")}</span>
            <h2 className="projects__heading">
              {t("projects.heading")} <em>{t("projects.headingAccent")}</em>
            </h2>
          </div>

        </div>

        <div className="projects__filters reveal">
          {PROJECT_FILTERS.map((f) => (
            <button
              key={f}
              className={`projects__filter-btn${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === "Tous" ? (lang === "en" ? "All" : "Tous") : f}
            </button>
          ))}
        </div>

        <div className="projects__grid">
          {PROJECTS.filter((p) => activeFilter === "Tous" || p.category === activeFilter).map((project, i) => (
            <TiltCard key={project.id}>
              <article
                className="project-card reveal"
                style={{ transitionDelay: `${i * 0.09}s` }}
              >
                <div className="project-card-content">
                  {/* Preview */}
                  <button
                    type="button"
                    className="project-card__preview"
                    onClick={() =>
                      window.open(
                        project.demo || project.github,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    aria-label={`${t("projects.previewLabel")} ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt={`Aperçu ${project.title}`}
                      loading="lazy"
                    />
                    <div className="project-card__preview-overlay">
                      <span className="project-card__preview-btn">
                        {project.demo ? t("projects.viewSite") : t("projects.viewOnGithub")} →
                      </span>
                    </div>
                  </button>

                  {/* Body */}
                  <div className="project-card__body">
                    <span className="project-card__category">{project.category}</span>
                    <h3 className="project-card__title">{project.title}</h3>
                    <p className="project-card__desc">{lang === "en" ? project.descriptionEn : project.description}</p>

                    <div className="project-card__techs">
                      {project.techs.map((t) => (
                        <span key={t} className="project-card__tech">{t}</span>
                      ))}
                    </div>

                    <div className="project-card__actions">
                      <a
                        href={project.github}
                        target="_blank" rel="noreferrer"
                        className="project-btn project-btn--github"
                        data-hover
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        {t("projects.codeSource")}
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank" rel="noreferrer"
                          className="project-btn project-btn--demo"
                          data-hover
                        >
                          {t("projects.viewSite")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>

        <footer className="projects__footer reveal" style={{ transitionDelay: "0.2s" }}>
          <div className="projects__footer-content">
            <p>
              <strong>+</strong> {lang === "en" ? PROJECTS_FOOTER.moreEn : PROJECTS_FOOTER.more}{" "}
              <a href="https://github.com/Lanjamrts" target="_blank" rel="noreferrer">
                github.com/Lanjamrts
              </a>
            </p>
            <p><strong>→</strong> {lang === "en" ? PROJECTS_FOOTER.inProgressEn : PROJECTS_FOOTER.inProgress}</p>
          </div>
        </footer>
      </div>
    </section>
  );
}
