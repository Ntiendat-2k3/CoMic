import Link from "next/link";
import { BookOpen, CheckCircle, AlarmClock, DownloadCloud } from "lucide-react";

const SIDEBAR_ITEMS = [
  { href: "/danh-sach/truyen-moi", label: "Truyện mới", icon: BookOpen },
  { href: "/danh-sach/hoan-thanh", label: "Hoàn thành", icon: CheckCircle },
  { href: "/danh-sach/sap-ra-mat", label: "Sắp ra mắt", icon: AlarmClock },
  { href: "/offline", label: "Kho tải xuống", icon: DownloadCloud },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-1/3 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex items-center overflow-hidden w-12 hover:w-40 h-12 rounded-r-xl bg-gray-800/90 border border-gray-700/50 border-l-0 shadow-lg transition-[width] duration-300 hover:bg-gray-700 hover:border-pink-500/30"
        >
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-400 group-hover:text-pink-300 transition-colors">
            <Icon size={20} />
          </div>
          <span className="whitespace-nowrap text-sm font-medium text-gray-300 group-hover:text-white pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {label}
          </span>
        </Link>
      ))}
    </aside>
  );
}
