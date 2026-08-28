import { useQuery } from "@tanstack/react-query";
import { fetchBengaliTranslations, fetchChapterContent, fetchChapters } from "../api/quran";
import { db } from "../db/database";
import { cacheChapterContent, cacheChapters } from "../services/library";

export function useChapters() {
  return useQuery({ queryKey: ["chapters"], queryFn: async () => { const data = await fetchChapters(); await cacheChapters(data); return data; }, placeholderData: () => undefined });
}

export function useTranslations() {
  return useQuery({ queryKey: ["translations", "bn"], queryFn: fetchBengaliTranslations });
}

export function useChapter(chapterId, translationId) {
  return useQuery({
    queryKey: ["chapter", Number(chapterId), Number(translationId)], enabled: Boolean(translationId),
    queryFn: async () => { try { const data = await fetchChapterContent(chapterId, translationId); await cacheChapterContent(data); return data; } catch (error) { const cached = await db.chapterContent.get([Number(chapterId), Number(translationId)]); if (cached) return cached; if (!navigator.onLine) { const offlineError = new Error("Selected translation is unavailable offline"); offlineError.code = "OFFLINE_TRANSLATION_MISSING"; throw offlineError; } throw error; } },
  });
}
