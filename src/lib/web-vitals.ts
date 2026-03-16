// // Web Vitals monitoring for performance tracking
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals"

// interface WebVitalMetric {
//   name: string
//   value: number
//   rating: "good" | "needs-improvement" | "poor"
//   delta: number
//   id: string
// }

// export function initWebVitals() {
//   if (typeof window === "undefined") return

//   const sendToAnalytics = (metric: WebVitalMetric) => {
//     // Send to your analytics service
//     console.log("Web Vital:", metric)

//     // Example: Send to Google Analytics
//     if ("gtag" in window) {
//       ;(window as any).gtag("event", metric.name, {
//         event_category: "Web Vitals",
//         event_label: metric.id,
//         value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
//         non_interaction: true,
//       })
//     }
//   }

//   // Measure all Web Vitals
//   getCLS(sendToAnalytics)
//   getFID(sendToAnalytics)
//   getFCP(sendToAnalytics)
//   getLCP(sendToAnalytics)
//   getTTFB(sendToAnalytics)
// }

// // Performance observer for custom metrics
// export function observePerformance() {
//   if (typeof window === "undefined" || !("PerformanceObserver" in window)) return

//   // Observe long tasks
//   const longTaskObserver = new PerformanceObserver((list) => {
//     list.getEntries().forEach((entry) => {
//       if (entry.duration > 50) {
//         console.warn("Long task detected:", entry.duration + "ms")
//       }
//     })
//   })

//   try {
//     longTaskObserver.observe({ entryTypes: ["longtask"] })
//   } catch (e) {
//     // Longtask observer not supported
//   }

//   // Observe layout shifts
//   const layoutShiftObserver = new PerformanceObserver((list) => {
//     list.getEntries().forEach((entry: any) => {
//       if (entry.hadRecentInput) return // Ignore user-initiated shifts

//       if (entry.value > 0.1) {
//         console.warn("Layout shift detected:", entry.value)
//       }
//     })
//   })

//   try {
//     layoutShiftObserver.observe({ entryTypes: ["layout-shift"] })
//   } catch (e) {
//     // Layout shift observer not supported
//   }
// }
