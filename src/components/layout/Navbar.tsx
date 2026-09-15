"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import {
  Bookmark,
  ChevronDown,
  Clock,
  Compass,
  Heart,
  Home,
  Library,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import type { Category } from "@/types/common";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { useNavbarController } from "@/features/navigation/hooks/useNavbarController";

const SearchBox = dynamic(() => import("@/components/search/SearchBox"), {
  ssr: false,
  loading: () => <div className="h-10 w-full max-w-lg animate-pulse rounded-xl bg-gray-800/30" />,
});

const AuthButtons = dynamic(() => import("./AuthButtons"), {
  ssr: false,
  loading: () => <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-800/30" />,
});

const MobileAccountPanel = dynamic(() => import("./MobileAccountPanel"), {
  ssr: false,
});

interface NavbarProps {
  categories: Category[];
  hideMobileNavigation?: boolean;
}

const Navbar = memo(({ categories, hideMobileNavigation = false }: NavbarProps) => {
  const controller = useNavbarController();
  const { brand, navigation } = useDictionary();
  const accentLength = Math.min(3, brand.name.length);
  const brandBase = brand.name.slice(0, -accentLength);
  const brandAccent = brand.name.slice(-accentLength);
  const navLinks = [
    { href: "/danh-sach/truyen-moi", label: navigation.newComics },
    { href: "/danh-sach/hoan-thanh", label: navigation.completed },
    { href: "/danh-sach/tam-ngung", label: navigation.hiatus },
  ];
  const mobileNavItems = [
    { href: "/", label: navigation.home, icon: Home, active: controller.pathname === "/" },
    {
      href: "/danh-sach/truyen-moi",
      label: navigation.explore,
      icon: Compass,
      active: ["/danh-sach", "/the-loai", "/tim-kiem"].some((path) =>
        controller.pathname.startsWith(path),
      ),
    },
    {
      href: "/offline",
      label: navigation.library,
      icon: Library,
      active: controller.pathname.startsWith("/offline"),
    },
    {
      href: "/yeu-thich",
      label: navigation.favorites,
      icon: Heart,
      active: controller.pathname.startsWith("/yeu-thich"),
    },
  ];

  return (
    <>
      <header className={`${hideMobileNavigation ? "hidden md:block" : ""} sticky top-0 z-40 border-b border-white/[0.07] bg-[#0d0e16]/92 backdrop-blur-xl`}>
        <div className="h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />

        <div className="mx-auto grid min-h-[4.35rem] max-w-7xl grid-cols-[auto_minmax(5rem,1fr)_auto] items-center gap-2 px-3 py-2 md:hidden">
          <Link href="/" className="group flex min-w-0 items-center gap-2" aria-label={brand.name}>
            <div className="grid size-10 flex-shrink-0 place-items-center rounded-2xl bg-[#171822] ring-1 ring-pink-400/20">
              <Image
                src="/assets/logo.png"
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="size-10 object-contain"
              />
            </div>
            <span className="hidden min-w-0 min-[390px]:block">
              <span className="block truncate text-[17px] font-extrabold leading-5 tracking-tight text-white">
                {brandBase}<span className="text-pink-400">{brandAccent}</span>
              </span>
              <span className="block max-w-24 truncate text-[9px] text-gray-400">{brand.tagline}</span>
            </span>
          </Link>

          <div className="min-w-0 [&_input]:h-11 [&_input]:rounded-2xl [&_input]:bg-[#141927]/80">
            <SearchBox />
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/lich-su"
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition-colors hover:border-pink-400/35 hover:text-pink-300"
              aria-label={navigation.history}
            >
              <Clock size={18} aria-hidden="true" />
            </Link>
            <AuthButtons compact />
          </div>
        </div>

        <div className="mx-auto hidden min-h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 py-3 md:flex">
          <Link href="/" className="group flex flex-shrink-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#171822] ring-1 ring-white/10 transition-colors duration-200 group-hover:ring-pink-400/35">
              <Image
                src="/assets/logo.png"
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="size-10 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white transition-colors group-hover:text-pink-300">
              {brand.name}
            </span>
          </Link>

          <div className="flex max-w-lg flex-1">
            <SearchBox />
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800/60 hover:text-white"
              >
                {label}
              </Link>
            ))}

            <div className="group relative">
              <button className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800/60 hover:text-white">
                {navigation.categories} <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-1 grid max-h-80 w-64 grid-cols-2 gap-1 overflow-y-auto rounded-xl border border-gray-700/60 bg-gray-900/95 p-2 opacity-0 shadow-2xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <Link
                    key={category._id || category.slug}
                    href={`/the-loai/${category.slug}`}
                    className="truncate rounded-lg px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/lich-su" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800/60 hover:text-white">
              <Clock size={15} /> {navigation.history}
            </Link>
            <Link href="/yeu-thich" className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-sm text-pink-300 transition-colors hover:bg-pink-500/20 hover:text-pink-200">
              <Bookmark size={15} /> {navigation.favorites}
            </Link>
            <AuthButtons />
          </nav>

          <button
            onClick={controller.toggleMenu}
            className="hidden size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-pink-400/30 hover:text-white md:flex lg:hidden"
            aria-label={controller.mobileMenuOpen ? navigation.closeMenuAriaLabel : navigation.openMenuAriaLabel}
            aria-controls="mobile-navigation"
            aria-expanded={controller.mobileMenuOpen}
          >
            {controller.mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {controller.mobileMenuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[74px] z-30 hidden md:block lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            aria-label={navigation.closeMenuAriaLabel}
            onClick={controller.closeMenu}
          />
          <nav
            id="mobile-navigation"
            className="relative max-h-full overflow-y-auto border-t border-gray-800 bg-[#11131d] shadow-2xl"
            aria-label={navigation.mobileNavigationAriaLabel}
          >
            <div className="space-y-4 p-4">
              <div className="space-y-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={controller.closeMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-colors hover:bg-gray-800/60 hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
                <Link href="/lich-su" onClick={controller.closeMenu} className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 transition-colors hover:bg-gray-800/60 hover:text-white">
                  <Clock size={16} /> {navigation.history}
                </Link>
                <Link href="/yeu-thich" onClick={controller.closeMenu} className="flex items-center gap-3 rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-pink-300 transition-colors hover:bg-pink-500/20">
                  <Bookmark size={16} /> {navigation.favorites}
                </Link>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-700/50">
                <button
                  onClick={controller.toggleCategories}
                  className="flex w-full items-center justify-between px-4 py-3 text-gray-300 transition-colors hover:bg-gray-800/60 hover:text-white"
                >
                  <span className="font-medium">
                    {formatMessage(navigation.categoriesWithCount, { count: categories.length })}
                  </span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${controller.mobileCategoriesOpen ? "rotate-180" : ""}`} />
                </button>
                {controller.mobileCategoriesOpen ? (
                  <div className="grid grid-cols-2 gap-1.5 border-t border-gray-700/40 px-3 pb-3">
                    {categories.map((category) => (
                      <Link
                        key={category._id || category.slug}
                        href={`/the-loai/${category.slug}`}
                        onClick={controller.closeMenu}
                        className="truncate rounded-lg px-3 py-2 text-center text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <AuthButtons />
            </div>
          </nav>
        </div>
      ) : null}

      {controller.mobileAccountOpen ? (
        <MobileAccountPanel open onClose={controller.closeAccount} />
      ) : null}

      {!hideMobileNavigation ? (
        <nav
          className="fixed inset-x-0 bottom-0 z-50 grid h-[4.75rem] grid-cols-5 border-t border-white/10 bg-[#0b1019]/95 px-1 pb-2 shadow-[0_-18px_45px_rgba(0,0,0,.42)] backdrop-blur-2xl md:hidden"
          aria-label={navigation.mobileNavigationAriaLabel}
        >
        {mobileNavItems.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors ${active ? "text-pink-400" : "text-gray-400 hover:text-gray-200"}`}
          >
            <span className={`absolute inset-x-4 top-0 h-0.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,.85)] transition-opacity ${active ? "opacity-100" : "opacity-0"}`} />
            <Icon size={22} strokeWidth={active ? 2.4 : 1.9} fill={active && href === "/yeu-thich" ? "currentColor" : "none"} aria-hidden="true" />
            <span className="max-w-full truncate px-1">{label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={controller.toggleAccount}
          aria-expanded={controller.mobileAccountOpen}
          aria-controls="mobile-account-panel"
          className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium transition-colors ${controller.mobileAccountOpen ? "text-pink-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          <span className={`absolute inset-x-4 top-0 h-0.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,.85)] transition-opacity ${controller.mobileAccountOpen ? "opacity-100" : "opacity-0"}`} />
          <UserRound size={22} strokeWidth={controller.mobileAccountOpen ? 2.4 : 1.9} aria-hidden="true" />
          <span className="max-w-full truncate px-1">{navigation.profile}</span>
        </button>
        </nav>
      ) : null}
    </>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
