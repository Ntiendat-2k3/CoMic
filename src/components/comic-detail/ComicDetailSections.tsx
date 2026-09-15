"use client";

import { BookOpen, ListOrdered } from "lucide-react";
import { useState } from "react";
import VirtualChapterList from "@/components/chapter/VirtualChapterList";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import type { Comic } from "@/types/comic";
import { Description } from "./ComicDetailParts";

interface ComicDetailSectionsProps {
  comic: Comic;
  chapterCount: number;
}

const CHAPTER_PREVIEW_SIZE = 4;

/** Hiển thị giới thiệu và chương liên tiếp để phù hợp luồng cuộn tự nhiên trên mobile. */
export default function ComicDetailSections({ comic, chapterCount }: ComicDetailSectionsProps) {
  const [showAllChapters, setShowAllChapters] = useState(false);
  const { comic: copy } = useDictionary();

  return (
    <div className="space-y-7">
      <section aria-labelledby="comic-description-heading">
        <header className="mb-3 flex items-center gap-3">
          <span className="h-7 w-1 rounded-full bg-gradient-to-b from-pink-300 to-pink-600 shadow-[0_0_12px_rgba(236,72,153,.5)]" aria-hidden="true" />
          <BookOpen size={20} className="text-pink-400" aria-hidden="true" />
          <h2 id="comic-description-heading" className="text-lg font-extrabold text-white">
            {copy.overviewTab}
          </h2>
        </header>
        <Description content={comic.content} />
      </section>

      <section aria-labelledby="comic-chapters-heading">
        <header className="mb-2 flex items-center gap-3">
          <ListOrdered size={21} className="text-pink-400" aria-hidden="true" />
          <h2 id="comic-chapters-heading" className="text-lg font-extrabold text-white">
            {copy.chapterListHeading}
          </h2>
          {chapterCount > CHAPTER_PREVIEW_SIZE ? (
            <button
              type="button"
              onClick={() => setShowAllChapters((current) => !current)}
              className="ml-auto text-xs font-semibold text-pink-400 transition-colors hover:text-pink-300"
            >
              {showAllChapters
                ? copy.showRecentChapters
                : formatMessage(copy.viewAllChapters, { count: chapterCount })}
            </button>
          ) : null}
        </header>

        {chapterCount > 0 ? (
          comic.chapters.map((server, index) => {
            const chapters = showAllChapters
              ? server.server_data
              : server.server_data.slice(0, CHAPTER_PREVIEW_SIZE);

            return (
              <div key={server.server_name} className={index > 0 ? "mt-4" : ""}>
                {comic.chapters.length > 1 ? (
                  <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {server.server_name === "vi" ? copy.vietnamese : copy.english}
                  </p>
                ) : null}
                <VirtualChapterList chapters={chapters} comicSlug={comic.slug} />
              </div>
            );
          })
        ) : (
          <p className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm text-gray-400">
            {copy.noChapters}
          </p>
        )}
      </section>
    </div>
  );
}
