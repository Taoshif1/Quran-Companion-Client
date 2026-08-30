import { useQuery } from "@tanstack/react-query";
import { fetchBundledChapter, fetchChapterContent, fetchTranslations } from "../api/quran";
import { db } from "../db/database";
import { loadCanonicalChapters } from "../services/canonicalQuran";
import { cacheChapterContent } from "../services/library";

export function useChapters() {
  return useQuery({ queryKey: ["chapters"], queryFn: loadCanonicalChapters, placeholderData: () => undefined });
}

export function useTranslations(language = "bn") {
  return useQuery({ queryKey: ["translations", language], queryFn: () => fetchTranslations(language), retry: 1 });
}

export function useChapter(chapterId) {
  return useQuery({
    queryKey: ["chapter", Number(chapterId), "canonical-arabic"],
    queryFn: () => fetchBundledChapter(chapterId),
  });
}

export function useMeaningChapter(chapterId, resource) {
  return useQuery({
    queryKey: ["meaning", Number(chapterId), resource?.id, resource?.version],
    enabled: Boolean(resource?.id),
    retry: 1,
    queryFn: async () => {
      try {
        const data = await fetchChapterContent(chapterId, resource.id);
        await cacheChapterContent(data);
        return data;
      } catch (error) {
        const cached = await db.chapterContent.get([Number(chapterId), resource.id, resource.version]);
        if (cached?.translationResource?.id === resource.id && cached.translationResource.version === resource.version) return cached;
        throw error;
      }
    },
  });
}
