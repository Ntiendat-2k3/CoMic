import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.scss"
import ErrorBoundary from "@/components/app/ErrorBoundary"
import ProgressiveWebApp from "@/components/app/ProgressiveWebApp"
import ServiceWorkerRegistration from "@/components/app/ServiceWorkerRegistration"
import AppProviders from "@/providers/AppProviders"
import { getDictionary } from "@/i18n/dictionaries"
import {
  MANGADEX_COVER_BASE_URL,
} from "@/infrastructure/mangadex/mangadex.config"

const dictionary = getDictionary()
const mangaDexCoverOrigin = new URL(MANGADEX_COVER_BASE_URL).origin
const beVietnamPro = localFont({
  src: "./fonts/BeVietnamPro-Variable.ttf",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-be-vietnam-pro",
  fallback: ["system-ui", "Arial"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: dictionary.brand.defaultTitle,
    template: dictionary.brand.titleTemplate,
  },
  description: dictionary.brand.description,
  icons: {
    icon: [{ url: "/assets/logo.png", type: "image/png", sizes: "500x500" }],
    shortcut: "/assets/logo.png",
    apple: [{ url: "/assets/logo.png", type: "image/png", sizes: "500x500" }],
  },
  keywords: dictionary.brand.keywords,
  authors: [{ name: dictionary.brand.team }],
  creator: dictionary.brand.name,
  publisher: dictionary.brand.name,
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
    siteName: dictionary.brand.name,
    title: dictionary.brand.defaultTitle,
    description: dictionary.brand.description,
    images: [{
      url: '/assets/logo.png',
      width: 500,
      height: 500,
      alt: dictionary.brand.defaultTitle
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: dictionary.brand.defaultTitle,
    description: dictionary.brand.description,
    images: ['/assets/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  manifest: "/manifest.webmanifest",
  other: {
    "geo.region": "VN",
    "geo.placename": "Vietnam",
    "geo.position": "14.058324;108.277199",
    "ICBM": "14.058324, 108.277199"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={dictionary.locale.split("-")[0]}
      className={beVietnamPro.variable}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href={mangaDexCoverOrigin} />
        <link rel="preconnect" href={mangaDexCoverOrigin} crossOrigin="anonymous" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={dictionary.brand.name} />
      </head>
      <body suppressHydrationWarning>
        <AppProviders dictionary={dictionary}>
          <ErrorBoundary copy={dictionary.errors}>
            <ServiceWorkerRegistration />
            {children}
            <ProgressiveWebApp />
          </ErrorBoundary>
        </AppProviders>
      </body>
    </html>
  )
}
