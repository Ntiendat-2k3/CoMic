import type { Metadata } from "next";
import { Geist, Geist_Mono, Love_Ya_Like_A_Sister } from "next/font/google";
import "./globals.scss";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  variable: "--font-love-ya-like-a-sister",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "TruyenHay",
  description: "Đọc truyện tranh online",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${loveYaLikeASister.variable}`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
