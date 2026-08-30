import Dexie from "dexie";

const CURRENT_DATABASE = "quranCompanionV2";
const LEGACY_DATABASE = "quranCompanion";
const USER_TABLES = ["bookmarks", "readingProgress", "recentReading", "settings"];

export function createDatabase(name = CURRENT_DATABASE) {
  const database = new Dexie(name);
  database.version(1).stores({
    chapters: "id, nameSimple, revelationPlace",
    chapterContent: "[chapterId+translationId+translationVersion], chapterId, translationId, downloaded, cachedAt",
    bookmarks: "verseKey, chapterId, verseNumber, createdAt",
    readingProgress: "id, chapterId, verseKey, updatedAt",
    recentReading: "chapterId, timestamp",
    settings: "key",
    downloads: "[chapterId+translationId+translationVersion], chapterId, translationId, downloadedAt",
  });
  return database;
}

export async function migrateLegacyUserState(target, legacyName = LEGACY_DATABASE) {
  if (target.name === legacyName) return;
  await target.open();
  if (await target.settings.get("legacy-database-migrated")) return;

  const databases = typeof indexedDB.databases === "function" ? await indexedDB.databases() : [];
  if (databases.length && !databases.some((item) => item.name === legacyName)) {
    await target.settings.put({ key: "legacy-database-migrated", value: true });
    return;
  }

  const legacy = new Dexie(legacyName);
  try {
    await legacy.open();
    const available = new Set(legacy.tables.map((table) => table.name));
    const records = {};
    for (const tableName of USER_TABLES) records[tableName] = available.has(tableName) ? await legacy.table(tableName).toArray() : [];
    await target.transaction("rw", USER_TABLES.map((tableName) => target.table(tableName)), async () => {
      for (const tableName of USER_TABLES) if (records[tableName].length) await target.table(tableName).bulkPut(records[tableName]);
      await target.settings.put({ key: "legacy-database-migrated", value: true });
    });
  } catch (error) {
    if (import.meta.env.DEV) console.warn("Legacy local reading state could not be migrated", error);
  } finally {
    legacy.close();
  }
}

export const db = createDatabase();
export const databaseReady = migrateLegacyUserState(db).catch((error) => {
  if (import.meta.env.DEV) console.warn("Local persistence is unavailable", error);
});
