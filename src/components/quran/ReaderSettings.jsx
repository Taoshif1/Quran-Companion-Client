import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePreferences } from "../../providers/PreferencesProvider";

export function ReaderSettings({ open, onClose, resources = [] }) {
  const { preferences, setPreferences } = usePreferences();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    panelRef.current?.querySelector("button, input, select")?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = [...panelRef.current.querySelectorAll("button, input, select")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); previousFocus?.focus(); };
  }, [onClose, open]);

  if (!open) return null;
  const update = (key, value) => setPreferences((current) => ({ ...current, [key]: value }));
  const selectTranslation = (id) => {
    const selected = resources.find((item) => item.id === id);
    if (selected) setPreferences((current) => ({ ...current, translationId: selected.id, translationName: selected.name, translationAuthor: selected.authorName || null, translationVersion: selected.version, translationClassification: selected.classification }));
  };

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral/55 p-3 backdrop-blur-sm sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={panelRef} className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-base-100 p-6 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="reader-settings-title">
      <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-primary">Reading comfort</p><h2 id="reader-settings-title" className="mt-1 text-xl font-semibold">Reader settings</h2></div><button className="btn btn-circle btn-ghost" onClick={onClose} aria-label="Close reader settings"><X/></button></div>
      <div className="mt-6 grid gap-6">
        <RangeSetting label="Arabic font size" value={preferences.arabicSize} min={24} max={54} suffix="px" onChange={(value) => update("arabicSize", value)}/>
        <RangeSetting label="Arabic line height" value={preferences.arabicLineHeight} min={1.6} max={2.5} step={0.05} onChange={(value) => update("arabicLineHeight", value)}/>
        <RangeSetting label="Bangla font size" value={preferences.banglaSize} min={14} max={28} suffix="px" onChange={(value) => update("banglaSize", value)}/>
        <RangeSetting label="Bangla line height" value={preferences.banglaLineHeight} min={1.4} max={2.2} step={0.05} onChange={(value) => update("banglaLineHeight", value)}/>
        <label className="flex items-center justify-between rounded-2xl bg-base-200 p-4"><span>Show Bengali meaning</span><input className="toggle toggle-primary" type="checkbox" checked={preferences.showTranslation} onChange={(event) => update("showTranslation", event.target.checked)}/></label>
        <label><span className="text-sm font-medium">Bengali meaning</span><select className="select select-bordered mt-2 w-full" value={preferences.translationId || ""} onChange={(event) => selectTranslation(event.target.value)} disabled={!resources.length}><option value="">{resources.length ? "Select a resource" : "Temporarily unavailable"}</option>{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name} · {resource.classification === "tafsir" ? "Tafsir" : "Translation"}</option>)}</select><span className="mt-2 block text-sm text-base-content/60">Source: QuranEnc{preferences.translationVersion ? ` · Version ${preferences.translationVersion}` : ""}</span></label>
        <label><span className="text-sm font-medium">Theme</span><select className="select select-bordered mt-2 w-full" value={preferences.theme} onChange={(event) => update("theme", event.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option><option value="reading">Reading / Sepia</option></select></label>
        <button className="btn btn-outline w-full" onClick={() => update("focusMode", !preferences.focusMode)}>{preferences.focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}</button>
      </div>
    </div>
  </div>;
}

function RangeSetting({ label, value, min, max, step = 1, suffix = "", onChange }) {
  return <label><span className="flex justify-between text-sm font-medium"><span>{label}</span><span>{value}{suffix}</span></span><input className="range range-primary mt-3" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))}/></label>;
}
