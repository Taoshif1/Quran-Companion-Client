import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePreferences } from "../../providers/PreferencesProvider";

export function ReaderSettings({ open, onClose, resources }) {
  const { preferences, setPreferences } = usePreferences();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement;
    const keydown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = [...ref.current.querySelectorAll("button,input,select")];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    };
    document.addEventListener("keydown", keydown);
    requestAnimationFrame(() => ref.current?.querySelector("button")?.focus());
    return () => { document.removeEventListener("keydown", keydown); before?.focus(); };
  }, [onClose, open]);
  if (!open) return null;
  const update = (key, value) => setPreferences((current) => ({ ...current, [key]: value }));
  const translations = (language) => resources.filter((item) => item.language === language && item.classification === "translation");
  return <div className="sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside ref={ref} className="sheet reader-settings" role="dialog" aria-modal="true" aria-labelledby="reader-preferences"><div className="sheet-heading"><div><p className="eyebrow">Reading comfort</p><h2 id="reader-preferences">Reader preferences</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X/></button></div>
    <fieldset><legend>Meaning</legend><div className="segmented">{["bn","en","both"].map((mode) => <button key={mode} className={preferences.meaningMode === mode ? "active" : ""} onClick={() => update("meaningMode", mode)}>{mode === "bn" ? "বাংলা" : mode === "en" ? "English" : "Both"}</button>)}</div></fieldset>
    <label>Bangla source<select value={preferences.banglaResourceId} onChange={(event) => update("banglaResourceId", event.target.value)}>{translations("bn").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label>English source<select value={preferences.englishResourceId} onChange={(event) => update("englishResourceId", event.target.value)}>{translations("en").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="setting-toggle"><span><strong>Study mode</strong><small>Brief verified explanation and notes</small></span><input type="checkbox" checked={preferences.studyMode} onChange={(event) => update("studyMode", event.target.checked)}/></label>
    <Range label="Arabic size" value={preferences.arabicSize} min="26" max="56" onChange={(value) => update("arabicSize", value)}/><Range label="Arabic line height" value={preferences.arabicLineHeight} min="1.7" max="2.6" step=".05" onChange={(value) => update("arabicLineHeight", value)}/>
    <p className="source-caption">Arabic: Tanzil v1.1 · Meanings and explanation: QuranEnc. Word Study awaits the official Quranic Arabic Corpus package.</p>
  </aside></div>;
}
function Range({ label, value, onChange, ...props }) { return <label>{label}<span className="range-value">{value}</span><input type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} {...props}/></label>; }
