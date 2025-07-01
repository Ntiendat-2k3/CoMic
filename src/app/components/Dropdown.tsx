"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { ChevronDown, X, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Category } from "../types/common"

interface DropdownProps {
  categories: Category[]
}

export default function Dropdown({ categories }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close on outside click (desktop only)
  useEffect(() => {
    if (isMobile) return // Don't use outside click on mobile

    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", close)
      return () => document.removeEventListener("mousedown", close)
    }
  }, [isOpen, isMobile])

  // Prevent body scroll when mobile dropdown is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isMobile, isOpen])

  // Memoized filtered categories
  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  )

  // Debounced search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearch("") // Reset search when closing
  }, [])

  const handleCategoryClick = useCallback(() => {
    handleClose()
  }, [handleClose])

  // Mobile animations
  const mobileVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Desktop animations
  const desktopVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
      },
    },
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="glass-button flex items-center gap-2 rounded-2xl px-4 md:px-6 py-3 font-semibold transition-all duration-300 group touch-manipulation"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="group-hover:gradient-text transition-all duration-300">Thể loại</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} group-hover:text-pink-400`}
          style={{ willChange: "transform" }}
        />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {isMobile ? (
              // Mobile: Fullscreen Overlay
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={mobileVariants}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="flex h-full flex-col">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-md border-b border-pink-glow/30">
                    <h2 className="text-lg font-semibold text-white">Chọn thể loại</h2>
                    <button
                      onClick={handleClose}
                      className="glass-button p-2 rounded-full touch-manipulation"
                      aria-label="Đóng"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Mobile Search */}
                  <div className="p-4 bg-gray-900/90 backdrop-blur-md border-b border-white/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        autoFocus
                        placeholder="Tìm thể loại..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Mobile Categories Grid */}
                  <div className="flex-1 overflow-y-auto bg-gray-900/95 backdrop-blur-md">
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {filtered.map((c) => (
                          <Link
                            key={c._id}
                            href={`/the-loai/${c.slug}`}
                            onClick={handleCategoryClick}
                            className="glass-button p-4 rounded-xl text-center font-medium transition-all duration-300
                                     text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30
                                     border border-transparent touch-manipulation active:scale-95"
                          >
                            <div className="truncate">{c.name}</div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="p-4 border-t border-white/10 bg-gray-800/50">
                      <div className="text-center text-sm text-glass-muted">
                        Hiển thị <span className="text-pink-400 font-semibold">{filtered.length}</span> /{" "}
                        {categories.length} thể loại
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Desktop: Dropdown
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={desktopVariants}
                className="absolute top-full left-0 mt-2 w-[90vw] max-w-none
                         sm:left-auto sm:right-0 sm:w-72
                         md:w-96 lg:w-[600px]
                         rounded-2xl glass-dark text-white shadow-xl z-50 border border-pink-glow/30"
                style={{ willChange: "transform, opacity" }}
              >
                {/* Desktop Search */}
                <div className="border-b border-white/10 p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      autoFocus
                      placeholder="Tìm thể loại..."
                      value={search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl glass-input text-white focus:outline-none focus:border-pink-400/50 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Desktop Categories */}
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
                    {filtered.map((c) => (
                      <Link
                        key={c._id}
                        href={`/the-loai/${c.slug}`}
                        onClick={handleCategoryClick}
                        className="truncate rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300
                                 text-glass-muted hover:text-white hover:bg-pink-500/10 hover:border-pink-400/30
                                 border border-transparent"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Desktop Stats */}
                <div className="border-t border-white/10 p-4 text-sm">
                  <span className="text-glass-muted">
                    Tổng số: <span className="text-pink-400 font-semibold">{filtered.length}</span> thể loại
                  </span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
