"use client";

import { Download, CheckCircle, Loader2 } from "lucide-react";
import type { Comic } from "@/types/comic";
import { useOfflineSaveController } from "@/features/offline/hooks/useOfflineSaveController";
import { useDictionary } from "@/i18n/I18nProvider";

export default function SaveToOfflineButton({ comic }: { comic: Comic }) {
  const { isSaved, isSaving, toggleSave } = useOfflineSaveController(comic);
  const { offline } = useDictionary();

  return (
    <button
      onClick={toggleSave}
      disabled={isSaving}
      className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl border px-2 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
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
      <span className="truncate">
        {isSaving ? offline.saving : isSaved ? offline.saved : offline.save}
      </span>
    </button>
  );
}
