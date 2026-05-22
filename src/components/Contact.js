import { useEffect, useState } from "react";
import { OWNER } from "../data/portfolioData.js";

const phoneHref = (num) => `tel:${num.replace(/\s/g, "")}`;
const whatsappHref = (num) =>
  `https://wa.me/${num.replace(/\D/g, "")}`;

const css = `
  .contact { position: relative; overflow: hidden; }

  .contact__bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 50% 60% at 20% 80%, rgba(79,195,247,0.06) 0%, transparent 70%);
  }

  .contact__inner { position: relative; z-index: 1; }

  .contact__heading {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(32px, 4vw, 52px); line-height: 1.05;
    letter-spacing: -0.03em; margin-bottom: 12px;
  }
  .contact__heading em { font-style: normal; color: var(--accent); }

  .contact__intro {
    font-size: 15px; line-height: 1.75; color: var(--text-secondary);
    max-width: 520px; margin-bottom: 48px;
  }

  .contact__grid {
    display: grid; grid-template-columns: 1fr 1.1fr;
    gap: 40px; align-items: start;
  }

  .contact__info { display: flex; flex-direction: column; gap: 14px; }

  .contact__card {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 20px 22px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 16px;
    transition: all 0.3s var(--ease-out);
    text-decoration: none; color: inherit;
  }
  a.contact__card:hover {
    border-color: var(--border-glow);
    transform: translateX(4px);
    background: var(--bg-card);
  }

  .contact__card-icon {
    width: 44px; height: 44px; flex-shrink: 0;
    border-radius: 12px;
    background: var(--accent-dim); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .contact__card-label {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 4px;
  }
  .contact__card-value {
    font-size: 14px; font-weight: 500; color: var(--text-primary);
    line-height: 1.5;
  }
  a.contact__card .contact__card-value { color: var(--accent); }

  .contact__socials {
    display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap;
  }
  .contact__social {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--bg-elevated); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--silver-200);
    transition: all 0.25s var(--ease-out);
  }
  .contact__social:hover {
    border-color: var(--border-glow); background: var(--accent-dim);
    color: var(--accent); transform: translateY(-3px);
  }

  .contact__form-wrap {
    background: var(--bg-elevated); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px;
  }

  .contact__form-title {
    font-family: var(--font-display); font-size: 18px; font-weight: 700;
    margin-bottom: 6px;
  }
  .contact__form-sub {
    font-size: 13px; color: var(--text-muted); margin-bottom: 24px;
  }

  .contact__field { margin-bottom: 18px; }
  .contact__field label {
    display: block;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 8px;
  }
  .contact__field input,
  .contact__field textarea {
    width: 100%;
    padding: 14px 16px;
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: 12px; color: var(--text-primary);
    font-family: var(--font-body); font-size: 14px;
    transition: border-color 0.25s, box-shadow 0.25s;
    resize: vertical;
  }
  .contact__field input:focus,
  .contact__field textarea:focus {
    outline: none;
    border-color: var(--border-glow);
    box-shadow: 0 0 0 3px var(--accent-dim);
  }
  .contact__field textarea { min-height: 120px; }

  .contact__submit {
    width: 100%;
    padding: 14px 24px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--violet) 100%);
    color: var(--bg-void);
    font-family: var(--font-mono); font-size: 12px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.3s var(--ease-out);
  }
  .contact__submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(79,195,247,0.35);
  }
  .contact__submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .contact__form-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }
  .contact__form-row .contact__field { margin-bottom: 0; }
  .contact__form-row + .contact__field,
  .contact__form-row + .contact__form-row { margin-top: 18px; }

  .contact__hp {
    position: absolute; left: -9999px; width: 1px; height: 1px;
    opacity: 0; pointer-events: none;
  }

  .contact__alert {
    padding: 14px 16px; border-radius: 12px; margin-bottom: 20px;
    font-size: 13px; line-height: 1.6;
  }
  .contact__alert--success {
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.35);
    color: #4ade80;
  }
  .contact__alert--error {
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.35);
    color: #f87171;
  }

  .contact__note {
    margin-top: 40px; text-align: center;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.08em; color: var(--text-muted);
  }

  @media (max-width: 900px) {
    .contact__grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .contact__form-row { grid-template-columns: 1fr; }
    .contact__form-row .contact__field { margin-bottom: 18px; }
    .contact__form-row .contact__field:last-child { margin-bottom: 0; }
  }
`;

