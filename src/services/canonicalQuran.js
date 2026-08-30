import { fetchChapters } from "../api/quran";
import { cacheChapters } from "./library";

function reportCacheFailure(error) {
  if (import.meta.env.DEV) console.warn("Optional Quran metadata cache unavailable", error);
}

export async function loadCanonicalChapters({
  fetchCanonical = fetchChapters,
  cache = cacheChapters,
  report = reportCacheFailure,
} = {}) {
  const chapters = await fetchCanonical();
  Promise.resolve().then(() => cache(chapters)).catch(report);
  return chapters;
}
