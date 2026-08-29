import { db } from "../db/database";

export const cacheChapters = (chapters) => db.chapters.bulkPut(chapters);

export async function cacheChapterContent(content, downloaded = false) {
  const translationId = content.translationResource?.id || "arabic-only";
  const translationVersion = content.translationResource?.version || "canonical";
  const key = [content.chapter.id, translationId, translationVersion];
  const existing = await db.chapterContent.get(key);
  const record = { ...content, chapterId: content.chapter.id, translationId, translationVersion, downloaded: downloaded || Boolean(existing?.downloaded), cachedAt: new Date().toISOString() };
  if (downloaded) {
    await db.transaction("rw", db.chapterContent, db.downloads, async () => {
      await db.chapterContent.put(record);
      if (!content.translationResource) throw new Error("Select a Bengali resource before downloading it");
      await db.downloads.put({ chapterId: content.chapter.id, translationId, translationVersion, translationName: content.translationResource.name, chapterName: content.chapter.nameSimple, downloadedAt: record.cachedAt });
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
  const updatedAt = new Date().toISOString();
  return db.transaction("rw", db.readingProgress, db.recentReading, async () => {
    await db.readingProgress.put({ id: "current", chapterId: verse.chapterId, verseNumber: verse.verseNumber, verseKey: verse.verseKey, chapterName, updatedAt });
    await db.recentReading.put({ chapterId: verse.chapterId, lastVerseNumber: verse.verseNumber, timestamp: updatedAt });
    const oldest = await db.recentReading.orderBy("timestamp").reverse().offset(5).toArray();
    await db.recentReading.bulkDelete(oldest.map((item) => item.chapterId));
  });
}
