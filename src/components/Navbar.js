import { useState, useEffect } from "react";
import { OWNER } from "../data/portfolioData.js";

const css = `
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 900;
    transition: background 0.4s ease, border-color 0.4s ease, padding 0.4s ease;
    padding: 24px 0;
  }
  .nav.scrolled {
    background: rgba(5,5,7,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 14px 0;
  }
  .nav__inner {
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav__logo {
    display: inline-flex; align-items: center;
    line-height: 0;
    transition: opacity 0.2s, transform 0.2s;
  }
  .nav__logo:hover { opacity: 0.85; transform: scale(1.03); }
  .nav__logo-img {
    height: 40px; width: auto;
    display: block;
    object-fit: contain;
  }
  .nav.scrolled .nav__logo-img { height: 34px; }

  .nav__links {
    display: flex; align-items: center; gap: 6px;
    list-style: none;
  }
  .nav__link {
    position: relative;
    font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em;
    color: var(--text-secondary); text-transform: uppercase;
    padding: 8px 14px; border-radius: 8px;
    transition: color 0.25s, background 0.25s;
    cursor: pointer;
  }
  .nav__link:hover { color: var(--text-primary); background: var(--bg-elevated); }
  .nav__link.active { color: var(--accent); background: var(--accent-dim); }

  .nav__cta {
    font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em;
    padding: 9px 20px; border-radius: 10px;
    border: 1px solid var(--border-glow);
    color: var(--accent); background: var(--accent-dim);
    transition: all 0.25s var(--ease-out);
    text-transform: uppercase;
  }
  .nav__cta:hover {
    background: rgba(79,195,247,0.25);
    box-shadow: 0 0 20px var(--accent-glow);
    transform: translateY(-1px);
  }

  /* Hamburger */
  .nav__burger {
    display: none; flex-direction: column; gap: 5px;
    width: 28px; padding: 4px; cursor: pointer;
  }
  .nav__burger span {
    display: block; height: 2px; border-radius: 2px;
    background: var(--silver-200);
    transition: all 0.35s var(--ease-out);
    transform-origin: center;
  }
  .nav__burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nav__burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav__burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile menu */
  .nav__mobile {
    position: fixed; inset: 0; z-index: 800;
    background: rgba(5,5,7,0.97);
    backdrop-filter: blur(24px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 12px;
    transform: translateY(-100%);
    transition: transform 0.5s var(--ease-out);
    pointer-events: none;
  }
  .nav__mobile.open { transform: translateY(0); pointer-events: all; }
  .nav__mobile .nav__link {
    font-size: 14px; padding: 14px 28px;
    text-align: center; min-width: 180px;
  }

  @media (max-width: 768px) {
    .nav__links, .nav__cta { display: none; }
    .nav__burger { display: flex; }
  }
`;

const LINKS = [
  { label: "Accueil", href: "hero" },
  { label: "À propos", href: "about" },
  { label: "Compétences", href: "skills" },
  { label: "Projets", href: "projects" },
  { label: "Contact", href: "contact" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!document.getElementById("navbar-css")) {
      const s = document.createElement("style");
      s.id = "navbar-css"; s.textContent = css;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = LINKS.map((l) => document.getElementById(l.href));
      const current = sections.find((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom > 120;
      });
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = (href) => {
    scrollTo(href);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="container nav__inner">
          <a className="nav__logo" onClick={() => scrollTo("hero")} style={{ cursor: "pointer" }} aria-label="Accueil">
            <img src={OWNER.logo} alt={`Logo ${OWNER.fullName}`} className="nav__logo-img" />
          </a>

          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <span
                  className={`nav__link${active === l.href ? " active" : ""}`}
                  onClick={() => handleLink(l.href)}
                >
                  {l.label}
                </span>
              </li>
            ))}
          </ul>

          <button className="nav__cta" onClick={() => handleLink("contact")}>
            Me contacter
          </button>

          <button
            className={`nav__burger${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav__mobile${mobileOpen ? " open" : ""}`}>
        {LINKS.map((l) => (
          <span
            key={l.href}
            className={`nav__link${active === l.href ? " active" : ""}`}
            onClick={() => handleLink(l.href)}
          >
            {l.label}
          </span>
        ))}
        <button className="nav__cta" style={{ marginTop: 16 }} onClick={() => handleLink("contact")}>
          Me contacter
        </button>
      </div>
    </>
  );
}