const FORM_ENDPOINT = `https://formsubmit.co/ajax/${OWNER.email}`;

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    if (!document.getElementById("contact-css")) {
      const s = document.createElement("style");
      s.id = "contact-css";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);

    if (fd.get("_gotcha")) return;

    setStatus("loading");

    const name = fd.get("name")?.toString().trim();
    const email = fd.get("email")?.toString().trim();
    const phone = fd.get("phone")?.toString().trim() || "Non renseigné";
    const subject = fd.get("subject")?.toString().trim() || "Contact portfolio";
    const message = fd.get("message")?.toString().trim();

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message,
          _subject: `Portfolio — ${subject}`,
          _replyto: email,
          _template: "table",
          _captcha: "false",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false") {
        throw new Error("send_failed");
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="contact__bg" />
      <div className="container contact__inner">
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
              04 / Contact
            </span>
            <div style={{ height: 1, width: 80, background: "var(--border)" }} />
          </div>
        </div>

        <h2 className="contact__heading reveal-left">
          Restons en <em>contact</em>
        </h2>
        <p className="contact__intro reveal" style={{ transitionDelay: "0.08s" }}>
          Un projet, une opportunité ou une simple question ? Contactez-moi par
          e-mail, téléphone ou WhatsApp — je vous répondrai dans les meilleurs délais.
        </p>

        <div className="contact__grid">
          <div className="contact__info reveal-left">
            <a href={`mailto:${OWNER.email}`} className="contact__card" data-hover>
              <div className="contact__card-icon">✉️</div>
              <div>
                <div className="contact__card-label">E-mail</div>
                <div className="contact__card-value">{OWNER.email}</div>
              </div>
            </a>

            <a href={phoneHref(OWNER.phone)} className="contact__card" data-hover>
              <div className="contact__card-icon">📞</div>
              <div>
                <div className="contact__card-label">Téléphone</div>
                <div className="contact__card-value">{OWNER.phone}</div>
              </div>
            </a>

            <a
              href={whatsappHref(OWNER.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="contact__card"
              data-hover
            >
              <div className="contact__card-icon">💬</div>
              <div>
                <div className="contact__card-label">WhatsApp</div>
                <div className="contact__card-value">{OWNER.whatsapp}</div>
              </div>
            </a>

            <div className="contact__card">
              <div className="contact__card-icon">📍</div>
              <div>
                <div className="contact__card-label">Localisation</div>
                <div className="contact__card-value">{OWNER.location}</div>
              </div>
            </div>

            <div className="contact__socials">
              {OWNER.socials.github && (
                <a
                  href={OWNER.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="contact__social"
                  data-hover
                  title="GitHub"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              )}
              {OWNER.socials.linkedin && (
                <a
                  href={OWNER.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="contact__social"
                  data-hover
                  title="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {OWNER.socials.facebook && (
                <a
                  href={OWNER.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="contact__social"
                  data-hover
                  title="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="contact__form-wrap reveal-right">
            <h3 className="contact__form-title">Envoyer un message</h3>
            <p className="contact__form-sub">
              Remplissez le formulaire : le message arrive directement sur{" "}
              <span style={{ color: "var(--accent)" }}>{OWNER.email}</span>.
            </p>

            {status === "success" && (
              <div className="contact__alert contact__alert--success" role="status">
                Message envoyé avec succès. Je vous répondrai dans les meilleurs délais.
              </div>
            )}
            {status === "error" && (
              <div className="contact__alert contact__alert--error" role="alert">
                Envoi impossible pour le moment. Veuillez réessayer ou me contacter
                directement à {OWNER.email}.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="_gotcha"
                className="contact__hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="contact__form-row">
                <div className="contact__field">
                  <label htmlFor="contact-name">Nom complet *</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Ex. Jean Rakoto"
                    autoComplete="name"
                    disabled={status === "loading"}
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="contact-email">Votre e-mail *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="contact__form-row" style={{ marginTop: 18 }}>
                <div className="contact__field">
                  <label htmlFor="contact-phone">Téléphone</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="+261 34 00 000 00"
                    autoComplete="tel"
                    disabled={status === "loading"}
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="contact-subject">Sujet *</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Ex. Proposition de stage"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="contact__field" style={{ marginTop: 18 }}>
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  placeholder="Décrivez votre projet, votre demande ou votre question..."
                  disabled={status === "loading"}
                />
              </div>

              <button
                type="submit"
                className="contact__submit"
                data-hover
                disabled={status === "loading"}
                style={{ marginTop: 8 }}
              >
                {status === "loading"
                  ? "Envoi en cours..."
                  : status === "success"
                    ? "Envoyer un autre message"
                    : "Envoyer le message →"}
              </button>
            </form>
          </div>
        </div>

        <p className="contact__note reveal">
          © {new Date().getFullYear()} {OWNER.fullName} — Portfolio développeur
        </p>
      </div>
    </section>
  );
}
