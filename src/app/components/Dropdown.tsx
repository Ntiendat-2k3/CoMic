"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import { ChevronDown, X, Search } from "lucide-react"
import type { Category } from "../types/common"

interface DropdownProps {
  categories: Category[]
}

// Memoized Category Item
const CategoryItem = memo(({ category, onClick }: { category: Category; onClick: () => void }) => (
  <Link
    key={category._id}
    href={`/the-loai/${category.slug}`}
    onClick={onClick}
    className="truncate rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30 border border-transparent"
  >
    {category.name}
  </Link>
))

CategoryItem.displayName = "CategoryItem"

const Dropdown = memo(({ categories }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isClient, setIsClient] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Ensure we're on client side before rendering interactive elements
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Memoized filtered categories
  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  )

  // Memoized event handlers
  const handleToggle = useCallback(() => {
    if (!isClient) return
    setIsOpen((prev) => !prev)
  }, [isClient])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearch("")
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll on mobile
      if (typeof window !== "undefined") {
        document.body.style.overflow = "hidden"
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, isClient])

  // Memoized category items
  const categoryItems = useMemo(
    () =>
      filteredCategories.map((category) => (
        <CategoryItem key={category._id} category={category} onClick={handleClose} />
      )),
    [filteredCategories, handleClose],
  )

  // Show static version during SSR and initial hydration
  if (!isClient) {
    return (
      <div className="glass-button flex items-center gap-2 rounded-2xl px-4 md:px-6 py-3 font-semibold">
        <span>Thể loại</span>
        <ChevronDown size={18} />
      </div>
    )
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleToggle}
          className="glass-button flex items-center gap-2 rounded-2xl px-4 md:px-6 py-3 font-semibold transition-all duration-200 group touch-manipulation"
          aria-expanded={isOpen}
          aria-haspopup="true"
          suppressHydrationWarning
        >
          <span className="group-hover:gradient-text transition-all duration-200">Thể loại</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} group-hover:text-pink-400`}
          />
        </button>

        {/* Desktop Dropdown */}
        {isOpen && (
          <div className="hidden md:block absolute top-full right-0 mt-2 w-96 lg:w-[600px] rounded-2xl glass-dark text-white shadow-xl z-[9999] border border-pink-glow/30">
            {/* Search */}
            <div className="border-b border-white/10 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm thể loại..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
                  autoComplete="off"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Categories */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-4 lg:grid-cols-3">{categoryItems}</div>
            </div>

            {/* Stats */}
            <div className="border-t border-white/10 p-4 text-sm">
              <span className="text-glass-muted">
                Tổng số: <span className="text-pink-400 font-semibold">{filteredCategories.length}</span> thể loại
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Fullscreen Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900/95 backdrop-blur-md border-b border-pink-glow/30">
              <h2 className="text-lg font-semibold text-white">Chọn thể loại</h2>
              <button
                type="button"
                onClick={handleClose}
                className="glass-button p-2 rounded-full touch-manipulation active:scale-95 transition-transform duration-150"
                aria-label="Đóng"
                suppressHydrationWarning
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
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
                  autoComplete="off"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="flex-1 overflow-y-auto bg-gray-900/95 backdrop-blur-md">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {filteredCategories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/the-loai/${category.slug}`}
                      onClick={handleClose}
                      className="glass-button p-4 rounded-xl text-center font-medium transition-all duration-200 text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30 border border-transparent touch-manipulation active:scale-95"
                      suppressHydrationWarning
                    >
                      <div className="truncate">{category.name}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 border-t border-white/10 bg-gray-800/50">
                <div className="text-center text-sm text-glass-muted">
                  Hiển thị <span className="text-pink-400 font-semibold">{filteredCategories.length}</span> /{" "}
                  {categories.length} thể loại
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

Dropdown.displayName = "Dropdown"

export default Dropdown
