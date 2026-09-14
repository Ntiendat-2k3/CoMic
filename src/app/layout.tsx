import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.scss"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import ErrorBoundary from "@/components/app/ErrorBoundary"
import ProgressiveWebApp from "@/components/app/ProgressiveWebApp"
import PerformanceMonitor from "@/components/app/PerformanceMonitor"
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
      url: '/icons/icon-512x512.png',
      width: 512,
      height: 512,
      alt: dictionary.brand.defaultTitle
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: dictionary.brand.defaultTitle,
    description: dictionary.brand.description,
    images: ['/icons/icon-512x512.png'],
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
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ec4899",
          colorBackground: "#0a0a0f",
          colorText: "white",
          colorInputText: "white",
        },
        elements: {
          card: "border border-pink-500/20 shadow-2xl shadow-pink-500/10",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          logoImage: "hidden",
          socialButtonsBlockButton: "border border-gray-700/50 bg-gray-900/50 hover:bg-gray-800",
          formButtonPrimary: "bg-pink-500 hover:bg-pink-600 shadow-md",
          formFieldInput: "bg-gray-900/50 border border-gray-700/50 focus:border-pink-500 focus:ring-pink-500",
          footerActionLink: "text-pink-400 hover:text-pink-300",
          dividerText: "text-gray-500",
          dividerLine: "bg-gray-700/50",
        }
      }}
    >
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
