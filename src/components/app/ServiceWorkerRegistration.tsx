"use client"

import { useEffect } from "react"
import { useDictionary } from "@/i18n/I18nProvider"

interface IdleCallbacks {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number
  cancelIdleCallback?: (handle: number) => void
}

export default function ServiceWorkerRegistration() {
  const { pwa } = useDictionary()

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    // HMR cần luôn nhận HTML và module mới; service worker chỉ phục vụ bản production.
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister())),
      )
      return
    }

    let disposed = false
    let idleId: number | null = null
    let timerId: number | null = null
    const idleCallbacks = window as unknown as IdleCallbacks

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          updateViaCache: "none",
        })
        if (disposed) return

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification(pwa.updateTitle, {
                body: pwa.updateDescription,
                icon: "/assets/logo.png",
              })
            }
          })
        })
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Không thể đăng ký Service Worker:", error)
        }
      }
    }

    // Service Worker không thuộc đường tải quan trọng nên chỉ đăng ký khi trang đã rảnh.
    const scheduleRegistration = () => {
      if (idleCallbacks.requestIdleCallback) {
        idleId = idleCallbacks.requestIdleCallback(
          () => void registerServiceWorker(),
          { timeout: 3000 },
        )
        return
      }

      timerId = window.setTimeout(() => void registerServiceWorker(), 0)
    }

    if (document.readyState === "complete") {
      scheduleRegistration()
    } else {
      window.addEventListener("load", scheduleRegistration, { once: true })
    }

    return () => {
      disposed = true
      window.removeEventListener("load", scheduleRegistration)
      if (idleId !== null) idleCallbacks.cancelIdleCallback?.(idleId)
      if (timerId !== null) window.clearTimeout(timerId)
    }
  }, [pwa.updateDescription, pwa.updateTitle])

  return null
}
