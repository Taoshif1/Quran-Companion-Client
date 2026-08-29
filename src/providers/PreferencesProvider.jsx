import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../db/database";

/* oxlint-disable react/only-export-components */

const defaults = { arabicSize: 36, banglaSize: 18, arabicLineHeight: 2.05, banglaLineHeight: 1.8, showTranslation: true, theme: "system", focusMode: false, translationId: null, translationName: "Not selected", translationAuthor: null, translationVersion: null, translationClassification: null };
const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => { db.settings.get("preferences").then((saved) => { if (saved?.value) setPreferences({ ...defaults, ...saved.value }); setReady(true); }); }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => { document.documentElement.dataset.theme = preferences.theme === "system" ? (media.matches ? "qc-dark" : "qc-light") : preferences.theme === "dark" ? "qc-dark" : preferences.theme === "light" ? "qc-light" : "reading"; };
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [preferences.theme]);
  useEffect(() => { if (ready) db.settings.put({ key: "preferences", value: preferences }); }, [preferences, ready]);
  const value = useMemo(() => ({ preferences, setPreferences, ready }), [preferences, ready]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export const usePreferences = () => useContext(PreferencesContext);
