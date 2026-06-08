import { createContext, useContext, useState, useEffect } from "react";
import translations from "./data/translations.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("portfolio-lang") || "fr";
  });

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "fr" ? "en" : "fr"));

  const t = (path) => {
    const keys = path.split(".");
    let value = translations[lang];
    for (const key of keys) {
      if (value == null) return path;
      value = value[key];
    }
    return value ?? path;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
