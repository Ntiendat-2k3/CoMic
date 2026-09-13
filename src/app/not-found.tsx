"use client"

import Link from "next/link"
import { Home, Search } from "lucide-react"
import { useDictionary } from "@/i18n/I18nProvider"

export default function NotFound() {
  const { errors } = useDictionary()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-gray-700 mb-4 select-none">404</div>

        <h1 className="text-2xl font-bold mb-3">{errors.notFoundTitle}</h1>
        <p className="text-gray-400 mb-8">
          {errors.notFoundDescription}
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-colors"
          >
            <Home size={16} />
            {errors.backHome}
          </Link>
          <Link
            href="/tim-kiem"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
          >
            <Search size={16} />
            {errors.search}
          </Link>
        </div>
      </div>
    </main>
  )
}
