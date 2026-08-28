import { useLiveQuery } from "dexie-react-hooks";
import { BookmarkX, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/PageState";
import { db } from "../db/database";

export default function BookmarksPage() {
  const bookmarks = useLiveQuery(() => db.bookmarks.orderBy("createdAt").reverse().toArray(), [], []);
  const chapters = useLiveQuery(() => db.chapters.toArray(), [], []);
  return <div className="page-shell py-8"><h1 className="text-3xl font-semibold">Bookmarks</h1><p className="mt-2 text-base-content/60">Saved locally on this device.</p>{bookmarks.length ? <div className="mt-7 grid gap-3">{bookmarks.map((bookmark) => { const chapter = chapters.find((item) => item.id === bookmark.chapterId); return <div key={bookmark.verseKey} className="flex items-center rounded-2xl border border-base-300 bg-base-100 p-3"><Link className="flex min-h-12 flex-1 items-center justify-between px-2" to={`/surah/${bookmark.chapterId}#ayah-${bookmark.verseKey.replace(":", "-")}`}><span><span className="text-xs uppercase tracking-wider text-primary">Surah {bookmark.chapterId}</span><strong className="mt-1 block">{chapter?.nameSimple || `Surah ${bookmark.chapterId}`} · Ayah {bookmark.verseNumber}</strong></span><ChevronRight/></Link><button className="btn btn-circle btn-ghost text-error" onClick={() => db.bookmarks.delete(bookmark.verseKey)} aria-label={`Remove bookmark ${bookmark.verseKey}`}><BookmarkX size={19}/></button></div>; })}</div> : <div className="mt-8"><EmptyState title="No bookmarks yet" message="Bookmark an ayah in the Reader and it will appear here."/></div>}</div>;
}
