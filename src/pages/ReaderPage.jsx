import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, ArrowRight, BookOpenText, Download, Eye, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { AyahCard } from "../components/quran/AyahCard";
import { ReaderSettings } from "../components/quran/ReaderSettings";
import { db } from "../db/database";
import { useChapter, useMeaningChapter, useTranslations } from "../hooks/useQuranData";
import { usePreferences } from "../providers/PreferencesProvider";
import { cacheChapterContent } from "../services/library";

export default function ReaderPage() {
  const { chapterId } = useParams();
  const id = Number(chapterId);
  const { preferences, setPreferences } = usePreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jump, setJump] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const arabic = useChapter(id);
  const bnCatalog = useTranslations("bn");
  const enCatalog = useTranslations("en");
  const resources = useMemo(() => [...(bnCatalog.data || []), ...(enCatalog.data || [])], [bnCatalog.data, enCatalog.data]);
  const banglaResource = resources.find((item) => item.id === preferences.banglaResourceId && item.classification === "translation");
  const englishResource = resources.find((item) => item.id === preferences.englishResourceId);
  const tafsirResource = resources.find((item) => item.id === preferences.tafsirResourceId && item.classification === "tafsir");
  const wantBn = preferences.meaningMode === "bn" || preferences.meaningMode === "both";
  const wantEn = preferences.meaningMode === "en" || preferences.meaningMode === "both";
  const bangla = useMeaningChapter(id, wantBn ? banglaResource : null);
  const english = useMeaningChapter(id, wantEn ? englishResource : null);
  const tafsir = useMeaningChapter(id, preferences.studyMode ? tafsirResource : null);
  const bookmarks = useLiveQuery(() => db.bookmarks.where("chapterId").equals(id).toArray(), [id], []);
  const bookmarked = new Set(bookmarks.map((item) => item.verseKey));

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setScrollProgress(height > 0 ? Math.min(100, Math.round(scrollY / height * 100)) : 0);
    };
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  useEffect(() => { if (arabic.data && location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView()); }, [arabic.data]);
  useEffect(() => () => setPreferences((value) => ({ ...value, focusMode: false })), [setPreferences]);

  if (!Number.isInteger(id) || id < 1 || id > 114) return <div className="reader-shell py-16">Choose a Surah numbered 1–114.</div>;
  if (!arabic.data) return <ReaderSkeleton/>;
  const content = arabic.data;
  const byVerse = (query, index) => query.data?.verses[index]?.translation || null;
  const unavailable = (wantBn && bangla.isError) || (wantEn && english.isError);
  const go = (event) => {
    event.preventDefault();
    const verse = Number(jump);
    if (!Number.isInteger(verse) || verse < 1 || verse > content.chapter.versesCount) return toast.error("Enter an ayah from 1 to " + content.chapter.versesCount);
    const hash = "#ayah-" + id + "-" + verse;
    history.replaceState(null, "", hash);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    setJumpOpen(false);
  };
  const downloadMeanings = async () => {
    const selected = [wantBn ? bangla.data : null, wantEn ? english.data : null].filter(Boolean);
    if (!selected.length) return toast.error("Wait for your selected meaning to finish loading");
    await Promise.all(selected.map((item) => cacheChapterContent(item, true)));
    toast.success("Selected meanings are available offline");
  };

  return <>
    <div className="reading-progress" style={{ width: scrollProgress + "%" }}/>
    <header className="reader-toolbar"><div className="reader-toolbar-inner">
      <Link to="/surahs" className="icon-button" aria-label="Back to Surahs"><ArrowLeft/></Link>
      <div className="toolbar-title"><strong>{content.chapter.nameSimple}</strong><span>Surah {id} · {content.chapter.versesCount} ayahs</span></div>
      <button className="toolbar-action" onClick={() => setJumpOpen(!jumpOpen)}><BookOpenText/><span>Jump</span></button>
      <button className="icon-button" onClick={downloadMeanings} aria-label="Download selected meanings"><Download/></button>
      <button className="icon-button" onClick={() => setPreferences((value) => ({ ...value, focusMode: !value.focusMode }))} aria-label="Toggle focus mode"><Eye/></button>
      <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Reader preferences"><Settings/></button>
    </div>{jumpOpen && <form className="jump-panel" onSubmit={go}><label>Jump to Ayah<input autoFocus type="number" min="1" max={content.chapter.versesCount} value={jump} onChange={(event) => setJump(event.target.value)} placeholder={"1–" + content.chapter.versesCount}/></label><button type="submit">Go</button></form>}
    </header>
    <main className="reader-shell">
      <section className="surah-opening"><p>Surah {id}</p><h1 className="arabic" lang="ar" dir="rtl" translate="no">{content.chapter.nameArabic}</h1><h2>{content.chapter.nameSimple}</h2><div>{content.chapter.translatedName} · {content.chapter.revelationPlace} · {content.chapter.versesCount} ayahs</div><small>Arabic · Tanzil Project · Uthmani Quran Text · Version 1.1</small></section>
      {preferences.meaningMode === null && <MeaningChoice onChoose={(meaningMode) => setPreferences((value) => ({ ...value, meaningMode }))}/>}
      {unavailable && <div className="calm-notice">Your selected meaning is temporarily unavailable. The Arabic Quran remains available.</div>}
      {content.verses.map((verse, index) => <AyahCard key={verse.verseKey} verse={verse} chapterName={content.chapter.nameSimple} bookmarked={bookmarked.has(verse.verseKey)} bangla={wantBn ? byVerse(bangla, index) : null} english={wantEn ? byVerse(english, index) : null} explanation={preferences.studyMode ? byVerse(tafsir, index) : null}/>)}
      <nav className="chapter-nav" aria-label="Adjacent Surahs">{id > 1 && <Link to={"/surah/" + (id - 1)}><ArrowLeft/>Previous Surah</Link>}{id < 114 && <Link to={"/surah/" + (id + 1)}>Next Surah<ArrowRight/></Link>}</nav>
    </main>
    <ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} resources={resources}/>
  </>;
}

function MeaningChoice({ onChoose }) {
  return <div className="meaning-choice"><p className="eyebrow">Choose your reading companion</p><h2>Which meanings would you like to read?</h2><div><button onClick={() => onChoose("bn")}>বাংলা</button><button onClick={() => onChoose("en")}>English</button><button onClick={() => onChoose("both")}>Both</button></div><small>This preference is independent of the app language.</small></div>;
}

function ReaderSkeleton() {
  return <div className="reader-shell py-16" aria-label="Opening canonical Quran"><div className="skeleton-line w-1/3"/><div className="skeleton-line mt-6 h-24"/><div className="skeleton-line mt-12 h-40"/></div>;
}
