"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface ChapterNavProps {
  slug: string;
  chapters: string[];
  current: string;
  prevSlug?: string;
  nextSlug?: string;
}

export default function ChapterNav({
  slug,
  chapters,
  current,
  prevSlug,
  nextSlug,
}: ChapterNavProps) {
  const router = useRouter();

  const storeLastRead = (chapter: string) =>
    typeof window !== "undefined" &&
    localStorage.setItem(`lastRead-${slug}`, chapter);

  const goToChapter = (chapterName: string) => {
    storeLastRead(chapterName);
    router.push(`/truyen-tranh/${slug}/${chapterName}`);
  };

  return (
    <div className="my-6 flex flex-wrap items-center justify-between gap-4">
      {/* Prev */}
      {prevSlug ? (
        <Link
          prefetch
          href={`/truyen-tranh/${slug}/${prevSlug}`}
          onClick={() => storeLastRead(prevSlug)}
          className="rounded-md bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
        >
          ◀ Chapter {prevSlug}
        </Link>
      ) : (
        <span />
      )}

      {/* Dropdown */}
      <select
        value={current}
        onChange={(e) => goToChapter(e.target.value)}
        className="rounded-md bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700 focus:outline-none"
      >
        {chapters.map((name, idx) => (
          <option
            key={`${name}-${idx}`}
            value={name}
            className="bg-gray-800 text-white"
          >
            Chapter {name}
          </option>
        ))}
      </select>

      {/* Next */}
      {nextSlug ? (
        <Link
          prefetch
          href={`/truyen-tranh/${slug}/${nextSlug}`}
          onClick={() => storeLastRead(nextSlug)}
          className="rounded-md bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600"
        >
          Chapter {nextSlug} ▶
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}