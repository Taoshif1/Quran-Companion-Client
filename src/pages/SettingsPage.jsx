import { useLiveQuery } from "dexie-react-hooks";
import { BookOpenText, Database, Info, Palette } from "lucide-react";
import { APP_NAME, APP_VERSION } from "../config/app";
import { db } from "../db/database";
import { usePreferences } from "../providers/PreferencesProvider";

export default function SettingsPage() {
  const { preferences, setPreferences } = usePreferences();
  const downloadCount = useLiveQuery(() => db.downloads.count(), [], 0);
  const update = (key, value) => setPreferences((current) => ({ ...current, [key]: value }));
  return <div className="page-shell py-8"><h1 className="text-3xl font-semibold">Settings</h1><p className="mt-2 text-base-content/60">Shape a comfortable reading environment.</p><div className="mt-7 grid gap-5 lg:grid-cols-2"><SettingsSection icon={BookOpenText} title="Reading"><Range label="Arabic font size" value={preferences.arabicSize} min={24} max={54} suffix="px" onChange={(value) => update("arabicSize", value)}/><Range label="Bangla font size" value={preferences.banglaSize} min={14} max={28} suffix="px" onChange={(value) => update("banglaSize", value)}/><label className="mt-5 flex items-center justify-between">Show Bengali translation<input className="toggle toggle-primary" type="checkbox" checked={preferences.showTranslation} onChange={(event) => update("showTranslation", event.target.checked)}/></label></SettingsSection><SettingsSection icon={Palette} title="Appearance"><label>Theme<select className="select select-bordered mt-2 w-full" value={preferences.theme} onChange={(event) => update("theme", event.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option><option value="reading">Reading / Sepia</option></select></label><p className="mt-3 text-sm text-base-content/60">System follows your device and responds when its appearance changes.</p></SettingsSection><SettingsSection icon={Database} title="Offline"><p className="text-base-content/70">{downloadCount} translation-aware Surah {downloadCount === 1 ? "download" : "downloads"} stored on this device.</p><p className="mt-2 text-sm text-base-content/55">Only complete responses accepted by the server are saved. Switching translations never silently substitutes another cached source.</p></SettingsSection><SettingsSection icon={Info} title="About / Data Source"><p className="leading-relaxed text-base-content/75">Quran content source: Quran Foundation / Quran.com.</p><p className="mt-3 leading-relaxed text-base-content/75">Selected Bengali translation: {preferences.translationName}{preferences.translationAuthor ? `, translated by ${preferences.translationAuthor}` : ""}.</p><p className="mt-3 leading-relaxed text-base-content/75">No AI-generated Quran content is used. The application preserves source-provided Arabic and translation strings through its server, cache, and Reader pipeline.</p><p className="mt-4 text-sm text-base-content/50">{APP_NAME} · Version {APP_VERSION}</p></SettingsSection></div></div>;
}

function SettingsSection({ icon: Icon, title, children }) {
  return <section className="rounded-3xl border border-base-300 bg-base-100 p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={20}/></span><h2 className="text-xl font-semibold">{title}</h2></div>{children}</section>;
}

function Range({ label, value, min, max, suffix, onChange }) {
  return <label className="mt-5 block first:mt-0"><span className="flex justify-between"><span>{label}</span><span>{value}{suffix}</span></span><input className="range range-primary mt-2" type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))}/></label>;
}

