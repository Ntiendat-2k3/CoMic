"use client";

import { useDictionary } from "@/i18n/I18nProvider";
import { useReadingProgressController } from "@/features/chapter/hooks/useReadingProgressController";

export default function ReadingProgress() {
  const progress = useReadingProgressController();
  const { common } = useDictionary();

  return (
    <>
      {/* Thanh tiến độ cố định trên cùng */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-800/80">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Badge % hiện tại - góc phải dưới */}
      {progress > 0 && progress < 100 && (
        <div className="fixed bottom-20 right-4 z-40 px-2.5 py-1 rounded-full bg-gray-900/90 border border-gray-700 text-xs text-white font-medium backdrop-blur-sm shadow-lg">
          {Math.round(progress)}%
        </div>
      )}

      {/* Badge hoàn thành */}
      {progress >= 99 && (
        <div className="fixed bottom-20 right-4 z-40 px-2.5 py-1 rounded-full bg-green-600/90 border border-green-500 text-xs text-white font-medium backdrop-blur-sm shadow-lg">
          {common.done}
        </div>
      )}
    </>
  );
}
