"use client";

import Link from "next/link";
import { memo } from "react";
import { Heart, Menu, X, Clock, Bookmark, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import type { Category } from "@/types/common";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { useNavbarController } from "@/features/navigation/hooks/useNavbarController";

const SearchBox = dynamic(() => import("@/components/search/SearchBox"), {
  ssr: false,
  loading: () => <div className="w-full max-w-lg h-10 bg-gray-800/30 rounded-xl animate-pulse" />,
});

const AuthButtons = dynamic(() => import("./AuthButtons"), {
  ssr: false,
  loading: () => <div className="w-20 h-9 bg-gray-800/30 rounded-xl animate-pulse" />,
});

interface NavbarProps {
  categories: Category[];
}

const Navbar = memo(({ categories }: NavbarProps) => {
  const controller = useNavbarController();
  const { brand, navigation } = useDictionary();
  const navLinks = [
    { href: "/danh-sach/truyen-moi", label: navigation.newComics },
    { href: "/danh-sach/hoan-thanh", label: navigation.completed },
    { href: "/danh-sach/tam-ngung", label: navigation.hiatus },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur border-b border-pink-500/20">
        {/* Đường nhấn phía trên */}
        <div className="h-0.5 bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 opacity-70" />

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Thương hiệu */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors hidden sm:block">
              {brand.name}
            </span>
          </Link>

          {/* Tìm kiếm trên màn hình lớn */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <SearchBox />
          </div>

          {/* Điều hướng trên màn hình lớn */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Danh sách thể loại */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors">
                {navigation.categories} <ChevronDown size={14} />
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
              <Clock size={15} /> {navigation.history}
            </Link>
            <Link href="/yeu-thich" className="flex items-center gap-2 px-4 py-2 text-sm text-pink-300 hover:text-pink-200 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-colors border border-pink-500/20">
              <Bookmark size={15} /> {navigation.favorites}
            </Link>

            <AuthButtons />
          </nav>

          {/* Nút menu trên thiết bị nhỏ */}
          <button
            onClick={controller.toggleMenu}
            className="lg:hidden p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:text-white transition-colors active:scale-95"
            aria-label={navigation.menuAriaLabel}
          >
            {controller.mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Menu thiết bị nhỏ nằm ngoài header để không bị ảnh hưởng bởi backdrop-blur. */}
      {controller.mobileMenuOpen && (
        <div className="fixed inset-x-0 top-0 bottom-0 z-50 lg:hidden flex flex-col">
          {/* Khoảng trống bằng chiều cao header */}
          <div className="flex-shrink-0 h-[68px]" />
          {/* Nội dung menu */}
          <div className="flex-1 bg-gray-900 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Tìm kiếm */}
              <SearchBox />

              {/* Liên kết điều hướng */}
              <div className="space-y-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={controller.closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <Link href="/lich-su" onClick={controller.closeMenu} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 rounded-xl transition-colors">
                  <Clock size={16} /> {navigation.history}
                </Link>
                <Link href="/yeu-thich" onClick={controller.closeMenu} className="flex items-center gap-3 px-4 py-3 text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 rounded-xl transition-colors border border-pink-500/20">
                  <Bookmark size={16} /> {navigation.favorites}
                </Link>
              </div>

              {/* Danh sách thể loại có thể thu gọn */}
              <div className="border border-gray-700/50 rounded-xl overflow-hidden">
                <button
                  onClick={controller.toggleCategories}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
                >
                  <span className="font-medium">
                    {formatMessage(navigation.categoriesWithCount, {
                      count: categories.length,
                    })}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${controller.mobileCategoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {controller.mobileCategoriesOpen && (
                  <div className="px-3 pb-3 grid grid-cols-2 gap-1.5 border-t border-gray-700/40">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id || cat.slug}
                        href={`/the-loai/${cat.slug}`}
                        onClick={controller.closeMenu}
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
        </div>
      )}
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
