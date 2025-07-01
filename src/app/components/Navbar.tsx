"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, Bookmark, Clock, Heart, X } from "lucide-react"

import OTruyenService from "../services/otruyen.service"
import type { Category } from "../types/common"
import type { Comic } from "../types/comic"
import Search from "./Search"
import AuthButtons from "./AuthButtons"
import { navItems } from "./Sidebar"

const Dropdown = dynamic(() => import("./Dropdown"), {
  loading: () => <div className="w-20 md:w-40 h-6 glass-dark rounded-xl animate-pulse shimmer-pink" />,
  ssr: false,
})

interface NavbarProps {
  categories: Category[]
}

export default function Navbar({ categories }: NavbarProps) {
  const [searchResults, setSearchResults] = useState<Comic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (!isClient) return

    if (mobileOpen && typeof window !== "undefined") {
      document.body.style.overflow = "hidden"
    } else if (typeof window !== "undefined") {
      document.body.style.overflow = "unset"
    }

    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = "unset"
      }
    }
  }, [mobileOpen, isClient])

  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return setSearchResults([])

    setIsLoading(true)
    try {
      const res = await OTruyenService.searchComics(keyword)
      setSearchResults(res.data.data.items)
      setShowSuggestions(true)
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearchSubmit = useCallback(
    (keyword: string) => {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`)
      setShowSuggestions(false)
    },
    [router],
  )

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false)
  }, [])

  return (
    <nav className="w-full nav-glass top-0 z-40 border-b border-pink-glow">
      {/* Pink Glow Line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-pink-300 opacity-60"></div>

      <div className="mx-auto flex-col lg:flex max-w-7xl flex-wrap items-center justify-between gap-y-4 px-4 py-5 md:flex-nowrap">
        {/* Logo + hamburger */}
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-pink">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-300" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300 logo-glow-pulse">
              TruyenHay
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="block md:hidden">
              <AuthButtons variant="mobile" />
            </div>
            <button
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((o) => !o)}
              className="glass-button p-3 rounded-2xl md:hidden pulse-pink touch-manipulation"
              suppressHydrationWarning
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop utilities */}
        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          {/* Search desktop */}
          <div className="flex-1 max-w-lg">
            <Search
              searchResults={searchResults}
              isLoading={isLoading}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              onSearch={handleSearch}
              onSubmit={handleSearchSubmit}
            />
          </div>

          {/* Navigation Links */}
          {isClient && <Dropdown categories={categories} />}

          <Link
            prefetch
            href="/lich-su"
            className="glass-button flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold group"
          >
            <Clock size={18} className="group-hover:text-pink-400 transition-colors duration-300" />
            <span className="group-hover:gradient-text transition-all duration-300">Lịch sử</span>
          </Link>

          <Link
            href="/yeu-thich"
            className="glass-button flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold group glow-pink"
          >
            <Bookmark size={18} className="group-hover:text-pink-400 transition-colors duration-300" />
            <span className="group-hover:gradient-text-accent transition-all duration-300">Yêu thích</span>
          </Link>

          {/* Auth */}
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        {mobileOpen && isClient && (
          <div className="fixed inset-0 top-[88px] z-30 bg-gray-900/95 backdrop-blur-md md:hidden">
            <div className="flex h-full flex-col overflow-y-auto">
              <div className="flex-1 p-4 space-y-4">
                {/* Search mobile */}
                <div className="w-full mb-6">
                  <Search
                    searchResults={searchResults}
                    isLoading={isLoading}
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                    onSearch={handleSearch}
                    onSubmit={handleSearchSubmit}
                  />
                </div>

                {/* Sidebar nav items */}
                <div className="space-y-3">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={`/danh-sach${href}`}
                      className="glass-button flex w-full items-center gap-4 rounded-2xl p-4 font-semibold group touch-manipulation active:scale-95"
                      onClick={closeMobileMenu}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 glow-pink">
                        <Icon size={20} />
                      </div>
                      <span className="group-hover:gradient-text transition-all duration-300">{label}</span>
                    </Link>
                  ))}
                </div>

                {/* Categories - Simple List for Mobile */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white px-2">Thể loại</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {categories.slice(0, 20).map((category) => (
                        <Link
                          key={category._id}
                          href={`/the-loai/${category.slug}`}
                          onClick={closeMobileMenu}
                          className="glass-button p-3 rounded-xl text-center text-sm font-medium transition-all duration-300 text-glass-muted hover:text-white hover:bg-pink-500/10 touch-manipulation active:scale-95"
                        >
                          <div className="truncate">{category.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {categories.length > 20 && (
                    <Link
                      href="/the-loai"
                      onClick={closeMobileMenu}
                      className="glass-button block text-center p-3 rounded-xl text-sm font-medium text-pink-400 hover:text-white hover:bg-pink-500/10 touch-manipulation"
                    >
                      Xem tất cả {categories.length} thể loại →
                    </Link>
                  )}
                </div>

                <Link
                  prefetch
                  href="/lich-su"
                  onClick={closeMobileMenu}
                  className="glass-button flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold group touch-manipulation active:scale-95"
                >
                  <Clock size={20} className="group-hover:text-pink-400 transition-colors duration-300" />
                  <span className="group-hover:gradient-text transition-all duration-300">Lịch sử</span>
                </Link>

                <Link
                  href="/yeu-thich"
                  className="glass-button flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold group glow-pink touch-manipulation active:scale-95"
                  onClick={closeMobileMenu}
                >
                  <Bookmark size={20} className="group-hover:text-pink-400 transition-colors duration-300" />
                  <span className="group-hover:gradient-text-accent transition-all duration-300">Yêu thích</span>
                </Link>

                <div className="pt-4">
                  <AuthButtons />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Pink Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-400 to-pink-600 opacity-40"></div>
    </nav>
  )
}
