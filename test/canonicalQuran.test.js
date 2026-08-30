import { describe, expect, it, vi } from "vitest";
import { fetchBundledChapter } from "../src/api/quran";
import { loadCanonicalChapters } from "../src/services/canonicalQuran";

describe("canonical bundled Quran resilience", () => {
  it("returns all bundled chapters when the optional cache write fails", async () => {
    const chapters = Array.from({ length: 114 }, (_, index) => ({ id: index + 1 }));
    const cacheError = new Error("simulated IndexedDB failure");
    const report = vi.fn();

    const result = await loadCanonicalChapters({
      fetchCanonical: vi.fn().mockResolvedValue(chapters),
      cache: vi.fn().mockRejectedValue(cacheError),
      report,
    });
    await vi.waitFor(() => expect(report).toHaveBeenCalledWith(cacheError));

    expect(result).toHaveLength(114);
    expect(result[0].id).toBe(1);
    expect(result.at(-1).id).toBe(114);
  });

  it("retrieves bundled Arabic without calling Express", async () => {
    const local = { chapter: { id: 1 }, verses: [{ verseKey: "1:1", textUthmani: "exact" }] };
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => local });
    vi.stubGlobal("fetch", fetcher);

    const result = await fetchBundledChapter(1);

    expect(fetcher).toHaveBeenCalledWith("/data/quran/1.json");
    expect(result.verses[0].textUthmani).toBe("exact");
    expect(result.translationResource).toBeNull();
    vi.unstubAllGlobals();
  });
});
