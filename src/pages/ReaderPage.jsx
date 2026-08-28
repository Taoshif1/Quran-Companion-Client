import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, ArrowRight, Download, Eye, Settings } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { getApiMessage } from "../api/client";
import { ThemeControl } from "../components/common/ThemeControl";
import { EmptyState, LoadingState } from "../components/common/PageState";
import { AyahCard } from "../components/quran/AyahCard";
import { ReaderSettings } from "../components/quran/ReaderSettings";
import { db } from "../db/database";
import { useChapter, useTranslations } from "../hooks/useQuranData";
import { usePreferences } from "../providers/PreferencesProvider";
import { cacheChapterContent } from "../services/library";

export default function ReaderPage() {
  const { chapterId } = useParams();
  const numericChapterId = Number(chapterId);
  const validChapter = Number.isInteger(numericChapterId) && numericChapterId >= 1 && numericChapterId <= 114;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");
  const { preferences, setPreferences, ready } = usePreferences();
  const translationQuery = useTranslations();
  const resources = useMemo(() => translationQuery.data || [], [translationQuery.data]);
  const chapterQuery = useChapter(chapterId, preferences.translationId);
  const bookmarks = useLiveQuery(() => db.bookmarks.where("chapterId").equals(numericChapterId).toArray(), [numericChapterId], []);
  const download = useLiveQuery(() => preferences.translationId ? db.downloads.get([numericChapterId, preferences.translationId]) : undefined, [numericChapterId, preferences.translationId]);
  const bookmarked = new Set(bookmarks.map((item) => item.verseKey));
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  useEffect(() => {
    if (ready && !preferences.translationId && resources.length) {
      const selected = resources[0];
      setPreferences((current) => ({ ...current, translationId: selected.id, translationName: selected.name || "Official Bengali translation", translationAuthor: selected.authorName || null }));
    }
  }, [preferences.translationId, ready, resources, setPreferences]);
  useEffect(() => {
    if (chapterQuery.data && location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
  }, [chapterQuery.data]);
  useEffect(() => () => setPreferences((current) => ({ ...current, focusMode: false })), [setPreferences]);

  if (!validChapter) return <div className="reader-shell py-10"><EmptyState title="Invalid chapter" message="Choose a Surah numbered from 1 to 114."/></div>;
  if ((translationQuery.isLoading || chapterQuery.isLoading) && !chapterQuery.data) return <div className="reader-shell"><LoadingState/></div>;
  if (!resources.length && translationQuery.isSuccess) return <div className="reader-shell py-10"><EmptyState title="No Bengali translation available" message="The official source returned no Bengali translation resources."/></div>;
  if (translationQuery.isError || chapterQuery.isError) return <div className="reader-shell py-10"><EmptyState title="Reader unavailable" message={getApiMessage(chapterQuery.error || translationQuery.error)} offline={!navigator.onLine}/></div>;
  const content = chapterQuery.data;
  if (!content) return null;

  const jumpToAyah = (event) => {
    event.preventDefault();
    const verseNumber = Number(jumpValue);
    if (!Number.isInteger(verseNumber) || verseNumber < 1 || verseNumber > content.chapter.versesCount) {
      toast.error(`Enter an ayah from 1 to ${content.chapter.versesCount}`);
      return;
    }
    const hash = `#ayah-${numericChapterId}-${verseNumber}`;
    history.replaceState(null, "", hash);
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const downloadForOffline = async () => {
    try {
      await cacheChapterContent(content, true);
      toast.success("Surah and selected translation are available offline");
    } catch {
      toast.error("Could not complete the offline download");
    }
  };

  return <><header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 shadow-sm backdrop-blur"><div className="reader-shell flex min-h-18 items-center gap-2"><Link to="/surahs" className="btn btn-circle btn-ghost" aria-label="Back to Surahs"><ArrowLeft/></Link><div className="min-w-0 flex-1"><div className="flex items-baseline gap-2"><span className="text-xs font-semibold text-primary">{content.chapter.id}</span><h1 className="truncate font-semibold">{content.chapter.nameSimple}</h1><span className="arabic hidden text-lg text-primary sm:inline" lang="ar" dir="rtl" translate="no">{content.chapter.nameArabic}</span></div><p className="truncate text-xs text-base-content/60">{content.chapter.revelationPlace} · {content.chapter.versesCount} ayahs · {content.translationResource.name}</p></div><ThemeControl/><button className="btn btn-circle btn-ghost" onClick={() => setPreferences((value) => ({ ...value, focusMode: !value.focusMode }))} aria-label={preferences.focusMode ? "Exit focus mode" : "Enter focus mode"}><Eye size={19}/></button><button className="btn btn-circle btn-ghost" onClick={() => setSettingsOpen(true)} aria-label="Open reader settings"><Settings/></button></div><div className="reader-shell flex items-center justify-between gap-3 pb-3"><span className={`badge gap-2 ${download ? "badge-success badge-outline" : "badge-ghost"}`}><span aria-hidden="true">{download ? "●" : "○"}</span>{download ? "Available Offline" : "Online only"}</span><button className="btn btn-sm btn-ghost gap-2" disabled={Boolean(download)} onClick={downloadForOffline}><Download size={16}/>{download ? "Downloaded" : "Download for Offline"}</button></div></header><div className="reader-shell"><section className="py-10 text-center md:py-14"><p className="text-xs uppercase tracking-[.2em] text-primary">Surah {content.chapter.id}</p><p className="arabic mt-3 text-4xl text-primary md:text-5xl" lang="ar" dir="rtl" translate="no">{content.chapter.nameArabic}</p><h2 className="mt-3 text-xl font-semibold">{content.chapter.nameSimple}</h2><p className="mt-2 text-sm text-base-content/60">Bengali: {content.translationResource.name}{content.translationResource.authorName ? ` · ${content.translationResource.authorName}` : ""}</p><form className="mx-auto mt-7 flex max-w-xs gap-2" onSubmit={jumpToAyah}><label className="input input-bordered flex min-w-0 flex-1 items-center"><span className="sr-only">Jump to ayah</span><input type="number" min="1" max={content.chapter.versesCount} value={jumpValue} onChange={(event) => setJumpValue(event.target.value)} placeholder={`Ayah 1–${content.chapter.versesCount}`} aria-label="Ayah number"/></label><button className="btn btn-primary" type="submit">Jump</button></form></section>{content.verses.map((verse) => <AyahCard key={verse.verseKey} verse={verse} chapterName={content.chapter.nameSimple} bookmarked={bookmarked.has(verse.verseKey)}/>) }<nav className="grid gap-3 py-10 sm:grid-cols-2" aria-label="Adjacent Surahs">{numericChapterId > 1 && <Link className="btn btn-outline justify-start" to={`/surah/${numericChapterId - 1}`}><ArrowLeft size={18}/>Previous Surah</Link>}{numericChapterId < 114 && <Link className="btn btn-outline justify-end sm:col-start-2" to={`/surah/${numericChapterId + 1}`}>Next Surah<ArrowRight size={18}/></Link>}</nav></div><ReaderSettings open={settingsOpen} onClose={closeSettings} resources={resources}/></>;
}
