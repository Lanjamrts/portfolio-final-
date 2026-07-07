import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext.js";
import { OWNER } from "../data/portfolioData.js";

const css = `
  /* ── Navbar ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 900;
    padding: 28px 0;
    transition: background 0.5s ease, padding 0.5s ease, border-color 0.5s ease;
  }
  .nav.scrolled {
    background: var(--nav-bg);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(0,245,212,0.08);
    padding: 16px 0;
    box-shadow: 0 8px 40px rgba(0,0,0,0.2);
  }
  .nav__inner {
    display: flex; align-items: center; justify-content: space-between;
  }

  /* Logo */
  .nav__logo {
    display: inline-flex; align-items: center;
    cursor: pointer;
    transition: opacity 0.2s;
    position: relative; overflow: hidden;
    text-decoration: none; border: none; background: none;
    padding: 2px 4px;
  }
  .nav__logo-img {
    height: 40px; width: auto;
    display: block;
    transition: transform 0.3s var(--ease-spring);
    border-radius: 6px;
    animation: logoBreath 3s ease-in-out infinite;
  }
  .nav__logo:hover .nav__logo-img { animation: none; transform: scale(1.05); }

  @keyframes logoBreath {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,245,212,0); }
    50%      { transform: scale(1.04); box-shadow: 0 0 16px 2px rgba(0,245,212,0.25); }
  }

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

  /* Theme Toggle */
  .nav__toggle {
    width: 40px; height: 40px; border-radius: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-400);
    transition: all 0.3s var(--ease-spring);
    cursor: pointer; padding: 0;
  }
  .nav__toggle:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-2px);
    background: var(--accent-dim);
  }
  .nav__toggle svg { width: 18px; height: 18px; }

  /* Language Toggle */
  .nav__lang {
    width: 40px; height: 40px; border-radius: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-400);
    font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    letter-spacing: 0.05em;
    transition: all 0.3s var(--ease-spring);
    cursor: pointer; padding: 0;
  }
  .nav__lang:hover {
    border-color: var(--border-glow);
    color: var(--accent);
    transform: translateY(-2px);
    background: var(--accent-dim);
  }

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
    background: var(--mobile-bg);
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

const NAV_ORDER = ["hero", "about", "skills", "projects", "contact"];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar({ theme, toggleTheme }) {
  const { lang, toggleLang, t } = useLanguage();
  const [scrolled,    setScrolled]    = useState(false);
  const [active,      setActive]      = useState("hero");
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const LINKS = NAV_ORDER.map((href) => {
    const pairs = t("nav.links");
    const pair = pairs.find((p) => p[0] === href);
    return { href, label: pair ? pair[1] : href };
  });

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
      const sections = NAV_ORDER.map((h) => document.getElementById(h));
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
          <button className="nav__logo" onClick={() => scrollTo("hero")} aria-label={t("nav.links.0.1")}>
            <img src="/lanja-logo.jpeg" alt="Lanja" className="nav__logo-img" />
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

          {/* CTA & Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="nav__lang" onClick={toggleLang} aria-label={t("langToggle.ariaLabel")}>
              {lang === "fr" ? "FR" : "EN"}
            </button>

            <button className="nav__toggle" onClick={toggleTheme} aria-label={t("themeToggle.ariaLabel")}>
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <button className="nav__cta" onClick={() => handleLink("contact")} data-hover>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              {t("nav.cta")}
            </button>

            {/* Hamburger */}
            <button
              className={`nav__burger${mobileOpen ? " open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t("nav.links.0.1")}
            >
              <span /><span /><span />
            </button>
          </div>
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
        <div style={{ display: 'flex', gap: '6px', marginTop: 8 }}>
          <button className="nav__cta" onClick={() => handleLink("contact")}>
            {t("nav.cta")}
          </button>
          <button className="nav__lang" onClick={toggleLang}>
            {lang === "fr" ? "FR" : "EN"}
          </button>
        </div>
      </div>
    </>
  );
}