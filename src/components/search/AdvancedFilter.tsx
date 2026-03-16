"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OTruyenService from "@/services/otruyen.service";
import { Category } from "@/types/common";
import { Search } from "lucide-react";

const STATUSES = [
  { value: "", label: "Tất cả" },
  { value: "dang-phat-hanh", label: "Đang tiến hành" },
  { value: "hoan-thanh", label: "Đã hoàn thành" },
  { value: "sap-ra-mat", label: "Sắp ra mắt" },
];

export default function AdvancedFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const urlCategory = searchParams.get("category") || "";
  const urlStatus = searchParams.get("status") || "";
  const urlKeyword = searchParams.get("keyword") || "";

  // Local state until search is clicked
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedStatus, setSelectedStatus] = useState(urlStatus);

  useEffect(() => {
    // Keep local sync with external changes
    setSelectedCategory(urlCategory);
    setSelectedStatus(urlStatus);
  }, [urlCategory, urlStatus]);

  useEffect(() => {
    OTruyenService.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleApplyFilter = () => {
    if (selectedCategory && !selectedStatus && !urlKeyword) {
      router.push(`/the-loai/${selectedCategory}`);
      return;
    }
    if (!selectedCategory && selectedStatus && !urlKeyword) {
      router.push(`/danh-sach/${selectedStatus}`);
      return;
    }

    const params = new URLSearchParams();
    if (urlKeyword) params.set("keyword", urlKeyword);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedStatus) params.set("status", selectedStatus);
    
    const searchString = params.toString();
    router.push(`/tim-kiem${searchString ? `?${searchString}` : ""}`);
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-4 rounded-xl animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
        <div className="flex gap-4">
          <div className="h-10 flex-1 bg-white/10 rounded-lg"></div>
          <div className="h-10 flex-1 bg-white/10 rounded-lg"></div>
          <div className="h-10 w-24 bg-pink-500/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden group mb-8">
      <div className="absolute -inset-20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-[50px] -z-10 group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
      
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-pink-400">⚡</span> Lọc nâng cao
      </h3>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">Thể loại</label>
          <div className="relative">
            <select 
              className="block appearance-none w-full glass-input text-gray-200 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-pink-500 min-w-[200px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" className="bg-gray-900">Tất cả thể loại</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug} className="bg-gray-900">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">Trạng thái</label>
          <div className="relative">
            <select 
              className="block appearance-none w-full glass-input text-gray-200 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-pink-500 min-w-[200px]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value} className="bg-gray-900">
                  {status.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <button 
          onClick={handleApplyFilter}
          className="w-full md:w-auto mt-2 md:mt-0 flex shrink-0 items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-pink-500/20 h-[48px]"
        >
          <Search size={18} />
          Tìm truyện
        </button>
      </div>
    </div>
  );
}
