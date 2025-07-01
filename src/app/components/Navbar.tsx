"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, Bookmark, Clock, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import OTruyenService from "../services/otruyen.service"
import type { Category } from "../types/common"
import type { Comic } from "../types/comic"
import Search from "./Search"
import AuthButtons from "./AuthButtons"
import { navItems } from "./Sidebar"

const Dropdown = dynamic(() => import("./Dropdown"), {
  loading: () => <div className="w-40 h-6 glass-purple rounded-xl animate-pulse shimmer-purple" />,
})

interface NavbarProps {
  categories: Category[]
}

export default function Navbar({ categories }: NavbarProps) {
  const [searchResults, setSearchResults] = useState<Comic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const router = useRouter()

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

  return (
    <nav className="w-full nav-glass sticky top-0 z-50 border-b border-purple-glow">
      {/* Purple Glow Line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-primary opacity-60"></div>

      <div className="mx-auto flex-col lg:flex max-w-7xl flex-wrap items-center justify-between gap-y-4 px-4 py-5 md:flex-nowrap">
        {/* Logo + hamburger */}
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-purple">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div className="absolute inset-0 w-12 h-12 rounded-2xl bg-gradient-primary opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-300" />
            </div>
            <span className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
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
              className="glass-button p-3 rounded-2xl md:hidden pulse-purple"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Desktop utilities */}
        <div className="hidden items-center gap-8 lg:gap-10 md:flex">
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
          <Dropdown categories={categories} />

          <Link
            prefetch
            href="/lich-su"
            className="glass-button flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold group"
          >
            <Clock size={18} className="group-hover:text-purple-light transition-colors duration-300" />
            <span className="group-hover:gradient-text transition-all duration-300">Lịch sử</span>
          </Link>

          <Link
            href="/yeu-thich"
            className="glass-button flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold group glow-pink"
          >
            <Bookmark size={18} className="group-hover:text-accent transition-colors duration-300" />
            <span className="group-hover:gradient-text-accent transition-all duration-300">Yêu thích</span>
          </Link>

          {/* Auth */}
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobileMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex w-full flex-col gap-6 lg:gap-8 md:hidden glass-purple rounded-3xl p-6 mt-6 border-gradient-purple"
            >
              {/* Sidebar nav items */}
              <div className="w-full space-y-4">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={`/danh-sach${href}`}
                    className="glass-button flex w-full items-center gap-4 rounded-2xl p-4 font-semibold group"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary glow-purple">
                      <Icon size={20}/>
                    </div>
                    <span className="group-hover:gradient-text transition-all duration-300">{label}</span>
                  </Link>
                ))}
              </div>

              <Dropdown categories={categories} />

              <Link
                prefetch
                href="/lich-su"
                onClick={() => setMobileOpen(false)}
                className="glass-button flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold group"
              >
                <Clock size={20} className="group-hover:text-purple-light transition-colors duration-300" />
                <span className="group-hover:gradient-text transition-all duration-300">Lịch sử</span>
              </Link>

              <Link
                href="/yeu-thich"
                className="glass-button flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold group glow-pink"
                onClick={() => setMobileOpen(false)}
              >
                <Bookmark size={20} className="group-hover:text-accent transition-colors duration-300" />
                <span className="group-hover:gradient-text-accent transition-all duration-300">Yêu thích</span>
              </Link>

              {/* Search mobile */}
              <div className="w-full">
                <Search
                  searchResults={searchResults}
                  isLoading={isLoading}
                  showSuggestions={showSuggestions}
                  setShowSuggestions={setShowSuggestions}
                  onSearch={handleSearch}
                  onSubmit={handleSearchSubmit}
                />
              </div>

              <AuthButtons />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Purple Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-accent opacity-40"></div>
    </nav>
  )
}
