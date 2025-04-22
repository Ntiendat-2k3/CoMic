"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import OTruyenService from "../services/otruyen.service";
import { Category } from "../types/common";
import { Comic } from "../types/comic";
import Search from "./Search";
import AuthButtons from "./AuthButtons";
import { navItems } from "./Sidebar";

const Dropdown = dynamic(() => import("./Dropdown"), {
  loading: () => <div className="w-40 h-6 bg-gray-100 animate-pulse" />,
});

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  /* -------------------------- handlers -------------------------- */
  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return setSearchResults([]);

    setIsLoading(true);
    try {
      const res = await OTruyenService.searchComics(keyword);
      setSearchResults(res.data.data.items);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchSubmit = useCallback(
    (keyword: string) => {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
      setShowSuggestions(false);
    },
    [router],
  );

  /* ----------------------------- UI ---------------------------- */
  return (
    <nav className="w-full bg-primary text-white shadow-md">
      <div className="mx-auto flex-col lg:flex max-w-7xl flex-wrap items-center justify-between gap-y-3 px-4 py-3 md:flex-nowrap">
        {/* ------------------- Logo + hamburger ------------------- */}
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-love animate-gradient bg-[linear-gradient(90deg,#4f46e5,#ec4899,#4f46e5)] bg-[length:200%] bg-clip-text text-3xl font-bold tracking-widest text-transparent">
              TruyenHay
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="block md:hidden">
              <AuthButtons variant="mobile" />
            </div>
            <button
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((o) => !o)}
              className="ml-2 inline-flex shrink-0 items-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* ===================== DESKTOP utilities ==================== */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Search desktop */}
          <Search
            searchResults={searchResults}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSearch={handleSearch}
            onSubmit={handleSearchSubmit}
          />

          {/* Dropdown + Auth */}
          <Dropdown categories={categories} />
          <AuthButtons />
        </div>

        {/* ===================== MOBILE (collapse) ==================== */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobileMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex w-full flex-col gap-4 md:hidden"
            >

              {/* Sidebar nav items */}
              <div className="w-full">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={`/danh-sach${href}`}
                    className="flex w-full items-center gap-2 rounded-md border-b border-gray-200 py-3 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex h-10 w-10 items-center justify-center">
                      <Icon size={20} />
                    </div>
                    {label}
                  </Link>
                ))}
              </div>

              {/* Dropdown + Auth (mobile) */}
              <Dropdown categories={categories} />

              {/* Search mobile */}
              <Search
                searchResults={searchResults}
                isLoading={isLoading}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                onSearch={handleSearch}
                onSubmit={handleSearchSubmit}
              />
              <AuthButtons />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
