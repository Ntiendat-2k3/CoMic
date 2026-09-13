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
      {isSaving ? offline.saving : isSaved ? offline.saved : offline.save}
    </button>
  );
}
