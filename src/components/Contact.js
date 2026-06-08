import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useLanguage } from "../LanguageContext.js";
import { OWNER } from "../data/portfolioData.js";

// ── EmailJS configuration ──────────────────────────────────────
// Remplacez ces 3 valeurs par celles de votre compte emailjs.com
const EMAILJS_SERVICE_ID  = process.env.REACT_APP_EMAILJS_SERVICE_ID  || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY  || "YOUR_PUBLIC_KEY";

const phoneHref    = (n) => `tel:${n.replace(/\s/g, "")}`;
const whatsappHref = (n) => `https://wa.me/${n.replace(/\D/g, "")}`;

const css = `
  /* ── Contact ── */
  .contact { position: relative; overflow: hidden; }

  /* Aurora background */
  .contact__aurora {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    overflow: hidden;
  }
  .contact__aurora-blob {
    position: absolute; border-radius: 50%; filter: blur(100px);
    animation: blobFloat 14s ease-in-out infinite alternate;
  }
  .contact__aurora-blob--1 {
    width: 600px; height: 500px;
    background: radial-gradient(ellipse, rgba(0,245,212,0.07) 0%, transparent 70%);
    bottom: -200px; left: -150px;
    animation-duration: 15s;
  }
  .contact__aurora-blob--2 {
    width: 500px; height: 400px;
    background: radial-gradient(ellipse, rgba(123,47,247,0.07) 0%, transparent 70%);
    top: -100px; right: -100px;
    animation-duration: 12s; animation-delay: -6s;
  }
  @keyframes blobFloat {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(30px,-40px) scale(1.08); }
  }

  .contact__inner { position: relative; z-index: 1; }

  /* ── Heading ── */
  .contact__heading-ghost {
    display: block;
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(52px, 6vw, 88px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
    letter-spacing: -0.05em; line-height: 0.9;
    user-select: none; margin-bottom: -8px;
  }
  .contact__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(34px, 4vw, 56px); line-height: 1.0;
    letter-spacing: -0.04em; margin-bottom: 16px;
  }
  .contact__heading em {
    font-style: normal;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .contact__intro {
    font-size: 15px; line-height: 1.8; color: var(--text-secondary);
    max-width: 520px; margin-bottom: 56px;
  }

  /* ── Grid ── */
  .contact__grid {
    display: grid; grid-template-columns: 1fr 1.15fr;
    gap: 44px; align-items: start;
  }

  /* ── Info cards ── */
  .contact__info { display: flex; flex-direction: column; gap: 12px; }

  .contact__card {
    display: flex; align-items: center; gap: 18px;
    padding: 18px 22px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 18px; text-decoration: none; color: inherit;
    transition: all 0.35s var(--ease-out);
    position: relative; overflow: hidden;
  }
  .contact__card-glow {
    position: absolute; inset: 0; border-radius: 18px;
    background: linear-gradient(135deg, var(--accent-dim), transparent 60%);
    opacity: 0; transition: opacity 0.35s; pointer-events: none;
  }
  a.contact__card:hover {
    border-color: var(--border-glow);
    transform: translateX(8px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  a.contact__card:hover .contact__card-glow { opacity: 1; }

  .contact__card-icon {
    width: 48px; height: 48px; flex-shrink: 0;
    border-radius: 14px;
    background: var(--accent-dim); border: 1px solid rgba(0,245,212,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    position: relative; z-index: 1;
    transition: transform 0.3s var(--ease-spring);
  }
  a.contact__card:hover .contact__card-icon { transform: scale(1.12) rotate(-5deg); }

  .contact__card-body { position: relative; z-index: 1; }
  .contact__card-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 4px;
  }
  .contact__card-value {
    font-size: 14px; font-weight: 500; color: var(--text-primary); line-height: 1.4;
  }
  a.contact__card .contact__card-value { color: var(--accent); }

  /* Social links */
  .contact__socials {
    display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px;
  }
  .contact__social {
    width: 48px; height: 48px; border-radius: 14px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-400);
    transition: all 0.3s var(--ease-spring);
    position: relative; overflow: hidden;
  }
  .contact__social::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-dim), var(--accent2-dim));
    opacity: 0; transition: opacity 0.3s;
  }
  .contact__social:hover {
    border-color: var(--border-glow); color: var(--accent);
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 8px 24px rgba(0,245,212,0.2);
  }
  .contact__social:hover::before { opacity: 1; }
  .contact__social svg { position: relative; z-index: 1; }

  /* ── Form card ── */
  .contact__form-wrap {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 24px; padding: 36px;
    position: relative; overflow: hidden;
  }
  .contact__form-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,245,212,0.03) 0%, transparent 50%, rgba(123,47,247,0.03) 100%);
    pointer-events: none;
  }

  .contact__form-title {
    font-family: var(--font-display); font-size: 20px; font-weight: 700;
    letter-spacing: -0.02em; margin-bottom: 6px;
    position: relative; z-index: 1;
  }
  .contact__form-sub {
    font-size: 13px; color: var(--text-muted); margin-bottom: 28px;
    position: relative; z-index: 1;
  }

  .contact__form-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }

  .contact__field { margin-bottom: 16px; position: relative; z-index: 1; }
  .contact__field label {
    display: block;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 8px;
    transition: color 0.3s;
  }
  .contact__field:focus-within label { color: var(--accent); }

  .contact__field input,
  .contact__field textarea {
    width: 100%; padding: 14px 18px;
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: 14px; color: var(--text-primary);
    font-family: var(--font-body); font-size: 14px;
    transition: all 0.3s var(--ease-out); resize: vertical;
  }
  .contact__field input:focus,
  .contact__field textarea:focus {
    outline: none;
    border-color: rgba(0,245,212,0.4);
    background: var(--bg-card);
    box-shadow: 0 0 0 3px rgba(0,245,212,0.08), 0 0 32px rgba(0,245,212,0.06);
    transform: scale(1.01);
  }
  .contact__field textarea { min-height: 130px; }

  .contact__hp {
    position: absolute; left: -9999px; width: 1px; height: 1px;
    opacity: 0; pointer-events: none;
  }

  .contact__alert {
    padding: 14px 18px; border-radius: 14px; margin-bottom: 20px;
    font-size: 13px; line-height: 1.65;
    position: relative; z-index: 1;
  }
  .contact__alert--success {
    background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.3);
    color: #4ade80;
  }
  .contact__alert--error {
    background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.3);
    color: #f87171;
  }

  .contact__submit {
    width: 100%; padding: 15px 28px; border-radius: 14px;
    background: linear-gradient(135deg, var(--accent) 0%, #00c9a7 100%);
    color: var(--bg-void);
    font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    transition: all 0.35s var(--ease-out);
    position: relative; overflow: hidden; z-index: 1;
    margin-top: 8px;
  }
  .contact__submit::before {
    content: ''; position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.5s;
  }
  .contact__submit:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,245,212,0.4);
  }
  .contact__submit:hover::before { left: 100%; }
  .contact__submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── Footer note ── */
  .contact__note {
    margin-top: 64px; text-align: center;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.12em; color: var(--text-muted);
  }
  .contact__note a { color: var(--text-muted); transition: color 0.2s; }
  .contact__note a:hover { color: var(--accent); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .contact__grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .contact__form-row { grid-template-columns: 1fr; }
    .contact__form-wrap { padding: 24px 20px; }
  }
`;



