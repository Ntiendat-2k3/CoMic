"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ComicCatalogService from "@/services/comic-catalog.service";
import type { Category } from "@/types/common";

/** Điều phối dữ liệu thể loại và đồng bộ bộ lọc với URL. */
export function useAdvancedFilterController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "";
  const urlStatus = searchParams.get("status") ?? "";
  const urlKeyword = searchParams.get("keyword") ?? "";
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedStatus, setSelectedStatus] = useState(urlStatus);

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSelectedStatus(urlStatus);
  }, [urlCategory, urlStatus]);

  useEffect(() => {
    let active = true;

    ComicCatalogService.getCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const applyFilter = () => {
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

    const query = params.toString();
    router.push(`/tim-kiem${query ? `?${query}` : ""}`);
  };

  return {
    categories,
    isLoading,
    selectedCategory,
    selectedStatus,
    setSelectedCategory,
    setSelectedStatus,
    applyFilter,
  };
}
