import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/PageState";
import { db } from "../db/database";

export default function OfflinePage() {
  const downloads = useLiveQuery(() => db.downloads.orderBy("downloadedAt").reverse().toArray(), [], []);
  const removeDownload = async (download) => {
    await db.downloads.delete([download.chapterId, download.translationId, download.translationVersion]);
    await db.chapterContent.delete([download.chapterId, download.translationId, download.translationVersion]);
  };

  return <div className="page-shell py-8"><div className="flex items-center gap-3"><Download className="text-primary"/><div><h1 className="text-3xl font-semibold">Offline library</h1><p className="mt-1 text-base-content/60">Your reading library for moments without a connection.</p></div></div>{downloads.length ? <div className="mt-7 grid gap-4">{downloads.map((item) => <article key={`${item.chapterId}-${item.translationId}`} className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-primary">Surah {item.chapterId}</p><h2 className="mt-1 text-xl font-semibold">{item.chapterName || `Surah ${item.chapterId}`}</h2><p className="mt-2 text-sm text-base-content/65">Bengali: {item.translationName}{item.translationAuthor ? ` · ${item.translationAuthor}` : ""}</p><p className="mt-1 text-xs text-base-content/50">Downloaded {new Date(item.downloadedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</p></div><span className="badge badge-success badge-outline gap-1"><span aria-hidden="true">●</span>Offline</span></div><div className="mt-5 flex gap-2"><Link className="btn btn-primary flex-1 gap-2" to={`/surah/${item.chapterId}`}><BookOpen size={17}/>Open Surah</Link><button className="btn btn-square btn-ghost text-error" aria-label={`Remove ${item.chapterName || `Surah ${item.chapterId}`} offline download`} onClick={() => removeDownload(item)}><Trash2 size={18}/></button></div></article>)}</div> : <div className="mt-8"><EmptyState title="Nothing downloaded yet" message="Open a Surah and choose Download for Offline."/></div>}</div>;
}
