import Dexie from "dexie";

export const db = new Dexie("quranCompanion");
db.version(1).stores({
  chapters: "id, nameSimple, revelationPlace",
  chapterContent: "[chapterId+translationId], chapterId, downloaded, cachedAt",
  bookmarks: "verseKey, chapterId, verseNumber, createdAt",
  readingProgress: "id, chapterId, verseKey, updatedAt",
  settings: "key",
  downloads: "chapterId, downloadedAt",
});

