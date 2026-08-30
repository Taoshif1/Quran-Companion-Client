import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { databaseReady, db } from "../db/database";

/* oxlint-disable react/only-export-components */

const defaults = { arabicSize: 38, banglaSize: 18, englishSize: 17, arabicLineHeight: 2.15, banglaLineHeight: 1.85, meaningMode: null, theme: "system", focusMode: false, studyMode: false, banglaResourceId: "bengali_zakaria", englishResourceId: "english_saheeh", tafsirResourceId: "bengali_mokhtasar" };
const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => { databaseReady.then(() => db.settings.get("preferences")).then((saved) => { if (saved?.value) setPreferences({ ...defaults, ...saved.value }); }).catch(() => undefined).finally(() => setReady(true)); }, []);
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
