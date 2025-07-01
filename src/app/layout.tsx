import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Love_Ya_Like_A_Sister } from "next/font/google"
import "./globals.scss"
import { ClerkProvider } from "@clerk/nextjs"
import ErrorBoundary from "./components/ErrorBoundary"
import ProgressiveWebApp from "./components/ProgressiveWebApp"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
})

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  variable: "--font-love-ya-like-a-sister",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: "TruyenHay - Đọc truyện tranh online miễn phí",
    template: "%s | TruyenHay",
  },
  description:
    "Đọc truyện tranh online miễn phí với kho truyện phong phú. Manga, Manhwa, Manhua được cập nhật liên tục.",
  keywords: ["truyện tranh", "manga", "manhwa", "manhua", "đọc truyện online", "truyện miễn phí"],
  authors: [{ name: "TruyenHay Team" }],
  creator: "TruyenHay",
  publisher: "TruyenHay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://truyenhay.com",
    siteName: "TruyenHay",
    title: "TruyenHay - Đọc truyện tranh online miễn phí",
    description: "Kho truyện tranh online lớn nhất Việt Nam với hàng ngàn bộ truyện hay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TruyenHay - Đọc truyện tranh online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TruyenHay - Đọc truyện tranh online miễn phí",
    description: "Kho truyện tranh online lớn nhất Việt Nam",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://truyenhay.com",
  },
  category: "entertainment",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="vi" suppressHydrationWarning>
        <head>
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://img.otruyenapi.com" />
          <link rel="preconnect" href="https://otruyenapi.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          {/* DNS prefetch for better performance */}
          <link rel="dns-prefetch" href="https://img.otruyenapi.com" />
          <link rel="dns-prefetch" href="https://otruyenapi.com" />

          {/* Viewport meta for better mobile experience */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />

          {/* Theme color for mobile browsers */}
          <meta name="theme-color" content="#ec4899" />
          <meta name="msapplication-TileColor" content="#ec4899" />

          {/* Apple specific meta tags */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="TruyenHay" />

          {/* Structured data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "TruyenHay",
                url: "https://truyenhay.com",
                description: "Đọc truyện tranh online miễn phí",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://truyenhay.com/tim-kiem?keyword={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${loveYaLikeASister.variable} optimize-text`}
          suppressHydrationWarning
        >
          <ErrorBoundary>
            {children}
            <ProgressiveWebApp />
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  )
}
