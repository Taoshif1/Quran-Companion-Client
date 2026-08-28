import { Bookmark, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { usePreferences } from "../../providers/PreferencesProvider";
import { saveReadingProgress, toggleBookmark } from "../../services/library";

export function AyahCard({ verse, chapterName, bookmarked }) {
  const { preferences } = usePreferences();
  const id = `ayah-${verse.verseKey.replace(":", "-")}`;
  return <article id={id} className="scroll-mt-24 border-b border-base-300 py-8"><div className="mb-5 flex items-center justify-between"><span className="grid size-10 place-items-center rounded-full border border-primary/30 text-sm text-primary">{verse.verseNumber}</span><div className="flex gap-1"><button className={`btn btn-circle btn-ghost ${bookmarked ? "text-primary" : ""}`} aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ayah ${verse.verseKey}`} onClick={async () => toast.success((await toggleBookmark(verse)) ? "Bookmark saved" : "Bookmark removed")}><Bookmark size={19} fill={bookmarked ? "currentColor" : "none"}/></button><button className="btn btn-circle btn-ghost" aria-label={`Continue reading from ayah ${verse.verseKey}`} onClick={async () => { await saveReadingProgress(verse, chapterName); toast.success("Reading place saved"); }}><MapPin size={19}/></button></div></div><p className="arabic text-right" lang="ar" dir="rtl" translate="no" style={{fontSize:preferences.arabicSize,lineHeight:2.05}}>{verse.textUthmani}</p>{preferences.showTranslation && verse.translation && <p className="bn mt-6 border-l-2 border-accent/60 pl-4 leading-relaxed text-base-content/75" lang="bn" translate="no" style={{fontSize:preferences.banglaSize,whiteSpace:"pre-wrap"}}>{verse.translation.text}</p>}</article>;
}

