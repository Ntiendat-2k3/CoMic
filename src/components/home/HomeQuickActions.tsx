"use client";

import {
  BookOpen,
  CheckCircle2,
  Flame,
  Heart,
  PauseCircle,
  Shapes,
} from "lucide-react";
import Link from "next/link";
import { useDictionary } from "@/i18n/I18nProvider";

/** Các lối tắt dành cho mobile, tách khỏi organism banner và catalog. */
export default function HomeQuickActions() {
  const { comic, navigation } = useDictionary();
  const actions = [
    {
      href: "/danh-sach/truyen-moi",
      label: navigation.newComics,
      icon: Flame,
      featured: true,
    },
    {
      href: "/danh-sach/dang-phat-hanh",
      label: comic.ongoing,
      icon: BookOpen,
    },
    {
      href: "/danh-sach/hoan-thanh",
      label: navigation.completed,
      icon: CheckCircle2,
    },
    {
      href: "/danh-sach/tam-ngung",
      label: navigation.hiatus,
      icon: PauseCircle,
    },
    { href: "/the-loai", label: navigation.categories, icon: Shapes },
    { href: "/yeu-thich", label: navigation.favorites, icon: Heart },
  ];

  return (
    <nav
      className="relative z-10 -mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
      aria-label={navigation.quickActionsAriaLabel}
    >
      {actions.map(({ href, label, icon: Icon, featured }) => (
        <Link
          key={href}
          href={href}
          className={`flex min-h-[5.5rem] flex-[1_0_5.75rem] snap-start flex-col items-center justify-center gap-2 rounded-xl border px-2 text-center text-[11px] font-semibold shadow-xl backdrop-blur-xl transition-[border-color,color,background-color] ${
            featured
              ? "border-pink-400/70 bg-pink-950/80 text-pink-300"
              : "border-white/10 bg-[#141722]/90 text-gray-300 hover:border-pink-400/35 hover:text-pink-200"
          }`}
        >
          <Icon size={23} strokeWidth={1.9} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
