"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { OfflineManager } from "@/lib/offline-manager";
import type { Comic } from "@/types/comic";

export default function SaveToOfflineButton({ comic }: { comic: Comic }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if comic exists in IDB
    OfflineManager.getComic(comic.slug).then((res) => {
      if (res) setIsSaved(true);
    });
  }, [comic.slug]);

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        setIsSaving(true);
        await OfflineManager.removeComic(comic.slug);
        setIsSaved(false);
      } else {
        setIsSaving(true);
        await OfflineManager.saveComicMetadata(comic as any); // Type assertion for compatibility with response type
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Failed to toggle offline save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isSaving}
      className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all border ${
        isSaved
          ? "bg-green-500/20 text-green-300 border-green-500/40 shadow-green-500/10 shadow-md"
          : "bg-gray-700/60 text-gray-300 border-gray-600/50 hover:border-blue-500/30 hover:text-blue-300"
      }`}
    >
      {isSaving ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isSaved ? (
        <CheckCircle size={16} className="text-green-400" />
      ) : (
        <Download size={16} />
      )}
      {isSaving ? "Đang xử lý..." : isSaved ? "Đã lưu Offline" : "Lưu Offline"}
    </button>
  );
}
