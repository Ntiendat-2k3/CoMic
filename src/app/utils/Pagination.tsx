"use client";

import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationProps } from "../types/common";
import { useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  basePath = "/",
  marginPagesDisplayed = 2,
  pageRangeDisplayed = 5,
  ...props
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageClick = useCallback(
    (selectedItem: { selected: number }) => {
      const newPage = selectedItem.selected + 1;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      router.push(`${basePath}?${params.toString()}`);
      onPageChange?.(newPage);
    },
    [searchParams, router, basePath, onPageChange]
  );

  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      previousLabel={
        <div className="flex items-center">
          <FiChevronLeft className="text-lg text-gray-200" />
        </div>
      }
      nextLabel={
        <div className="flex items-center">
          <FiChevronRight className="text-lg text-gray-200" />
        </div>
      }
      breakLabel="..."
      pageCount={pageCount}
      forcePage={Math.min(currentPage - 1, pageCount - 1)}
      onPageChange={handlePageClick}
      marginPagesDisplayed={marginPagesDisplayed}
      pageRangeDisplayed={pageRangeDisplayed}
      containerClassName={`flex flex-wrap justify-center gap-2 mt-8 ${
        props.className || ""
      }`}
      pageClassName="inline-flex"
      pageLinkClassName="px-3 py-1 rounded-md border border-gray-200 hover:bg-primary-50 hover:border-primary-300 text-gray-400 transition-all duration-200 flex items-center"
      activeClassName="!bg-primary-500 !border-primary-500"
      activeLinkClassName="!text-white border-blue-600"
      previousClassName="inline-flex"
      nextClassName="inline-flex"
      previousLinkClassName="px-3 py-1 rounded-md border border-gray-200 hover:bg-primary-50 hover:border-primary-300 text-gray-600 transition-all duration-200 flex items-center"
      nextLinkClassName="px-3 py-1 rounded-md border border-gray-200 hover:bg-primary-50 hover:border-primary-300 text-gray-600 transition-all duration-200 flex items-center"
      disabledClassName="opacity-50 cursor-not-allowed hover:bg-transparent"
      breakClassName="inline-flex"
      breakLinkClassName="px-3 py-1 text-gray-600"
      ariaLabelBuilder={(page) => `Đến trang ${page}`}
      {...props}
    />
  );
};

export default Pagination;
