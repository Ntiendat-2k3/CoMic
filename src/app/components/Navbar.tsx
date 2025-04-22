"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";

import OTruyenService from "../services/otruyen.service";
import { Category } from "../types/common";
import { Comic } from "../types/comic";
import Search from "./Search";
import AuthButtons from "./AuthButtons";

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

  /* ------------------------------ handlers ----------------------------- */
  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

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

  return (
    <nav className="w-full bg-primary text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3 px-4 py-3 md:flex-nowrap">
        {/* ------------------------- Logo + hamburger ---------------------- */}
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-love animate-gradient bg-[linear-gradient(90deg,#4f46e5,#ec4899,#4f46e5)] bg-[length:200%] bg-clip-text text-3xl font-bold tracking-widest text-transparent">
              TruyenHay
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Avatar mobile (thu gọn) */}
            <div className="mt-1 block md:hidden lg:hidden">
              <AuthButtons variant="mobile" />
            </div>

            {/* Hamburger */}
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((p) => !p)}
              className="ml-3 inline-flex shrink-0 items-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* ------------------------------- Search -------------------------- */}
        <div
          className={`order-last w-full transition-[max-height] md:order-none md:w-auto ${
            mobileOpen ? "max-h-[800px]" : "max-h-0 overflow-hidden md:max-h-fit"
          }`}
        >
          <Search
            searchResults={searchResults}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            onSearch={handleSearch}
            onSubmit={handleSearchSubmit}
          />
        </div>

        {/* ------------------ Dropdown + Auth (cuối) ----------------------- */}
        <div
          className={`flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center ${
            mobileOpen ? "" : "hidden md:flex"
          }`}
        >
          <Dropdown categories={categories} />

          {/* Auth buttons desktop */}
          <AuthButtons />
        </div>
      </div>
    </nav>
  );
}
