"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchQuery } from "@/hooks/queries/useSearchQuery";

/** Điều phối ô tìm kiếm nhanh và danh sách gợi ý. */
export function useSearchBoxController() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedKeyword = useDebounce(input, 400);
  const { data: results = [], isFetching } = useSearchQuery(
    debouncedKeyword,
    open && debouncedKeyword.length >= 2,
  );

  useEffect(() => {
    const closeWhenClickingOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", closeWhenClickingOutside);
    return () => document.removeEventListener("mousedown", closeWhenClickingOutside);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const keyword = input.trim();
    if (!keyword) return;

    router.push(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
    setOpen(false);
  };

  const clear = () => {
    setInput("");
    setOpen(false);
  };

  return {
    input,
    open,
    isFetching,
    results,
    containerRef,
    setInput,
    setOpen,
    submit,
    clear,
  };
}
