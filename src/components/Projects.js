import { useEffect, useState } from "react";
import {
  PROJECTS,
  PROJECT_FILTERS,
  PROJECTS_FOOTER,
} from "../data/portfolioData.js";

const css = `
  .projects { position: relative; overflow: hidden; }

  .projects__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 55% 50% at 90% 30%, rgba(167,139,250,0.06) 0%, transparent 70%);
  }

  .projects__inner { position: relative; z-index: 1; }

  .projects__header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap; gap: 20px;
    margin-bottom: 48px;
  }

  .projects__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(32px, 4vw, 52px); line-height: 1.05;
    letter-spacing: -0.03em;
  }
  .projects__heading em { font-style: normal; color: var(--accent); }

  .projects__filters {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .projects__filter {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 7px 16px; border-radius: 100px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    color: var(--text-secondary); cursor: pointer;
    transition: all 0.25s var(--ease-out);
  }
  .projects__filter:hover { border-color: var(--border-glow); color: var(--text-primary); }
  .projects__filter.active {
    background: var(--accent-dim); border-color: var(--border-glow); color: var(--accent);
  }

  .projects__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .project-card {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    display: flex; flex-direction: column;
    transition: all 0.35s var(--ease-out);
  }
  .project-card:hover {
    border-color: var(--border-glow);
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.4);
  }

  .project-card__preview {
    position: relative; aspect-ratio: 16 / 9;
    background: var(--bg-surface);
    overflow: hidden; cursor: pointer;
    border: none; padding: 0; width: 100%;
    text-align: left;
  }
  .project-card__preview img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s var(--ease-out);
  }
  .project-card:hover .project-card__preview img { transform: scale(1.04); }

  .project-card__preview-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(5,5,7,0.85) 0%, transparent 50%);
    opacity: 0; transition: opacity 0.3s;
    display: flex; align-items: flex-end; justify-content: center;
    padding-bottom: 16px;
  }
  .project-card__preview:hover .project-card__preview-overlay { opacity: 1; }
  .project-card__preview-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent);
  }

  .project-card__body { padding: 22px 24px 24px; flex: 1; display: flex; flex-direction: column; }

  .project-card__category {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }

  .project-card__title {
    font-family: var(--font-display); font-size: 18px; font-weight: 700;
    color: var(--text-primary); margin-bottom: 10px;
  }

  .project-card__desc {
    font-size: 14px; line-height: 1.65;
    color: var(--text-secondary); margin-bottom: 16px; flex: 1;
  }

  .project-card__techs {
    display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;
  }
  .project-card__tech {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 100px;
    background: var(--bg-surface); border: 1px solid var(--border);
    color: var(--silver-400);
  }

  .project-card__actions {
    display: flex; flex-wrap: wrap; gap: 10px;
  }

  .project-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: all 0.25s var(--ease-out);
  }
  .project-btn--github {
    background: var(--bg-surface); border: 1px solid var(--border);
    color: var(--text-primary);
  }
  .project-btn--github:hover {
    border-color: var(--border-glow); background: var(--accent-dim); color: var(--accent);
  }
  .project-btn--demo {
    background: linear-gradient(135deg, var(--accent) 0%, var(--violet) 100%);
    color: var(--bg-void); font-weight: 700;
  }
  .project-btn--demo:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(79,195,247,0.35);
  }

  .projects__footer {
    margin-top: 56px; padding: 28px 32px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 18px; text-align: center;
  }
  .projects__footer p {
    font-size: 14px; line-height: 1.75; color: var(--text-secondary);
    margin-bottom: 8px;
  }
  .projects__footer p:last-child { margin-bottom: 0; }
  .projects__footer strong { color: var(--accent); font-weight: 600; }
  .projects__footer a {
    color: var(--accent); text-decoration: underline;
    text-underline-offset: 3px;
  }
  .projects__footer a:hover { color: var(--text-primary); }

  @media (max-width: 700px) {
    .projects__header { flex-direction: column; align-items: flex-start; }
    .projects__grid { grid-template-columns: 1fr; }
  }
`;

function ProjectPreview({ project }) {
  const handlePreviewClick = () => {
    if (project.demo) {
      window.open(project.demo, "_blank", "noopener,noreferrer");
    } else {
      window.open(project.github, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      className="project-card__preview"
      onClick={handlePreviewClick}
      aria-label={`Aperçu ${project.title}`}
    >
      <img src={project.image} alt={`Aperçu du projet ${project.title}`} loading="lazy" />
      <div className="project-card__preview-overlay">
        <span className="project-card__preview-label">
          {project.demo ? "Voir le site →" : "Voir sur GitHub →"}
        </span>
      </div>
    </button>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    if (!document.getElementById("projects-css")) {
      const s = document.createElement("style");
      s.id = "projects-css";
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

  const filtered =
    activeFilter === "Tous"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="projects section">
      <div className="projects__bg" />
      <div className="container projects__inner">
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
              03 / Projets
            </span>
            <div style={{ height: 1, width: 80, background: "var(--border)" }} />
          </div>
        </div>

        <div className="projects__header">
          <h2 className="projects__heading reveal-left">
            Projets <em>réalisés</em>
          </h2>
          <div className="projects__filters reveal">
            {PROJECT_FILTERS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`projects__filter${activeFilter === cat ? " active" : ""}`}
                onClick={() => setActiveFilter(cat)}
                data-hover
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="projects__grid">
          {filtered.map((project, i) => (
            <article
              key={project.id}
              className="project-card reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <ProjectPreview project={project} />

              <div className="project-card__body">
                <span className="project-card__category">{project.category}</span>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>

                <div className="project-card__techs">
                  {project.techs.map((t) => (
                    <span key={t} className="project-card__tech">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="project-card__actions">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-btn project-btn--github"
                    data-hover
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Code source
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="project-btn project-btn--demo"
                      data-hover
                    >
                      Voir le site
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="projects__footer reveal" style={{ transitionDelay: "0.2s" }}>
          <p>
            <strong>+</strong> {PROJECTS_FOOTER.more}{" "}
            <a
              href="https://github.com/Lanjamrts"
              target="_blank"
              rel="noreferrer"
            >
              github.com/Lanjamrts
            </a>
          </p>
          <p>
            <strong>→</strong> {PROJECTS_FOOTER.inProgress}
          </p>
        </footer>
      </div>
    </section>
  );
}
