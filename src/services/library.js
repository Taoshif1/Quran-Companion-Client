import { db } from "../db/database";

export const cacheChapters = (chapters) => db.chapters.bulkPut(chapters);

export async function cacheChapterContent(content, downloaded = false) {
  const key = [content.chapter.id, content.translationResource.id];
  const existing = await db.chapterContent.get(key);
  const record = { ...content, chapterId: content.chapter.id, translationId: content.translationResource.id, downloaded: downloaded || Boolean(existing?.downloaded), cachedAt: new Date().toISOString() };
  if (downloaded) {
    await db.transaction("rw", db.chapterContent, db.downloads, async () => {
      await db.chapterContent.put(record);
      await db.downloads.put({ chapterId: content.chapter.id, translationId: content.translationResource.id, translationName: content.translationResource.name, translationAuthor: content.translationResource.authorName, chapterName: content.chapter.nameSimple, downloadedAt: record.cachedAt });
    });
  } else {
    await db.chapterContent.put(record);
  }
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
