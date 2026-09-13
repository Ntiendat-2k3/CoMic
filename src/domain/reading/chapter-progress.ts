export interface ChapterProgress {
  chapterNumber: number | null;
  percentage: number;
}

/** Quy đổi số chương sang tiến độ logarit để các bộ truyện dài vẫn dễ quan sát. */
export function getChapterProgress(chapterName: string): ChapterProgress {
  const match = chapterName.match(/(\d+(?:\.\d+)?)/);
  const chapterNumber = match ? Number.parseFloat(match[1]) : null;
  const percentage = chapterNumber === null
    ? 0
    : Math.min(
        100,
        Math.round((Math.log(chapterNumber + 1) / Math.log(501)) * 100),
      );

  return { chapterNumber, percentage };
}
