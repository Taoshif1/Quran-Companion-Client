import { useLiveQuery } from "dexie-react-hooks";
import { Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/PageState";
import { db } from "../db/database";

export default function OfflinePage() {
  const downloads = useLiveQuery(() => db.downloads.toArray(), [], []);
  const chapters = useLiveQuery(() => db.chapters.toArray(), [], []);
  return <div className="page-shell py-8"><div className="flex items-center gap-3"><Download className="text-primary"/><h1 className="text-3xl font-semibold">Offline library</h1></div><p className="mt-2 text-base-content/60">Downloaded Quran content is stored in IndexedDB, independently of the application shell.</p>{downloads.length ? <div className="mt-7 grid gap-3">{downloads.map((item) => { const chapter = chapters.find((entry) => entry.id === item.chapterId); return <div key={item.chapterId} className="flex items-center rounded-2xl border border-base-300 bg-base-100 p-4"><Link className="flex-1 font-semibold" to={`/surah/${item.chapterId}`}>{chapter?.nameSimple || `Surah ${item.chapterId}`}</Link><button className="btn btn-circle btn-ghost text-error" aria-label={`Remove Surah ${item.chapterId} offline download`} onClick={async () => { await db.downloads.delete(item.chapterId); const records = await db.chapterContent.where("chapterId").equals(item.chapterId).toArray(); await db.chapterContent.bulkDelete(records.map((record) => [record.chapterId, record.translationId])); }}><Trash2 size={18}/></button></div>; })}</div> : <div className="mt-8"><EmptyState title="Nothing downloaded yet" message="Open a Surah and choose Download for Offline."/></div>}</div>;
}

