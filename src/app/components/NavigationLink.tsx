'use client';

import { useEffect } from 'react';
import OTruyenService from '../services/otruyen.service';

const CACHE_KEY = 'prefetch-data';

const PrefetchWrapper = ({ children, comicId }) => {
  useEffect(() => {
    const prefetchData = async () => {
      if (typeof window !== 'undefined' && !localStorage.getItem(CACHE_KEY)) {
        const { data } = await OTruyenService.getComicDetail(comicId);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    };
    prefetchData();
  }, [comicId]);

  return children;
};