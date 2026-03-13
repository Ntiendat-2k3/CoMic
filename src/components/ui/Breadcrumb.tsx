import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { BreadCrumb } from "@/types/common";

interface BreadcrumbProps {
  items: BreadCrumb[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-1 text-sm text-gray-400 flex-wrap ${className}`}
      aria-label="Breadcrumb"
    >
      <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
        <Home size={14} />
        <span>Trang chủ</span>
      </Link>

      {items.map((item, index) => (
        // Dùng combination slug+name+index vì API có thể trả về position trùng nhau
        <span
          key={`${item.slug ?? item.name}-${index}`}
          className="flex items-center gap-1"
        >
          <ChevronRight size={14} className="text-gray-600" />
          {item.isCurrent || !item.slug ? (
            <span className="text-white font-medium">{item.name}</span>
          ) : (
            <Link href={`/${item.slug}`} className="hover:text-white transition-colors">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
