"use client"

import type React from "react"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { ChevronDown, X, Search } from "lucide-react"
import type { Category } from "../types/common"

interface DropdownProps {
  categories: Category[]
}

export default function Dropdown({ categories }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close on outside click
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", close)
      return () => document.removeEventListener("mousedown", close)
    }
  }, [isOpen])

  // Prevent body scroll when mobile dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen])

  // Memoized filtered categories
  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearch("")
  }, [])

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }, [])

  const handleCategoryClick = useCallback(() => {
    handleClose()
  }, [handleClose])

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="glass-button flex items-center gap-2 rounded-2xl px-4 md:px-6 py-3 font-semibold">
        <span>Thể loại</span>
        <ChevronDown size={18} />
      </div>
    )
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        className="glass-button flex items-center gap-2 rounded-2xl px-4 md:px-6 py-3 font-semibold transition-all duration-300 group touch-manipulation select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="group-hover:gradient-text transition-all duration-300">Thể loại</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} group-hover:text-pink-400`}
        />
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <>
          {/* Mobile View */}
          <div className="md:hidden fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm">
            <div className="flex h-full flex-col animate-in slide-in-from-top-4 duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gray-900/95 backdrop-blur-md border-b border-pink-glow/30">
                <h2 className="text-lg font-semibold text-white">Chọn thể loại</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="glass-button p-2 rounded-full touch-manipulation"
                  aria-label="Đóng"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm thể loại..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Categories Grid */}
              <div className="flex-1 overflow-y-auto bg-gray-900/95 backdrop-blur-md">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {filtered.map((c) => (
                      <Link
                        key={c._id}
                        href={`/the-loai/${c.slug}`}
                        onClick={handleCategoryClick}
                        className="glass-button p-4 rounded-xl text-center font-medium transition-all duration-300 text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30 border border-transparent touch-manipulation active:scale-95"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <div className="truncate">{c.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4 border-t border-white/10 bg-gray-800/50">
                  <div className="text-center text-sm text-glass-muted">
                    Hiển thị <span className="text-pink-400 font-semibold">{filtered.length}</span> /{" "}
                    {categories.length} thể loại
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden md:block absolute top-full left-0 mt-2 w-[90vw] max-w-none sm:left-auto sm:right-0 sm:w-72 md:w-96 lg:w-[600px] rounded-2xl glass-dark text-white shadow-xl z-[100] border border-pink-glow/30 animate-in slide-in-from-top-2 duration-200">
            {/* Search */}
            <div className="border-b border-white/10 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm thể loại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
                {filtered.map((c) => (
                  <Link
                    key={c._id}
                    href={`/the-loai/${c.slug}`}
                    onClick={handleCategoryClick}
                    className="truncate rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30 border border-transparent"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-white/10 p-4 text-sm">
              <span className="text-glass-muted">
                Tổng số: <span className="text-pink-400 font-semibold">{filtered.length}</span> thể loại
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
