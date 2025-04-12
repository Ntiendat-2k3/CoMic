"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Category } from "../types/common";

interface DropdownProps {
  categories: Category[]; 
}

const Dropdown = ({ categories }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc thể loại
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:opacity-80 px-3 py-2 rounded hover:bg-white/10 transition-colors"
      >
        Thể loại
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[600px] bg-primary-dark text-white shadow-xl rounded-lg overflow-hidden z-50">
          {/* Thanh tìm kiếm */}
          <div className="p-3 border-b bg-primary-light text-gray-800">
            <input
              type="text"
              placeholder="Tìm thể loại..."
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary outline-none"
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Danh sách thể loại */}
          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-2 p-3">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/the-loai/${cat.slug}`}
                  className="px-3 py-2 text-sm hover:bg-gray-100 hover:text-primary rounded-md truncate"
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Thống kê */}
          <div className="p-3 text-sm border-t bg-primary-light text-white">
            Tổng số: {filteredCategories.length} thể loại
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;