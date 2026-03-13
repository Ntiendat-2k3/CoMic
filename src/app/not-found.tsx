"use client"

import Link from "next/link"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-gray-700 mb-4 select-none">404</div>

        <h1 className="text-2xl font-bold mb-3">Trang không tồn tại</h1>
        <p className="text-gray-400 mb-8">
          Có thể bạn đã gõ sai đường dẫn hoặc trang này đã bị gỡ bỏ.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-colors"
          >
            <Home size={16} />
            Trang chủ
          </Link>
          <Link
            href="/tim-kiem"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
          >
            <Search size={16} />
            Tìm kiếm
          </Link>
        </div>
      </div>
    </main>
  )
}
