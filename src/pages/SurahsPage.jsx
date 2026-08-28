import { useLiveQuery } from "dexie-react-hooks";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { getApiMessage } from "../api/client";
import { EmptyState, LoadingState } from "../components/common/PageState";
import { SurahRow } from "../components/quran/SurahRow";
import { db } from "../db/database";
import { useChapters } from "../hooks/useQuranData";

export default function SurahsPage() {
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState("all");
  const query = useChapters();
  const cached = useLiveQuery(() => db.chapters.toArray(), [], []);
  const downloads = useLiveQuery(() => db.downloads.toArray(), [], []);
  const chapters = query.data || cached;
  const downloaded = new Set(downloads.map((item) => item.chapterId));
  const filtered = useMemo(() => chapters.filter((chapter) => {
    const needle = search.toLowerCase().trim();
    const matchesSearch = !needle || String(chapter.id) === needle || [chapter.nameSimple, chapter.transliteratedName, chapter.translatedName].some((name) => name?.toLowerCase().includes(needle));
    return matchesSearch && (place === "all" || chapter.revelationPlace?.toLowerCase() === place);
  }), [chapters, place, search]);

  return <div className="page-shell py-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-widest text-primary">114 chapters</p><h1 className="mt-1 text-3xl font-semibold">Surahs</h1></div>{!navigator.onLine && <span className="badge badge-warning">Offline</span>}</div><div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="input input-bordered flex w-full items-center gap-2"><Search size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by number or name" aria-label="Search Surahs"/></label><select className="select select-bordered" value={place} onChange={(event) => setPlace(event.target.value)} aria-label="Filter by revelation place"><option value="all">All revelation places</option><option value="makkah">Meccan</option><option value="madinah">Medinan</option></select></div>{query.isLoading && !chapters.length ? <LoadingState/> : query.isError && !chapters.length ? <div className="mt-8"><EmptyState title="Quran content unavailable" message={getApiMessage(query.error)} offline={!navigator.onLine}/></div> : <div className="mt-6 grid gap-3">{filtered.map((chapter) => <SurahRow key={chapter.id} chapter={chapter} downloaded={downloaded.has(chapter.id)}/>)}</div>}</div>;
}

