import { apiClient } from "./client";

export async function fetchChapters() {
  const { data } = await apiClient.get("/quran/chapters");
  return data.data;
}

export async function fetchBengaliTranslations() {
  const { data } = await apiClient.get("/quran/translations", { params: { language: "bn" } });
  return data.data;
}

export async function fetchChapterContent(chapterId, translationId) {
  const { data } = await apiClient.get(`/quran/chapters/${chapterId}`, { params: { translationId } });
  return data.data;
}

