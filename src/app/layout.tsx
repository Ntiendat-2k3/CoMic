import type React from "react"
import type { Metadata } from "next"
import "./globals.scss"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import ErrorBoundary from "@/components/app/ErrorBoundary"
import ProgressiveWebApp from "@/components/app/ProgressiveWebApp"
import PerformanceMonitor from "@/components/app/PerformanceMonitor"
import AppProviders from "@/providers/AppProviders"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "TruyenHay - Đọc truyện tranh online miễn phí",
    template: "%s | TruyenHay",
  },
  description:
    "Đọc truyện tranh online miễn phí với kho truyện phong phú. Manga, Manhwa, Manhua được cập nhật liên tục.",
  keywords: ["truyện tranh", "manga", "manhwa", "manhua", "đọc truyện online", "truyện miễn phí", "truyện tranh hay", "comic việt", "đọc manga"],
  authors: [{ name: "TruyenHay Team" }],
  creator: "TruyenHay",
  publisher: "TruyenHay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "TruyenHay",
    title: "TruyenHay - Đọc truyện tranh online miễn phí",
    description: "Đọc truyện tranh online miễn phí với kho truyện phong phú. Manga, Manhwa, Manhua được cập nhật liên tục.",
    images: [{
      url: '/icons/icon-512x512.png',
      width: 512,
      height: 512,
      alt: 'TruyenHay - Đọc truyện tranh online miễn phí'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "TruyenHay - Đọc truyện tranh online miễn phí",
    description: "Đọc truyện tranh online miễn phí với kho truyện phong phú. Manga, Manhwa, Manhua được cập nhật liên tục.",
    images: ['/icons/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "VN",
    "geo.placename": "Vietnam",
    "geo.position": "14.058324;108.277199",
    "ICBM": "14.058324, 108.277199"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ec4899", // pink-500 from Tailwind
          colorBackground: "#0a0a0f", // Very dark background matching the site
          colorText: "white",
          colorInputText: "white",
        },
        elements: {
          card: "border border-pink-500/20 shadow-2xl shadow-pink-500/10",
          headerTitle: "hidden", // Hide "Sign in to comic_website"
          headerSubtitle: "hidden", // Hide "Welcome back..."
          logoImage: "hidden", // Hide default Clerk logo
          socialButtonsBlockButton: "border border-gray-700/50 bg-gray-900/50 hover:bg-gray-800",
          formButtonPrimary: "bg-pink-500 hover:bg-pink-600 shadow-md",
          formFieldInput: "bg-gray-900/50 border border-gray-700/50 focus:border-pink-500 focus:ring-pink-500",
          footerActionLink: "text-pink-400 hover:text-pink-300",
          dividerText: "text-gray-500",
          dividerLine: "bg-gray-700/50",
        }
      }}
    >
      <html lang="vi" suppressHydrationWarning>
        <head>
          <link rel="dns-prefetch" href="https://img.otruyenapi.com" />
          <link rel="dns-prefetch" href="https://otruyenapi.com" />
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
