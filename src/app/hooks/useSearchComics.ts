"use client";

import { useState, useEffect } from "react";
import { Comic } from "../types/comic";
import OTruyenService from "../services/otruyen.service";

export const useSearchComics = (keyword: string) => {
  const [state, setState] = useState<{
    comics: Comic[];
    isLoading: boolean;
    error: string;
  }>({
    comics: [],
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    const fetchComics = async () => {
      if (!keyword.trim()) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const response = await OTruyenService.searchComics(keyword);
        setState({
          comics: response.data.data.items,
          isLoading: false,
          error: "",
        });
      } catch (err) {
        setState({
          comics: [],
          isLoading: false,
          error: "Không thể tải kết quả tìm kiếm",
        });
        console.error("Search error:", err);
      }
    };

    fetchComics();
  }, [keyword]);

  return state;
};