import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { createDatabase, migrateLegacyUserState } from "../src/db/database";

const opened = [];
afterEach(async () => {
  for (const database of opened.splice(0)) {
    database.close();
    await Dexie.delete(database.name);
  }
});

async function seedLegacy(version) {
  const suffix = version + "-" + crypto.randomUUID();
  const legacyName = "legacy-" + suffix;
  const targetName = "current-" + suffix;
  const legacy = new Dexie(legacyName);
  const userStores = { chapters: "id", bookmarks: "verseKey", readingProgress: "id", settings: "key" };
  if (version === 1) legacy.version(1).stores({ ...userStores, chapterContent: "[chapterId+translationId]", downloads: "chapterId" });
  if (version === 2) legacy.version(2).stores({ ...userStores, chapterContent: "[chapterId+translationId]", downloads: "[chapterId+translationId]" });
  if (version === 3) legacy.version(3).stores({ ...userStores, recentReading: "chapterId", chapterContent: "[chapterId+translationId+translationVersion]", downloads: "[chapterId+translationId+translationVersion]" });
  await legacy.open();
  opened.push(legacy);
  await legacy.bookmarks.put({ verseKey: "1:1", chapterId: 1, verseNumber: 1 });
  await legacy.readingProgress.put({ id: "current", chapterId: 1, verseKey: "1:1" });
  await legacy.settings.put({ key: "preferences", value: { theme: "dark" } });
  if (version === 3) await legacy.recentReading.put({ chapterId: 1, lastVerseNumber: 1 });
  legacy.close();

  const current = createDatabase(targetName);
  opened.push(current);
  await migrateLegacyUserState(current, legacyName);
  return current;
}

describe.each([1, 2, 3])("legacy IndexedDB v%s migration", (version) => {
  it("preserves user state without importing regenerable caches", async () => {
    const database = await seedLegacy(version);
    expect(await database.bookmarks.get("1:1")).toMatchObject({ chapterId: 1 });
    expect(await database.readingProgress.get("current")).toMatchObject({ verseKey: "1:1" });
    expect(await database.settings.get("preferences")).toMatchObject({ value: { theme: "dark" } });
    if (version === 3) expect(await database.recentReading.get(1)).toMatchObject({ lastVerseNumber: 1 });
    expect(await database.chapterContent.count()).toBe(0);
    expect(await database.downloads.count()).toBe(0);
  });
});
