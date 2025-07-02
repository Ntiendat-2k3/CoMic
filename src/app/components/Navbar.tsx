"use client"

import type React from "react"

import { useState, useCallback, useEffect, memo, useMemo } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, Bookmark, Clock, Heart, X, ChevronDown } from "lucide-react"

import OTruyenService from "../services/otruyen.service"
import type { Category } from "../types/common"
import type { Comic } from "../types/comic"
import { navItems } from "./Sidebar"

// Lazy load heavy components with better loading states
const Search = dynamic(() => import("./Search"), {
  loading: () => <div className="w-full max-w-lg h-10 bg-gray-800/30 rounded-lg" />,
  ssr: false,
})

const AuthButtons = dynamic(() => import("./AuthButtons"), {
  loading: () => <div className="w-20 h-8 bg-gray-800/30 rounded-lg" />,
  ssr: false,
})

const Dropdown = dynamic(() => import("./Dropdown"), {
  loading: () => <div className="w-20 md:w-32 h-8 bg-gray-800/30 rounded-xl" />,
  ssr: false,
})

interface NavbarProps {
  categories: Category[]
}

// Optimized Logo Component with reduced effects
const Logo = memo(() => (
  <Link href="/" className="flex items-center space-x-4 group">
    <div className="relative">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center transform-gpu transition-transform duration-200 md:group-hover:scale-105">
        <Heart className="w-6 h-6 text-white fill-current" />
      </div>
    </div>
    <span className="text-2xl md:text-3xl font-bold text-white transform-gpu transition-transform duration-200 md:group-hover:scale-105">
      TruyenHay
    </span>
  </Link>
))

Logo.displayName = "Logo"

// Optimized Navigation Link Component
const NavLink = memo(
  ({
    href,
    icon: Icon,
    label,
    className = "",
    onClick,
  }: {
    href: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    label: string
    className?: string
    onClick?: () => void
  }) => (
    <Link
      href={href}
      className={`bg-gray-800/40 border border-gray-700/50 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold group transition-all duration-200 transform-gpu md:hover:bg-gray-700/50 md:hover:border-pink-500/30 ${className}`}
      onClick={onClick}
      prefetch={false}
    >
      <Icon size={18} className="md:group-hover:text-pink-400 transition-colors duration-200" />
      <span className="md:group-hover:text-pink-300 transition-colors duration-200">{label}</span>
    </Link>
  ),
)

NavLink.displayName = "NavLink"

// Simplified Mobile Menu Item
const MobileMenuItem = memo(
  ({
    href,
    icon: Icon,
    label,
    onClick,
  }: {
    href: string
    icon: React.ComponentType<{ size?: number }>
    label: string
    onClick: () => void
  }) => (
    <Link
      href={href}
      className="bg-gray-800/40 border border-gray-700/50 flex w-full items-center gap-4 rounded-2xl p-4 font-semibold group touch-manipulation active:scale-95 transition-transform duration-150 md:hover:bg-gray-700/50"
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
        <Icon size={20} />
      </div>
      <span className="md:group-hover:text-pink-300 transition-colors duration-200">{label}</span>
    </Link>
  ),
)

MobileMenuItem.displayName = "MobileMenuItem"

