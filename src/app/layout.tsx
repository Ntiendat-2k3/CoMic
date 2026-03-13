import type React from "react"
import type { Metadata } from "next"
import "./globals.scss"
import { ClerkProvider } from "@clerk/nextjs"
import ErrorBoundary from "@/components/app/ErrorBoundary"
import ProgressiveWebApp from "@/components/app/ProgressiveWebApp"
import PerformanceMonitor from "@/components/app/PerformanceMonitor"
import AppProviders from "@/providers/AppProviders"

export const metadata: Metadata = {
  title: {
    default: "TruyenHay - Đọc truyện tranh online miễn phí",
    template: "%s | TruyenHay",
  },
  description:
    "Đọc truyện tranh online miễn phí với kho truyện phong phú. Manga, Manhwa, Manhua được cập nhật liên tục.",
  keywords: ["truyện tranh", "manga", "manhwa", "manhua", "đọc truyện online", "truyện miễn phí"],
  manifest: "/manifest.json",
  openGraph: { type: "website", locale: "vi_VN", siteName: "TruyenHay" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="vi" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://img.otruyenapi.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://otruyenapi.com" />
          <meta name="theme-color" content="#ec4899" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="TruyenHay" />
        </head>
        <body suppressHydrationWarning>
          <AppProviders>
            <ErrorBoundary>
              <PerformanceMonitor />
              {children}
              <ProgressiveWebApp />
            </ErrorBoundary>
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
