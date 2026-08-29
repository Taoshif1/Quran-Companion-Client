import { apiClient } from "./client";

const ARABIC_SOURCE = { name: "Tanzil Project", textType: "Uthmani Quran Text", version: "1.1", url: "https://tanzil.net/" };

async function fetchBundledJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Bundled canonical Quran data is unavailable");
  return response.json();
}

export function fetchChapters() {
  return fetchBundledJson("/data/quran/chapters.json");
}

export async function fetchTranslations(language) {
  const { data } = await apiClient.get("/quran/translations", { params: { language } });
  return data.data;
}

export async function fetchBundledChapter(chapterId) {
  const local = await fetchBundledJson(`/data/quran/${Number(chapterId)}.json`);
  return { ...local, arabicSource: ARABIC_SOURCE, translationResource: null, verses: local.verses.map((verse) => ({ ...verse, translation: null })) };
}

export async function fetchChapterContent(chapterId, translationId) {
  if (!translationId) return fetchBundledChapter(chapterId);
  const { data } = await apiClient.get(`/quran/chapters/${chapterId}`, { params: { translationId } });
  return data.data;
}
