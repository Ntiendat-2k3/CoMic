"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, AlarmClock } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const navItems: NavItem[] = [
  { href: "/truyen-moi", label: "Truyện mới", icon: BookOpen },
  { href: "/hoan-thanh", label: "Hoàn thành", icon: CheckCircle },
  { href: "/sap-ra-mat", label: "Sắp ra mắt", icon: AlarmClock },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-1/3 z-40 -translate-y-1/2 text-white hidden lg:block">
      <nav className="flex flex-col gap-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={`/danh-sach${href}`}
            className="group relative flex w-12 items-center overflow-hidden rounded-r-xl bg-gray-800 shadow-lg transition-[width,background] duration-300 hover:w-40 hover:bg-primary-light hover:border-r-2 hover:border-gray-300"
          >
            <div className="flex h-12 w-12 items-center justify-center">
              <Icon size={22} />
            </div>
            <span className="ml-2 truncate pr-4 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
