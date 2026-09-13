"use client";

import { Search } from "lucide-react";
import { useAdvancedFilterController } from "@/features/search/hooks/useAdvancedFilterController";
import { useDictionary } from "@/i18n/I18nProvider";

export default function AdvancedFilter() {
  const controller = useAdvancedFilterController();
  const { search } = useDictionary();
  const statuses = [
    { value: "", label: search.allStatuses },
    { value: "dang-phat-hanh", label: search.ongoingStatus },
    { value: "hoan-thanh", label: search.completedStatus },
    { value: "tam-ngung", label: search.hiatusStatus },
  ];

  if (controller.isLoading) {
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
        <span className="text-pink-400">⚡</span> {search.advancedFilter}
      </h3>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">{search.categoryLabel}</label>
          <div className="relative">
            <select 
              className="block appearance-none w-full glass-input text-gray-200 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-pink-500 min-w-[200px]"
              value={controller.selectedCategory}
              onChange={(e) => controller.setSelectedCategory(e.target.value)}
            >
              <option value="" className="bg-gray-900">{search.allCategories}</option>
              {controller.categories.map((cat) => (
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
          <label className="block tracking-wide text-xs font-bold text-gray-400 uppercase mb-2">{search.statusLabel}</label>
          <div className="relative">
            <select 
              className="block appearance-none w-full glass-input text-gray-200 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:border-pink-500 min-w-[200px]"
              value={controller.selectedStatus}
              onChange={(e) => controller.setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
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
          onClick={controller.applyFilter}
          className="w-full md:w-auto mt-2 md:mt-0 flex shrink-0 items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-pink-500/20 h-[48px]"
        >
          <Search size={18} />
          {search.apply}
        </button>
      </div>
    </div>
  );
}
