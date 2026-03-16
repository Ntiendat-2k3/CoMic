import { openDB, DBSchema, IDBPDatabase } from "idb";
import { ComicDetailResponse } from "@/types/response";
import { Chapter } from "@/types/common";

interface OfflineComicDB extends DBSchema {
  comics: {
    key: string; // comic slug
    value: {
      slug: string;
      title: string;
      thumb_url: string;
      savedAt: number;
      chapters: {
        server_name: string;
        server_data: Chapter[];
      }[];
    };
  };
  chapters: {
    key: string; // comicSlug_chapterId
    value: {
      id: string;
      comicSlug: string;
      chapterName: string;
      images: string[];
      savedAt: number;
    };
    indexes: {
      "by-comic": string;
    };
  };
}

export class OfflineManager {
  private static dbPromise: Promise<IDBPDatabase<OfflineComicDB>> | null = null;
  private static readonly DB_NAME = "comic-offline-db";
  private static readonly DB_VERSION = 1;

  static async getDB() {
    if (!this.dbPromise) {
      if (typeof window === "undefined") return null;
      this.dbPromise = openDB<OfflineComicDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("comics")) {
            db.createObjectStore("comics", { keyPath: "slug" });
          }
          if (!db.objectStoreNames.contains("chapters")) {
            const chapterStore = db.createObjectStore("chapters", { keyPath: "id" });
            chapterStore.createIndex("by-comic", "comicSlug");
          }
        },
      });
    }
    return this.dbPromise;
  }

  // --- DOWNLOAD LOGIC ---

  static async saveComicMetadata(comic: ComicDetailResponse["data"]["item"]) {
    const db = await this.getDB();
    if (!db) return;

    await db.put("comics", {
      slug: comic.slug,
      title: comic.name,
      thumb_url: comic.thumb_url,
      savedAt: Date.now(),
      chapters: comic.chapters,
    });
  }

  static async saveChapter(comicSlug: string, chapter: Chapter, images: string[]) {
    const db = await this.getDB();
    if (!db) return;

    // Cache images into ServiceWorker Cache API
    if ("caches" in window) {
      try {
        const cache = await caches.open("images-v1");
        // Pre-fetch all images
        await Promise.allSettled(
          images.map(async (imgUrl) => {
            const req = new Request(imgUrl, { mode: "cors" });
            const response = await fetch(req);
            if (response.ok) {
              await cache.put(req, response);
            }
          })
        );
      } catch (e) {
        console.error("Failed to cache images", e);
      }
    }

    // Save chapter info to IndexedDB
    await db.put("chapters", {
      id: `${comicSlug}_${chapter.chapter_api_data?.split("/").pop() || chapter.chapter_name}`, // Unique ID
      comicSlug: comicSlug,
      chapterName: chapter.chapter_name || "Unknown",
      images: images,
      savedAt: Date.now(),
    });
  }

  // --- RETRIEVAL LOGIC ---

  static async getSavedComics() {
    const db = await this.getDB();
    if (!db) return [];
    return await db.getAll("comics");
  }

  static async getComic(slug: string) {
    const db = await this.getDB();
    if (!db) return null;
    return await db.get("comics", slug);
  }

  static async getSavedChapters(comicSlug: string) {
    const db = await this.getDB();
    if (!db) return [];
    return await db.getAllFromIndex("chapters", "by-comic", comicSlug);
  }

  // --- DELETION LOGIC ---

  static async removeComic(slug: string) {
    const db = await this.getDB();
    if (!db) return;

    // Remove from IndexedDB
    await db.delete("comics", slug);
    
    // Get all chapters for this comic to remove from Cache API later if needed
    // (A bit complex to match exactly URLs in cache storage without knowing them, 
    // but typically Cache API handles replacing or max-size eviction anyway.)
    const chapters = await this.getSavedChapters(slug);
    
    // Delete chapter records
    const tx = db.transaction("chapters", "readwrite");
    for (const chap of chapters) {
      await tx.store.delete(chap.id);
    }
    await tx.done;
  }
}
