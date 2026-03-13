// "use client"

// import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
// import { MobilePerformanceOptimizer, ResourceOptimizer } from "../lib/performance-mobile"
// import { initWebVitals, observePerformance } from "../lib/web-vitals"

// interface MobilePerformanceContextType {
//   isMobile: boolean
//   connectionType: string
//   shouldReduceAnimations: boolean
//   optimalImageQuality: number
// }

// const MobilePerformanceContext = createContext<MobilePerformanceContextType>({
//   isMobile: false,
//   connectionType: "unknown",
//   shouldReduceAnimations: false,
//   optimalImageQuality: 80,
// })

// export const useMobilePerformance = () => useContext(MobilePerformanceContext)

// interface MobilePerformanceProviderProps {
//   children: ReactNode
// }

// export default function MobilePerformanceProvider({ children }: MobilePerformanceProviderProps) {
//   const [contextValue, setContextValue] = useState<MobilePerformanceContextType>({
//     isMobile: false,
//     connectionType: "unknown",
//     shouldReduceAnimations: false,
//     optimalImageQuality: 80,
//   })

//   useEffect(() => {
//     const optimizer = MobilePerformanceOptimizer.getInstance()

//     setContextValue({
//       isMobile: window.innerWidth <= 768,
//       connectionType: (navigator as any).connection?.effectiveType || "unknown",
//       shouldReduceAnimations: optimizer.shouldReduceAnimations(),
//       optimalImageQuality: optimizer.getOptimalImageQuality(),
//     })

//     // Initialize performance monitoring
//     initWebVitals()
//     observePerformance()

//     // Optimize resources
//     ResourceOptimizer.preconnectCriticalDomains()
//     ResourceOptimizer.deferNonCriticalResources()

//     // Handle connection change
//     const handleConnectionChange = () => {
//       setContextValue((prev) => ({
//         ...prev,
//         connectionType: (navigator as any).connection?.effectiveType || "unknown",
//         shouldReduceAnimations: optimizer.shouldReduceAnimations(),
//         optimalImageQuality: optimizer.getOptimalImageQuality(),
//       }))
//     }

//     if ("connection" in navigator) {
//       ;(navigator as any).connection.addEventListener("change", handleConnectionChange)

//       return () => {
//         ;(navigator as any).connection.removeEventListener("change", handleConnectionChange)
//       }
//     }
//   }, [])

//   return <MobilePerformanceContext.Provider value={contextValue}>{children}</MobilePerformanceContext.Provider>
// }
