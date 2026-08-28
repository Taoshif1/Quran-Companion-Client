import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight, Bookmark, BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_DESCRIPTION, APP_NAME } from "../config/app";
import { db } from "../db/database";

export default function HomePage() {
  const progress = useLiveQuery(() => db.readingProgress.get("current"));
  const bookmarkCount = useLiveQuery(() => db.bookmarks.count(), [], 0);
  const downloadCount = useLiveQuery(() => db.downloads.count(), [], 0);
  const cards = [
    { to: "/surahs", icon: BookOpen, title: "Browse Surahs", detail: "Find a chapter and begin reading" },
    { to: "/bookmarks", icon: Bookmark, title: "Bookmarks", detail: `${bookmarkCount} saved ayahs` },
    { to: "/offline", icon: Download, title: "Offline library", detail: `${downloadCount} downloaded Surahs` },
  ];

  return <div className="subtle-grid min-h-[calc(100dvh-4.5rem)] py-8 md:py-14"><div className="page-shell"><section className="rounded-[2rem] bg-primary p-7 text-primary-content shadow-xl md:p-12"><p className="text-sm uppercase tracking-[.2em] text-primary-content/65">Your reading space</p><h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{APP_NAME}</h1><p className="mt-3 max-w-xl text-primary-content/70">{APP_DESCRIPTION}</p></section><section className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6"><p className="text-sm font-medium text-base-content/55">Continue Reading</p>{progress ? <Link to={`/surah/${progress.chapterId}#ayah-${progress.verseKey.replace(":", "-")}`} className="mt-3 flex items-center justify-between rounded-2xl bg-base-200 p-4 transition hover:bg-base-300"><span><strong className="block text-lg">{progress.chapterName}</strong><span className="text-sm text-base-content/60">Ayah {progress.verseNumber} · {formatRelativeTime(progress.updatedAt)}</span></span><ArrowRight/></Link> : <Link to="/surahs" className="mt-3 flex items-center justify-between rounded-2xl bg-base-200 p-4"><span><strong className="block">Begin reading</strong><span className="text-sm text-base-content/60">Choose a Surah to start</span></span><ArrowRight/></Link>}</section><div className="mt-6 grid gap-4 md:grid-cols-3">{cards.map(({to,icon:Icon,title,detail}) => <Link key={to} to={to} className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><Icon className="text-primary"/><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-base-content/60">{detail}</p></Link>)}</div></div></div>;
}

function formatRelativeTime(value) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
}
