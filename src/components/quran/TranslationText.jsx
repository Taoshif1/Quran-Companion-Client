import { Fragment, useMemo } from "react";

function renderNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const children = Array.from(node.childNodes).map((child, index) => (
    <Fragment key={`${key}-${index}`}>{renderNode(child, `${key}-${index}`)}</Fragment>
  ));
  const tag = node.tagName.toLowerCase();

  if (tag === "br") return <br key={key} />;
  if (tag === "sup") {
    const footnoteId = node.getAttribute("foot_note") || node.getAttribute("data-footnote");
    return <sup key={key} className="mx-0.5 rounded bg-accent/15 px-1 text-[.72em] font-semibold text-accent" aria-label={footnoteId ? `Footnote ${node.textContent}` : undefined} title={footnoteId ? `Official source footnote reference ${footnoteId}` : undefined}>{children}</sup>;
  }

  return <Fragment key={key}>{children}</Fragment>;
}

export function TranslationText({ rawText }) {
  const rendered = useMemo(() => {
    if (typeof DOMParser === "undefined") return rawText;
    const document = new DOMParser().parseFromString(`<div>${rawText}</div>`, "text/html");
    return Array.from(document.body.firstElementChild?.childNodes || []).map((node, index) => (
      <Fragment key={index}>{renderNode(node, String(index))}</Fragment>
    ));
  }, [rawText]);

  return rendered;
}

