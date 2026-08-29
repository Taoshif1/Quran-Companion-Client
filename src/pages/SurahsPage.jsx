import { useLiveQuery } from "dexie-react-hooks";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getApiMessage } from "../api/client";
import { EmptyState, LoadingState } from "../components/common/PageState";
import { SurahRow } from "../components/quran/SurahRow";
import { db } from "../db/database";
import { useChapters } from "../hooks/useQuranData";
export default function SurahsPage() {
  const [search, setSearch] = useState(""); const [place, setPlace] = useState("all"); const query = useChapters();
  const cached = useLiveQuery(() => db.chapters.toArray(), [], []); const downloads = useLiveQuery(() => db.downloads.toArray(), [], []);
  const chapters = query.data || cached; const downloaded = new Set(downloads.map((item) => item.chapterId));
  const filtered = useMemo(() => chapters.filter((chapter) => { const needle = normalize(search); const matches = !needle || String(chapter.id) === needle || [chapter.nameSimple, chapter.transliteratedName, chapter.translatedName, chapter.nameArabic].some((name) => normalize(name).includes(needle)); return matches && (place === "all" || chapter.revelationPlace?.toLowerCase() === place); }), [chapters, place, search]);
  return <div className="surahs-page page-shell"><header className="page-intro"><p className="eyebrow">The Noble Quran · 114 chapters</p><h1>Choose a Surah</h1><p>Browse by name, number, meaning, or place of revelation.</p></header><div className="surah-controls"><label className="search-field"><Search/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Surahs" aria-label="Search Surahs"/></label><div className="segmented" aria-label="Revelation place">{[["all","All"],["makkah","Meccan"],["madinah","Medinan"]].map(([value,label]) => <button key={value} className={place === value ? "active" : ""} onClick={() => setPlace(value)}>{label}</button>)}</div></div>{query.isLoading && !chapters.length ? <LoadingState/> : query.isError && !chapters.length ? <EmptyState title="Quran content unavailable" message={getApiMessage(query.error)} offline={!navigator.onLine}/> : <div className="surah-list">{filtered.map((chapter) => <SurahRow key={chapter.id} chapter={chapter} downloaded={downloaded.has(chapter.id)}/>)}</div>}</div>;
}
function normalize(value = "") { return value.toLowerCase().trim().replace(/^al[-\s]/, "").replace(/[^\p{L}\p{N}]+/gu, ""); }
