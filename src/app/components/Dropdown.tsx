"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import type { Category } from "../types/common"

interface DropdownProps {
  categories: Category[]
}

export default function Dropdown({ categories }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  /* -------------------- Đóng khi click ra ngoài ----------------------- */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  /* ------------------------- Lọc thể loại ----------------------------- */
  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="glass-button flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 group"
      >
        <span className="group-hover:gradient-text transition-all duration-300">Thể loại</span>
        {/* Icon mũi tên – xoay khi mở */}
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} group-hover:text-pink-400`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-[90vw] max-w-none
                     sm:left-auto sm:right-0 sm:w-72
                     md:w-96 lg:w-[600px]
                     rounded-2xl glass-dark text-white shadow-xl z-50 border border-pink-glow/30"
        >
          {/* Thanh tìm kiếm */}
          <div className="border-b border-white/10 p-4">
            <input
              autoFocus
              placeholder="Tìm thể loại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl glass-input px-4 py-3 text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
            />
          </div>

          {/* Danh sách */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
              {filtered.map((c) => (
                <Link
                  key={c._id}
                  href={`/the-loai/${c.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="truncate rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300
                           text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30
                           border border-transparent"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Thống kê */}
          <div className="border-t border-white/10 p-4 text-sm hidden lg:block md:block">
            <span className="text-glass-muted">
              Tổng số: <span className="text-pink-400 font-semibold">{filtered.length}</span> thể loại
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
