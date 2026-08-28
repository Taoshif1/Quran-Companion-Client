import { db } from "../db/database";

export const cacheChapters = (chapters) => db.chapters.bulkPut(chapters);

export async function cacheChapterContent(content, downloaded = false) {
  const record = { ...content, chapterId: content.chapter.id, translationId: content.translationResource.id, downloaded, cachedAt: new Date().toISOString() };
  await db.chapterContent.put(record);
  if (downloaded) await db.downloads.put({ chapterId: content.chapter.id, downloadedAt: record.cachedAt });
  return record;
}

export async function toggleBookmark(verse) {
  const existing = await db.bookmarks.get(verse.verseKey);
  if (existing) { await db.bookmarks.delete(verse.verseKey); return false; }
  await db.bookmarks.put({ verseKey: verse.verseKey, chapterId: verse.chapterId, verseNumber: verse.verseNumber, createdAt: new Date().toISOString() });
  return true;
}

export function saveReadingProgress(verse, chapterName) {
  return db.readingProgress.put({ id: "current", chapterId: verse.chapterId, verseNumber: verse.verseNumber, verseKey: verse.verseKey, chapterName, updatedAt: new Date().toISOString() });
}

