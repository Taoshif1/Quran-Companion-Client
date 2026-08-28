import { ChevronRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

export function SurahRow({ chapter, downloaded }) {
  return <Link to={`/surah/${chapter.id}`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 font-semibold text-primary">{chapter.id}</span><span className="min-w-0"><span className="flex items-center gap-2"><strong className="truncate">{chapter.nameSimple || chapter.transliteratedName}</strong>{downloaded && <Download size={14} aria-label="Available offline" className="text-primary"/>}</span><span className="text-sm text-base-content/55">{chapter.translatedName || "Official chapter metadata"} · {chapter.versesCount} ayahs · {chapter.revelationPlace}</span></span><span className="flex items-center gap-2"><span className="arabic hidden text-2xl sm:inline" lang="ar" dir="rtl" translate="no">{chapter.nameArabic}</span><ChevronRight size={18} className="text-base-content/35"/></span></Link>;
}

