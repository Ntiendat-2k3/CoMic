"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";            
import { Category } from "../types/common";

interface DropdownProps {
  categories: Category[];
}

export default function Dropdown({ categories }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  /* -------------------- Đóng khi click ra ngoài ----------------------- */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ------------------------- Lọc thể loại ----------------------------- */
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1 rounded px-3 py-2 transition-colors hover:bg-white/10 hover:opacity-80"
      >
        Thể loại
        {/* Icon mũi tên – xoay khi mở */}
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-[90vw] max-w-none
                     sm:left-auto sm:right-0 sm:w-72
                     md:w-96 lg:w-[600px]
                     rounded-lg bg-primary-dark text-white shadow-xl z-50"
        >
          {/* Thanh tìm kiếm */}
          <div className="border-b bg-primary-light p-3">
            <input
              autoFocus
              placeholder="Tìm thể loại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Danh sách */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
              {filtered.map((c) => (
                <Link
                  key={c._id}
                  href={`/the-loai/${c.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="truncate rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Thống kê */}
          <div className="border-t bg-primary-light p-3 text-sm hidden lg:block md:block">
            Tổng số: {filtered.length} thể loại
          </div>
        </div>
      )}
    </div>
  );
}
