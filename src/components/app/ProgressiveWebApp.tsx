"use client"

import { useDictionary } from "@/i18n/I18nProvider"
import { usePwaInstallController } from "@/features/app/hooks/usePwaInstallController"

export default function ProgressiveWebApp() {
  const { pwa } = useDictionary()
  const controller = usePwaInstallController()

  if (!controller.showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-pink rounded-2xl p-4 border border-pink-glow/30 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          📱
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{pwa.installTitle}</h3>
          <p className="text-sm text-gray-300">{pwa.installDescription}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={controller.install} className="glass-button px-4 py-2 rounded-lg text-sm font-medium flex-1">
          {pwa.install}
        </button>
        <button
          onClick={controller.dismiss}
          className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
        >
          {pwa.dismiss}
        </button>
      </div>
    </div>
  )
}
