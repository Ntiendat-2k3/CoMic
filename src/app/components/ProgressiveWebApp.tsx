"use client"

import { useEffect, useState } from "react"

export default function ProgressiveWebApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstallPrompt(false)
    }

    setDeferredPrompt(null)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-pink rounded-2xl p-4 border border-pink-glow/30 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          📱
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">Cài đặt ứng dụng</h3>
          <p className="text-sm text-gray-300">Trải nghiệm tốt hơn trên điện thoại</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={handleInstall} className="glass-button px-4 py-2 rounded-lg text-sm font-medium flex-1">
          Cài đặt
        </button>
        <button
          onClick={() => setShowInstallPrompt(false)}
          className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
        >
          Bỏ qua
        </button>
      </div>
    </div>
  )
}
