import { useQuery } from "@tanstack/react-query";
import { fetchBengaliTranslations, fetchBundledChapter, fetchChapterContent, fetchChapters } from "../api/quran";
import { db } from "../db/database";
import { cacheChapterContent, cacheChapters } from "../services/library";

export function useChapters() {
  return useQuery({ queryKey: ["chapters"], queryFn: async () => { const data = await fetchChapters(); await cacheChapters(data); return data; }, placeholderData: () => undefined });
}

export function useTranslations() {
  return useQuery({ queryKey: ["translations", "bn"], queryFn: fetchBengaliTranslations, retry: 1 });
}

export function useChapter(chapterId, translationId) {
  return useQuery({
    queryKey: ["chapter", Number(chapterId), translationId || "arabic-only"],
    queryFn: async () => {
      try {
        const data = await fetchChapterContent(chapterId, translationId);
        await cacheChapterContent(data);
        return data;
      } catch (error) {
        if (translationId) {
          const cached = await db.chapterContent.get([Number(chapterId), translationId]);
          if (cached?.translationResource?.id === translationId) return cached;
        }
        const arabic = await fetchBundledChapter(chapterId);
        return { ...arabic, translationUnavailable: Boolean(translationId), translationError: error?.message };
      }
    },
  });
}
