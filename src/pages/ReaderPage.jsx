import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { getApiMessage } from "../api/client";
import { EmptyState, LoadingState } from "../components/common/PageState";
import { AyahCard } from "../components/quran/AyahCard";
import { ReaderSettings } from "../components/quran/ReaderSettings";
import { db } from "../db/database";
import { useChapter, useTranslations } from "../hooks/useQuranData";
import { usePreferences } from "../providers/PreferencesProvider";
import { cacheChapterContent } from "../services/library";

export default function ReaderPage() {
  const { chapterId } = useParams();
  const validChapter = Number.isInteger(Number(chapterId)) && Number(chapterId) >= 1 && Number(chapterId) <= 114;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { preferences, setPreferences, ready } = usePreferences();
  const translationQuery = useTranslations();
  const resources = useMemo(() => translationQuery.data || [], [translationQuery.data]);
  useEffect(() => { if (ready && !preferences.translationId && resources.length) { const selected = resources[0]; setPreferences((current) => ({ ...current, translationId: selected.id, translationName: selected.name || selected.authorName || "Official Bengali translation" })); } }, [preferences.translationId, ready, resources, setPreferences]);
  const chapterQuery = useChapter(chapterId, preferences.translationId);
  const bookmarks = useLiveQuery(() => db.bookmarks.where("chapterId").equals(Number(chapterId)).toArray(), [chapterId], []);
  const bookmarked = new Set(bookmarks.map((item) => item.verseKey));
  useEffect(() => { if (chapterQuery.data && location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView()); }, [chapterQuery.data]);

  if (!validChapter) return <div className="reader-shell py-10"><EmptyState title="Invalid chapter" message="Choose a Surah numbered from 1 to 114."/></div>;
  if ((translationQuery.isLoading || chapterQuery.isLoading) && !chapterQuery.data) return <div className="reader-shell"><LoadingState/></div>;
  if (!resources.length && translationQuery.isSuccess) return <div className="reader-shell py-10"><EmptyState title="No Bengali translation available" message="The official source returned no Bengali translation resources."/></div>;
  if (translationQuery.isError || chapterQuery.isError) return <div className="reader-shell py-10"><EmptyState title="Reader unavailable" message={getApiMessage(chapterQuery.error || translationQuery.error)} offline={!navigator.onLine}/></div>;
  const content = chapterQuery.data;
  if (!content) return null;

  return <><header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/90 backdrop-blur"><div className="reader-shell flex min-h-18 items-center gap-3"><Link to="/surahs" className="btn btn-circle btn-ghost" aria-label="Back to Surahs"><ArrowLeft/></Link><div className="min-w-0 flex-1"><h1 className="truncate font-semibold">{content.chapter.nameSimple}</h1><p className="text-xs text-base-content/55">{content.chapter.revelationPlace} · {content.chapter.versesCount} ayahs</p></div><button className="btn btn-ghost gap-2" onClick={async () => { await cacheChapterContent(content, true); toast.success("Surah downloaded for offline reading"); }}><Download size={18}/><span className="hidden sm:inline">Offline</span></button><button className="btn btn-circle btn-ghost" onClick={() => setSettingsOpen(true)} aria-label="Open reader settings"><Settings/></button></div></header><div className="reader-shell"><section className="py-10 text-center"><p className="arabic text-4xl text-primary" lang="ar" dir="rtl" translate="no">{content.chapter.nameArabic}</p><p className="mt-2 text-sm text-base-content/55">Translation: {content.translationResource.name || content.translationResource.authorName}</p></section>{content.verses.map((verse) => <AyahCard key={verse.verseKey} verse={verse} chapterName={content.chapter.nameSimple} bookmarked={bookmarked.has(verse.verseKey)}/>)}</div><ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} resources={resources}/></>;
}
