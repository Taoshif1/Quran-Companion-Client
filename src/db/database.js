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

db.version(2).stores({
  chapters: "id, nameSimple, revelationPlace",
  chapterContent: "[chapterId+translationId], chapterId, downloaded, cachedAt",
  bookmarks: "verseKey, chapterId, verseNumber, createdAt",
  readingProgress: "id, chapterId, verseKey, updatedAt",
  settings: "key",
  downloads: "[chapterId+translationId], chapterId, translationId, downloadedAt",
}).upgrade((transaction) => Promise.all([
  transaction.table("chapters").clear(),
  transaction.table("chapterContent").clear(),
  transaction.table("downloads").clear(),
]));
