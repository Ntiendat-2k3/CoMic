"use client";

import Link from "next/link";
import { memo, useEffect } from "react";
import { Heart, Menu, X, Clock, Bookmark, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  toggleMobileMenu,
  closeMobileMenu,
  toggleMobileCategories,
} from "@/store/slices/uiSlice";
import type { Category } from "@/types/common";

const SearchBox = dynamic(() => import("@/components/search/SearchBox"), {
  ssr: false,
  loading: () => <div className="w-full max-w-lg h-10 bg-gray-800/30 rounded-xl animate-pulse" />,
});

const AuthButtons = dynamic(() => import("./AuthButtons"), {
  ssr: false,
  loading: () => <div className="w-20 h-9 bg-gray-800/30 rounded-xl animate-pulse" />,
});

const NAV_LINKS = [
  { href: "/danh-sach/truyen-moi", label: "Truyện mới" },
  { href: "/danh-sach/hoan-thanh", label: "Hoàn thành" },
  { href: "/danh-sach/sap-ra-mat", label: "Sắp ra mắt" },
];

interface NavbarProps {
  categories: Category[];
}

const Navbar = memo(({ categories }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const { mobileMenuOpen, mobileCategoriesOpen } = useAppSelector((s) => s.ui);

  // Khóa scroll body khi mobile menu mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-pink-500/20">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors hidden sm:block">
            TruyenHay
          </span>
        </Link>

        {/* Desktop: Search */}
        <div className="hidden md:flex flex-1 max-w-lg">
          <SearchBox />
        </div>

        {/* Desktop: Nav links */}
        <nav className="hidden lg:flex items-center gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              {label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors">
              Thể loại <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-64 bg-gray-900/95 border border-gray-700/60 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-2 grid grid-cols-2 gap-1 max-h-80 overflow-y-auto z-50">
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  href={`/the-loai/${cat.slug}`}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/lich-su" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors">
            <Clock size={15} /> Lịch sử
          </Link>
          <Link href="/yeu-thich" className="flex items-center gap-2 px-4 py-2 text-sm text-pink-300 hover:text-pink-200 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-colors border border-pink-500/20">
            <Bookmark size={15} /> Yêu thích
          </Link>

          <AuthButtons />
        </nav>

        {/* Mobile: hamburger */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="lg:hidden p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:text-white transition-colors active:scale-95"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-30 bg-gray-900/98 lg:hidden overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Search */}
            <SearchBox />

            {/* Nav links */}
            <div className="space-y-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => dispatch(closeMobileMenu())}
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition-colors"
                >
                  {label}
                </Link>
              ))}
              <Link href="/lich-su" onClick={() => dispatch(closeMobileMenu())} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition-colors">
                <Clock size={16} /> Lịch sử
              </Link>
              <Link href="/yeu-thich" onClick={() => dispatch(closeMobileMenu())} className="flex items-center gap-3 px-4 py-3 text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 rounded-xl transition-colors border border-pink-500/20">
                <Bookmark size={16} /> Yêu thích
              </Link>
            </div>

            {/* Categories collapsible */}
            <div className="border border-gray-700/50 rounded-xl overflow-hidden">
              <button
                onClick={() => dispatch(toggleMobileCategories())}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
              >
                <span className="font-medium">Thể loại ({categories.length})</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileCategoriesOpen && (
                <div className="px-3 pb-3 grid grid-cols-2 gap-1.5 border-t border-gray-700/40">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id || cat.slug}
                      href={`/the-loai/${cat.slug}`}
                      onClick={() => dispatch(closeMobileMenu())}
                      className="px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-center truncate"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <AuthButtons />
          </div>
        </div>
      )}
    </header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
