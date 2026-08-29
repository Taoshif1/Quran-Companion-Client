import { useLiveQuery } from "dexie-react-hooks";
import { ArrowUpRight, Bookmark, BookOpen, Download, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeControl } from "../components/common/ThemeControl";
import { db } from "../db/database";

const quick = [{ to: "/surahs", label: "Surahs", note: "Browse all 114 chapters", icon: BookOpen }, { to: "/bookmarks", label: "Bookmarks", note: "Return to saved ayahs", icon: Bookmark }, { to: "/offline", label: "Offline", note: "Manage downloaded meanings", icon: Download }, { to: "/settings", label: "Settings", note: "Reading and appearance", icon: Settings }];
export default function HomePage() {
  const progress = useLiveQuery(() => db.readingProgress.get("current"));
  const recent = useLiveQuery(() => db.recentReading.orderBy("timestamp").reverse().limit(5).toArray(), [], []);
  const chapters = useLiveQuery(() => db.chapters.toArray(), [], []);
  const names = new Map(chapters.map((item) => [item.id, item]));
  return <div className="home-page"><div className="page-shell">
    <header className="home-header"><Link to="/" className="wordmark">Quran Companion</Link><ThemeControl/></header>
    <section className="home-intro"><p className="eyebrow">A quieter place to read</p><h1>The Quran, kept at the center.</h1><p>Read the verified Arabic text with carefully sourced meanings, at your own pace.</p></section>
    <section className="continue-panel"><div className="continue-copy"><p className="eyebrow">Continue reading</p>{progress ? <><h2>{progress.chapterName}</h2><p>Ayah {progress.verseNumber} · {relative(progress.updatedAt)}</p></> : <><h2>Begin with a Surah</h2><p>Your reading place will be kept privately on this device.</p></>}</div><Link to={progress ? "/surah/" + progress.chapterId + "#ayah-" + progress.chapterId + "-" + progress.verseNumber : "/surahs"} className="continue-action">{progress ? "Continue" : "Begin reading"}<ArrowUpRight/></Link><div className="progress-cue"><span style={{ width: progress ? Math.max(3, progress.verseNumber / (names.get(progress.chapterId)?.versesCount || 1) * 100) + "%" : "0%" }}/></div></section>
    {recent.length > 0 && <section className="recent"><div className="section-heading"><h2>Recently read</h2><Link to="/surahs">All Surahs</Link></div><div className="recent-list">{recent.map((item) => { const chapter = names.get(item.chapterId); return <Link key={item.chapterId} to={"/surah/" + item.chapterId + "#ayah-" + item.chapterId + "-" + item.lastVerseNumber}><span className="recent-number">{item.chapterId}</span><span><strong>{chapter?.nameSimple || "Surah " + item.chapterId}</strong><small>Ayah {item.lastVerseNumber}</small></span><span className="arabic" lang="ar" dir="rtl" translate="no">{chapter?.nameArabic}</span></Link>; })}</div></section>}
    <section className="quick-access"><h2>Quick access</h2>{quick.map(({to,label,note,icon:Icon}) => <Link key={to} to={to}><Icon/><span><strong>{label}</strong><small>{note}</small></span><ArrowUpRight/></Link>)}</section>
    <footer className="source-note">Canonical Arabic · Tanzil Project · Uthmani Quran Text v1.1</footer>
  </div></div>;
}
function relative(value) { const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000); if (minutes < 60) return Math.max(1, minutes) + "m ago"; if (minutes < 1440) return Math.round(minutes / 60) + "h ago"; return new Date(value).toLocaleDateString(); }
