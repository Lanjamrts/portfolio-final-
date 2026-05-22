import { useState, useEffect } from "react";
import { OWNER } from "../data/portfolioData.js";

const css = `
  /* ── Navbar ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 900;
    padding: 28px 0;
    transition: background 0.5s ease, padding 0.5s ease, border-color 0.5s ease;
  }
  .nav.scrolled {
    background: rgba(3, 3, 5, 0.75);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(0,245,212,0.08);
    padding: 16px 0;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
  }
  .nav__inner {
    display: flex; align-items: center; justify-content: space-between;
  }

  /* Logo */
  .nav__logo {
    display: inline-flex; align-items: center; gap: 2px;
    font-family: var(--font-display); font-weight: 800;
    font-size: 22px; letter-spacing: -0.03em;
    color: var(--text-primary);
    cursor: pointer;
    transition: opacity 0.2s;
    position: relative; overflow: hidden;
    padding: 6px 4px;
    text-decoration: none; border: none; background: none;
  }
  .nav__logo-main { transition: transform 0.3s var(--ease-spring); display: block; }
  .nav__logo-dot { color: var(--accent); }
  .nav__logo:hover .nav__logo-main { transform: skewX(-4deg); }
  .nav__logo-glow {
    position: absolute; inset: 0;
    background: radial-gradient(circle at center, var(--accent-dim), transparent 70%);
    opacity: 0; transition: opacity 0.3s;
    pointer-events: none;
  }
  .nav__logo:hover .nav__logo-glow { opacity: 1; }

  /* Links */
  .nav__links {
    display: flex; align-items: center; gap: 2px;
    list-style: none;
  }
  .nav__link {
    position: relative;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.12em; color: var(--text-secondary);
    text-transform: uppercase; padding: 9px 16px;
    border-radius: 10px; cursor: pointer;
    transition: color 0.3s var(--ease-out);
    border: none; background: none;
  }
  .nav__link::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    border-radius: 10px;
    opacity: 0; transform: scale(0.85);
    transition: opacity 0.25s, transform 0.25s var(--ease-spring);
  }
  .nav__link::after {
    content: ''; position: absolute;
    bottom: 6px; left: 50%; transform: translateX(-50%);
    width: 0; height: 1.5px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 2px;
    transition: width 0.35s var(--ease-out);
  }
  .nav__link:hover { color: var(--text-primary); }
  .nav__link:hover::before { opacity: 1; transform: scale(1); }
  .nav__link:hover::after { width: 40%; }
  .nav__link.active { color: var(--accent); }
  .nav__link.active::before { opacity: 1; transform: scale(1); }
  .nav__link.active::after { width: 55%; }

  /* CTA Button */
  .nav__cta {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 10px 22px; border-radius: 12px;
    background: var(--accent-dim);
    border: 1px solid rgba(0,245,212,0.3);
    color: var(--accent);
    transition: all 0.3s var(--ease-out);
    position: relative; overflow: hidden;
  }
  .nav__cta::before {
    content: ''; position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,245,212,0.15), transparent);
    transition: left 0.6s;
  }
  .nav__cta:hover {
    background: rgba(0,245,212,0.18);
    border-color: rgba(0,245,212,0.5);
    box-shadow: 0 0 24px rgba(0,245,212,0.25), 0 0 48px rgba(0,245,212,0.1);
    transform: translateY(-1px);
  }
  .nav__cta:hover::before { left: 100%; }

  /* Hamburger */
  .nav__burger {
    display: none; flex-direction: column; gap: 6px;
    width: 32px; padding: 4px; cursor: pointer;
    border: none; background: none;
  }
  .nav__burger span {
    display: block; height: 1.5px; border-radius: 2px;
    background: var(--silver-200);
    transition: all 0.4s var(--ease-spring);
    transform-origin: center;
  }
  .nav__burger span:last-child { width: 70%; }
  .nav__burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); width: 100%; }
  .nav__burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav__burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); width: 100%; }

  /* Mobile menu */
  .nav__mobile {
    position: fixed; inset: 0; z-index: 800;
    background: rgba(3, 3, 5, 0.96);
    backdrop-filter: blur(32px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 8px;
    transform: translateY(-100%);
    transition: transform 0.6s var(--ease-out);
    pointer-events: none;
  }
  .nav__mobile.open { transform: translateY(0); pointer-events: all; }
  .nav__mobile .nav__link {
    font-size: 15px; padding: 16px 48px;
    text-align: center; min-width: 200px;
    opacity: 0; transform: translateY(20px);
    transition: color 0.3s, opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
  }
  .nav__mobile.open .nav__link { opacity: 1; transform: translateY(0); }
  .nav__mobile.open .nav__link:nth-child(1) { transition-delay: 0.1s; }
  .nav__mobile.open .nav__link:nth-child(2) { transition-delay: 0.15s; }
  .nav__mobile.open .nav__link:nth-child(3) { transition-delay: 0.2s; }
  .nav__mobile.open .nav__link:nth-child(4) { transition-delay: 0.25s; }
  .nav__mobile.open .nav__link:nth-child(5) { transition-delay: 0.3s; }

  .nav__mobile-divider {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-dim), transparent);
    margin: 8px 0;
    opacity: 0; transition: opacity 0.4s ease 0.35s;
  }
  .nav__mobile.open .nav__mobile-divider { opacity: 1; }

  @media (max-width: 768px) {
    .nav__links, .nav__cta { display: none; }
    .nav__burger { display: flex; }
  }
`;

const LINKS = [
  { label: "Accueil",      href: "hero" },
  { label: "À propos",     href: "about" },
  { label: "Compétences",  href: "skills" },
  { label: "Projets",      href: "projects" },
  { label: "Contact",      href: "contact" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [active,      setActive]      = useState("hero");
  const [mobileOpen,  setMobileOpen]  = useState(false);

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
      const current  = sections.find((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
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
          {/* Logo */}
          <button className="nav__logo" onClick={() => scrollTo("hero")} aria-label="Accueil">
            <span className="nav__logo-main">
              {OWNER.firstName}<span className="nav__logo-dot">.</span>
            </span>
            <div className="nav__logo-glow" />
          </button>

          {/* Desktop links */}
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <button
                  className={`nav__link${active === l.href ? " active" : ""}`}
                  onClick={() => handleLink(l.href)}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="nav__cta" onClick={() => handleLink("contact")} data-hover>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Me contacter
          </button>

          {/* Hamburger */}
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
          <button
            key={l.href}
            className={`nav__link${active === l.href ? " active" : ""}`}
            onClick={() => handleLink(l.href)}
          >
            {l.label}
          </button>
        ))}
        <div className="nav__mobile-divider" />
        <button className="nav__cta" style={{ marginTop: 8 }} onClick={() => handleLink("contact")}>
          Me contacter
        </button>
      </div>
    </>
  );
}