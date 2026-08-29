import { Bookmark, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { usePreferences } from "../../providers/PreferencesProvider";
import { saveReadingProgress, toggleBookmark } from "../../services/library";
import { TranslationText } from "./TranslationText";

export function AyahCard({ verse, chapterName, bookmarked }) {
  const { preferences } = usePreferences();
  const id = `ayah-${verse.verseKey.replace(":", "-")}`;
  return <article id={id} className="scroll-mt-28 border-b border-base-300 py-9 md:py-11">
    <div className="mb-6 flex items-center justify-between"><span className="grid size-10 place-items-center rounded-full border border-primary/30 text-sm font-semibold text-primary" aria-label={`Ayah ${verse.verseNumber}`}>{verse.verseNumber}</span><div className="flex gap-1"><button className={`btn btn-circle btn-ghost ${bookmarked ? "text-primary" : ""}`} aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ayah ${verse.verseKey}`} onClick={async () => toast.success((await toggleBookmark(verse)) ? "Bookmark saved" : "Bookmark removed")}><Bookmark size={19} fill={bookmarked ? "currentColor" : "none"}/></button><button className="btn btn-circle btn-ghost" aria-label={`Continue reading from ayah ${verse.verseKey}`} onClick={async () => { await saveReadingProgress(verse, chapterName); toast.success("Reading place saved"); }}><MapPin size={19}/></button></div></div>
    <p className="arabic text-right text-base-content/95" lang="ar" dir="rtl" translate="no" style={{ fontSize: preferences.arabicSize, lineHeight: preferences.arabicLineHeight }}>{verse.textUthmani}</p>
    {preferences.showTranslation && verse.translation && <div className="bn mt-7 border-l-2 border-accent/60 pl-4 text-base-content/75" lang="bn" translate="no" style={{ fontSize: preferences.banglaSize, lineHeight: preferences.banglaLineHeight, whiteSpace: "pre-wrap" }}><TranslationText rawText={verse.translation.text}/>{verse.translation.footnotes && <aside className="mt-3 border-t border-base-300 pt-3 text-[.88em] text-base-content/60" aria-label="QuranEnc footnote"><TranslationText rawText={verse.translation.footnotes}/></aside>}</div>}
  </article>;
}