// Main Navbar Component - Heavily Optimized
const Navbar = memo(({ categories }: NavbarProps) => {
  const [searchResults, setSearchResults] = useState<Comic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Prevent body scroll when mobile menu is open - optimized
  useEffect(() => {
    if (!isClient) return

    if (mobileOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [mobileOpen, isClient])

  // Debounced search handler
  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const res = await OTruyenService.searchComics(keyword)
      setSearchResults(res.data.data.items)
      setShowSuggestions(true)
    } catch (err) {
      console.error("Search error:", err)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Optimized search submit handler
  const handleSearchSubmit = useCallback(
    (keyword: string) => {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`)
      setShowSuggestions(false)
    },
    [router],
  )

  // Optimized mobile menu handlers
  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false)
    setMobileCategoriesOpen(false)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev)
  }, [])

  const toggleMobileCategories = useCallback(() => {
    setMobileCategoriesOpen((prev) => !prev)
  }, [])

  // Memoized mobile menu items
  const mobileNavItems = useMemo(
    () =>
      navItems.map(({ href, label, icon }) => (
        <MobileMenuItem key={href} href={`/danh-sach${href}`} icon={icon} label={label} onClick={closeMobileMenu} />
      )),
    [closeMobileMenu],
  )

  // Simplified categories grid - only render when open
  const categoriesGrid = useMemo(() => {
    if (!mobileCategoriesOpen) return null

    return (
      <div className="grid grid-cols-2 gap-2">
        {categories.slice(0, 20).map((category) => (
          <Link
            key={category._id}
            href={`/the-loai/${category.slug}`}
            onClick={closeMobileMenu}
            className="bg-gray-800/40 border border-gray-700/50 p-3 rounded-xl text-center text-sm font-medium transition-all duration-200 text-gray-300 md:hover:text-white md:hover:bg-gray-700/50 touch-manipulation active:scale-95"
          >
            <div className="truncate">{category.name}</div>
          </Link>
        ))}
      </div>
    )
  }, [categories, closeMobileMenu, mobileCategoriesOpen])

  return (
    <nav
      className="w-full sticky top-0 z-40 bg-gray-900/80 border-b border-pink-500/20"
      style={{ willChange: "transform" }}
    >
      {/* Simplified Pink Glow Line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-pink-300 opacity-60"></div>

      <div className="mx-auto flex-col lg:flex max-w-7xl flex-wrap items-center justify-between gap-y-4 px-4 py-5 md:flex-nowrap">
        {/* Logo + hamburger */}
        <div className="flex w-full items-center justify-between md:w-auto">
          <Logo />

          <div className="flex items-center gap-3">
            {isClient && (
              <div className="block md:hidden">
                <AuthButtons variant="mobile" />
              </div>
            )}
            <button
              aria-label="Toggle navigation"
              onClick={toggleMobileMenu}
              className="bg-gray-800/40 border border-gray-700/50 p-3 rounded-2xl md:hidden touch-manipulation transition-transform duration-150 active:scale-95 transform-gpu"
              suppressHydrationWarning
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop utilities */}
        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          {/* Search desktop */}
          {isClient && (
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
          )}

          {/* Navigation Links */}
          {isClient && <Dropdown categories={categories} />}

          <NavLink href="/lich-su" icon={Clock} label="Lịch sử" />
          <NavLink href="/yeu-thich" icon={Bookmark} label="Yêu thích" className="border-pink-500/30 bg-pink-500/10" />

          {/* Auth */}
          {isClient && <AuthButtons />}
        </div>

        {/* Optimized Mobile Menu - Simplified */}
        {mobileOpen && isClient && (
          <div
            className="fixed inset-0 top-[88px] z-30 bg-gray-900/95 md:hidden"
            style={{
              willChange: "transform",
              transform: "translate3d(0, 0, 0)",
            }}
          >
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
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
                  <div className="space-y-3">{mobileNavItems}</div>

                  {/* Categories Dropdown Button for Mobile */}
                  <div className="space-y-3">
                    <button
                      onClick={toggleMobileCategories}
                      className="bg-gray-800/40 border border-gray-700/50 flex w-full items-center justify-between gap-4 rounded-2xl p-4 font-semibold group touch-manipulation active:scale-95 transition-transform duration-150"
                      suppressHydrationWarning
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
                          <Heart size={20} />
                        </div>
                        <span className="md:group-hover:text-pink-300 transition-colors duration-200">Thể loại</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""} md:group-hover:text-pink-400`}
                      />
                    </button>

                    {/* Categories List - Conditional Render */}
                    {mobileCategoriesOpen && (
                      <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 max-h-60 overflow-y-auto">
                        {categoriesGrid}
                      </div>
                    )}
                  </div>

                  <NavLink href="/lich-su" icon={Clock} label="Lịch sử" onClick={closeMobileMenu} />
                  <NavLink
                    href="/yeu-thich"
                    icon={Bookmark}
                    label="Yêu thích"
                    className="border-pink-500/30 bg-pink-500/10"
                    onClick={closeMobileMenu}
                  />

                  <div className="pt-4">
                    <AuthButtons />
                  </div>
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
})

Navbar.displayName = "Navbar"

export default Navbar
