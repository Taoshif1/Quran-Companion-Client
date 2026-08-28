import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../db/database";

/* oxlint-disable react/only-export-components */

const defaults = { arabicSize: 34, banglaSize: 18, showTranslation: true, theme: "light", translationId: null, translationName: "Not selected" };
const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => { db.settings.get("preferences").then((saved) => { if (saved?.value) setPreferences({ ...defaults, ...saved.value }); setReady(true); }); }, []);
  useEffect(() => { document.documentElement.dataset.theme = preferences.theme; if (ready) db.settings.put({ key: "preferences", value: preferences }); }, [preferences, ready]);
  const value = useMemo(() => ({ preferences, setPreferences, ready }), [preferences, ready]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export const usePreferences = () => useContext(PreferencesContext);
