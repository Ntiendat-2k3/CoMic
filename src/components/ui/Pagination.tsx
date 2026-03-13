"use client";

import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  /** Nếu có basePath → dùng URL navigation. Không có → dùng callback. */
  basePath?: string;
  onPageChange?: (page: number) => void;
  className?: string;
}

export default function Pagination({
  pageCount,
  currentPage,
  basePath,
  onPageChange,
  className = "",
}: PaginationProps) {
  const router = useRouter();

  if (pageCount <= 1) return null;

  const handlePageChange = ({ selected }: { selected: number }) => {
    const page = selected + 1;
    if (basePath) {
      router.push(`${basePath}?page=${page}`);
    } else {
      onPageChange?.(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageChange}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      previousLabel={<ChevronLeft size={16} />}
      nextLabel={<ChevronRight size={16} />}
      breakLabel="..."
      containerClassName={`flex items-center justify-center gap-1 mt-8 flex-wrap ${className}`}
      pageClassName="inline-flex"
      pageLinkClassName="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border border-transparent hover:border-gray-600"
      activeClassName="!text-white"
      activeLinkClassName="!bg-pink-500/80 !border-pink-500 !text-white"
      previousClassName="inline-flex"
      nextClassName="inline-flex"
      previousLinkClassName="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
      nextLinkClassName="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
      breakClassName="inline-flex"
      breakLinkClassName="w-9 h-9 flex items-center justify-center text-gray-500"
      disabledClassName="opacity-40 cursor-not-allowed"
    />
  );
}
