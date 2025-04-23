"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Book, ArrowRight } from "lucide-react";

interface ActionButtonsProps {
  comicSlug: string;
  firstChapterSlug: string;
}

export default function ActionButtons({
  comicSlug,
  firstChapterSlug,
}: ActionButtonsProps) {
  const [following, setFollowing] = useState(false);
  const [continueSlug, setContinueSlug] = useState<string | undefined>();

  /* --------- đồng bộ với localStorage khi mount --------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    setFollowing(localStorage.getItem(`follow-${comicSlug}`) === "true");
    const last = localStorage.getItem(`lastRead-${comicSlug}`);
    if (last) setContinueSlug(last);
  }, [comicSlug]);

  /* --------- helpers --------- */
  const toggleFollow = () => {
    const newState = !following;
    setFollowing(newState);
    localStorage.setItem(`follow-${comicSlug}`, String(newState));
    // TODO: gọi API follow thật ở đây (nếu có)
  };

  /** mỗi khi user bấm vô link chapter, lưu lại để nút “Đọc tiếp” lần sau */
  const handleRead = (slug: string) => () =>
    localStorage.setItem(`lastRead-${comicSlug}`, slug);

  return (
    <div className="flex flex-wrap gap-3">
      {/* ---------- Theo dõi ---------- */}
      <button
        onClick={toggleFollow}
        className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/70"
      >
        {following ? (
          <>
            <BookmarkCheck size={18} /> Đang theo dõi
          </>
        ) : (
          <>
            <Bookmark size={18} /> Theo dõi
          </>
        )}
      </button>

      {/* ---------- Đọc từ đầu ---------- */}
      <Link
        href={`/truyen-tranh/${comicSlug}/${firstChapterSlug}`}
        onClick={handleRead(firstChapterSlug)}
        className="flex items-center gap-1 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
      >
        <Book size={18} /> Đọc từ&nbsp;đầu
      </Link>

      {/* ---------- Đọc tiếp (nếu đã có) ---------- */}
      {continueSlug && (
        <Link
          href={`/truyen-tranh/${comicSlug}/${continueSlug}`}
          onClick={handleRead(continueSlug)}
          className="flex items-center gap-1 bg-green-300 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-geen-300/10"
        >
          Đọc tiếp <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
