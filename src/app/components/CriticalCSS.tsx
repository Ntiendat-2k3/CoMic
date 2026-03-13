// "use client"

// import { useEffect } from "react"

// export default function CriticalCSS() {
//   useEffect(() => {
//     // Load non-critical CSS after page load
//     const loadNonCriticalCSS = () => {
//       const nonCriticalCSS = [
//         // Add any non-critical CSS files here
//       ]

//       nonCriticalCSS.forEach((href) => {
//         const link = document.createElement("link")
//         link.rel = "stylesheet"
//         link.href = href
//         link.media = "print"
//         link.onload = () => {
//           link.media = "all"
//         }
//         document.head.appendChild(link)
//       })
//     }

//     // Load after initial render
//     if (document.readyState === "complete") {
//       loadNonCriticalCSS()
//     } else {
//       window.addEventListener("load", loadNonCriticalCSS)
//       return () => window.removeEventListener("load", loadNonCriticalCSS)
//     }
//   }, [])

//   return null
// }