export default function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("contact-css")) {
      const s = document.createElement("style");
      s.id = "contact-css"; s.textContent = css;
      document.head.appendChild(s);
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-pop"
    ).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd   = new FormData(form);
    // Honeypot anti-spam
    if (fd.get("_gotcha")) return;
    setStatus("loading");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="contact__aurora">
        <div className="contact__aurora-blob contact__aurora-blob--1" />
        <div className="contact__aurora-blob contact__aurora-blob--2" />
      </div>

      <div className="container contact__inner">
        <div className="reveal" style={{ marginBottom: 16 }}>
          <span className="section-label">{t("contact.sectionLabel")}</span>
        </div>

        <div className="reveal-left">
          <span className="contact__heading-ghost">{t("contact.ghostHeading")}</span>
          <h2 className="contact__heading">
            {t("contact.heading")} <em>{t("contact.headingAccent")}</em>
          </h2>
        </div>

        <p className="contact__intro reveal" style={{ transitionDelay: "0.1s" }}>
          {t("contact.intro")}
        </p>

        <div className="contact__grid">
          {/* ── Info column ── */}
          <div className="contact__info">
            <a href={`mailto:${OWNER.email}`} className="contact__card reveal-left" data-hover style={{ transitionDelay: "0.1s" }}>
              <div className="contact__card-glow" />
              <div className="contact__card-icon">✉️</div>
              <div className="contact__card-body">
                <div className="contact__card-label">{t("contact.emailLabel")}</div>
                <div className="contact__card-value">{OWNER.email}</div>
              </div>
            </a>

            <a href={phoneHref(OWNER.phone)} className="contact__card reveal-left" data-hover style={{ transitionDelay: "0.18s" }}>
              <div className="contact__card-glow" />
              <div className="contact__card-icon">📞</div>
              <div className="contact__card-body">
                <div className="contact__card-label">{t("contact.phoneLabel")}</div>
                <div className="contact__card-value">{OWNER.phone}</div>
              </div>
            </a>

            <a href={whatsappHref(OWNER.whatsapp)} target="_blank" rel="noreferrer"
              className="contact__card reveal-left" data-hover style={{ transitionDelay: "0.26s" }}>
              <div className="contact__card-glow" />
              <div className="contact__card-icon">💬</div>
              <div className="contact__card-body">
                <div className="contact__card-label">{t("contact.whatsappLabel")}</div>
                <div className="contact__card-value">{OWNER.whatsapp}</div>
              </div>
            </a>

            <div className="contact__card reveal-left" style={{ transitionDelay: "0.34s" }}>
              <div className="contact__card-icon">📍</div>
              <div className="contact__card-body">
                <div className="contact__card-label">{t("contact.locationLabel")}</div>
                <div className="contact__card-value">{OWNER.location}</div>
              </div>
            </div>

            {/* Socials */}
            <div className="contact__socials reveal-left" style={{ transitionDelay: "0.42s" }}>
              {OWNER.socials.github && (
                <a href={OWNER.socials.github} target="_blank" rel="noreferrer"
                  className="contact__social" data-hover title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
              )}
              {OWNER.socials.linkedin && (
                <a href={OWNER.socials.linkedin} target="_blank" rel="noreferrer"
                  className="contact__social" data-hover title="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {OWNER.socials.facebook && (
                <a href={OWNER.socials.facebook} target="_blank" rel="noreferrer"
                  className="contact__social" data-hover title="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* ── Form ── */}
          <div className="contact__form-wrap reveal-right">
            <h3 className="contact__form-title">{t("contact.formTitle")}</h3>
            <p className="contact__form-sub">
              {t("contact.formSub")}{" "}
              <span style={{ color: "var(--accent)" }}>{OWNER.email}</span>
            </p>

            {status === "success" && (
              <div className="contact__alert contact__alert--success" role="status">
                {t("contact.successAlert")}
              </div>
            )}
            {status === "error" && (
              <div className="contact__alert contact__alert--error" role="alert">
                {t("contact.errorAlert")} {OWNER.email}.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <input type="text" name="_gotcha" className="contact__hp"
                tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="c-name">{t("contact.nameLabel")}</label>
                  <input id="c-name" name="name" type="text" required
                    placeholder={t("contact.namePlaceholder")} autoComplete="name"
                    disabled={status === "loading"} />
                </div>
                <div className="contact__field">
                  <label htmlFor="c-email">{t("contact.emailLabelForm")}</label>
                  <input id="c-email" name="email" type="email" required
                    placeholder={t("contact.emailPlaceholder")} autoComplete="email"
                    disabled={status === "loading"} />
                </div>
              </div>

              <div className="contact__form-row" style={{ marginTop: 16 }}>
                <div className="contact__field">
                  <label htmlFor="c-phone">{t("contact.phoneLabelForm")}</label>
                  <input id="c-phone" name="phone" type="tel"
                    placeholder={t("contact.phonePlaceholder")} autoComplete="tel"
                    disabled={status === "loading"} />
                </div>
                <div className="contact__field">
                  <label htmlFor="c-subject">{t("contact.subjectLabel")}</label>
                  <input id="c-subject" name="subject" type="text" required
                    placeholder={t("contact.subjectPlaceholder")}
                    disabled={status === "loading"} />
                </div>
              </div>

              <div className="contact__field" style={{ marginTop: 16 }}>
                <label htmlFor="c-message">{t("contact.messageLabel")}</label>
                <textarea id="c-message" name="message" required
                  placeholder={t("contact.messagePlaceholder")}
                  disabled={status === "loading"} />
              </div>

              <button
                type="submit"
                className="contact__submit"
                data-hover
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? t("contact.submitLoading")
                  : status === "success"
                    ? t("contact.submitSuccess")
                    : t("contact.submitIdle")}
              </button>
            </form>
          </div>
        </div>

        <p className="contact__note reveal" style={{ transitionDelay: "0.2s" }}>
          © {new Date().getFullYear()}{" "}
          <a href={OWNER.socials.github} target="_blank" rel="noreferrer">
            {OWNER.fullName}
          </a>{" "}
          — {t("contact.footer")}
        </p>
      </div>
    </section>
  );
}
