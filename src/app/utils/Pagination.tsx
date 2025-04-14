"use client";

import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { PaginationProps } from "../types/common";

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  basePath = "/",
}: PaginationProps) => {
  const router = useRouter();

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    router.push(`${basePath}?page=${newPage}`);
    onPageChange(newPage);
  };

  return (
    <ReactPaginate
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={handlePageClick}
      containerClassName="flex justify-center mt-8 space-x-2"
      pageClassName="text-gray-200"
      activeClassName="bg-blue-500 text-white border-blue-500"
      previousClassName="text-gray-200"
      nextClassName="text-gray-200"
      disabledClassName="opacity-50 cursor-not-allowed"
      breakClassName="px-3 py-1"
      // Thêm các class cho thẻ a
      pageLinkClassName="block w-full h-full px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-600"
      previousLinkClassName="block w-full h-full px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-600"
      nextLinkClassName="block w-full h-full px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-600"
    />
  );
};

export default Pagination;
