import { Bookmark, Copy, Ellipsis, MapPin, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { usePreferences } from "../../providers/PreferencesProvider";
import { saveReadingProgress, toggleBookmark } from "../../services/library";
import { TranslationText } from "./TranslationText";

export function AyahCard({ verse, chapterName, bookmarked, bangla, english, explanation }) {
  const { preferences } = usePreferences();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [footnote, setFootnote] = useState(null);
  const id = "ayah-" + verse.verseKey.replace(":", "-");
  const attribution = "Quran " + verse.verseKey + " — Arabic: Tanzil Project; meanings: QuranEnc";
  const shareText = [verse.textUthmani, bangla?.text, english?.text, attribution].filter(Boolean).join("\n\n");
  const meaning = (item, language, className) => item && <div className={"meaning-block " + className} lang={language} translate="no"><TranslationText rawText={item.text}/>{item.footnotes && <button className="footnote-trigger" onClick={() => setFootnote({ text: item.footnotes, language })} aria-label={"Open " + language + " footnote"}>Notes</button>}</div>;

  return <article id={id} className="ayah-section group scroll-mt-24">
    <div className="ayah-meta"><span aria-label={"Ayah " + verse.verseNumber}>{verse.verseNumber}</span><button className="icon-button opacity-70 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100" onClick={() => setActionsOpen(!actionsOpen)} aria-expanded={actionsOpen} aria-label={"Actions for ayah " + verse.verseKey}><Ellipsis/></button></div>
    {actionsOpen && <div className="ayah-actions" role="toolbar" aria-label={"Actions for ayah " + verse.verseKey}>
      <button onClick={async () => toast.success((await toggleBookmark(verse)) ? "Bookmark saved" : "Bookmark removed")}><Bookmark fill={bookmarked ? "currentColor" : "none"}/>Bookmark</button>
      <button onClick={async () => { await saveReadingProgress(verse, chapterName); toast.success("Reading place saved"); }}><MapPin/>Save place</button>
      <button onClick={async () => { await navigator.clipboard.writeText(shareText); toast.success("Ayah copied with attribution"); }}><Copy/>Copy</button>
      <button onClick={async () => { if (navigator.share) await navigator.share({ text: shareText }); else { await navigator.clipboard.writeText(shareText); toast.success("Copied for sharing"); } }}><Share2/>Share</button>
    </div>}
    <p className="arabic quran-text" lang="ar" dir="rtl" translate="no" style={{ fontSize: preferences.arabicSize, lineHeight: preferences.arabicLineHeight }}>{verse.textUthmani}</p>
    <div className="meanings">{meaning(bangla, "bn", "bn")}{meaning(english, "en", "english")}</div>
    {preferences.studyMode && explanation && <details className="explanation"><summary>Brief explanation</summary><div lang="bn" translate="no"><TranslationText rawText={explanation.text}/></div>{explanation.footnotes && <button className="footnote-trigger" onClick={() => setFootnote({ text: explanation.footnotes, language: "bn" })}>Explanation notes</button>}</details>}
    {footnote && <FootnoteSheet footnote={footnote} onClose={() => setFootnote(null)}/>}
  </article>;
}

function FootnoteSheet({ footnote, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const before = document.activeElement;
    const keydown = (event) => { if (event.key === "Escape") onClose(); if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); } };
    document.addEventListener("keydown", keydown);
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", keydown); before?.focus(); };
  }, [onClose]);
  return <div className="sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="sheet" role="dialog" aria-modal="true" aria-label="Official QuranEnc footnote"><div className="sheet-heading"><h2>Official note</h2><button ref={closeRef} className="text-button" onClick={onClose}>Close</button></div><div lang={footnote.language} translate="no"><TranslationText rawText={footnote.text}/></div><p className="source-caption">Preserved verbatim · QuranEnc</p></div></div>;
}
