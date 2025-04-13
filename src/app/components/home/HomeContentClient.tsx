'use client';

import { useEffect, useState } from 'react';
import OTruyenService from '../../services/otruyen.service';
import ComicGrid from './ComicGrid';
import SEOMetadata from './SEOMetadata';
import SkeletonComicGrid from './SkeletonComicGrid';
import { Comic, ComicSEO } from '@/app/types/comic';
import { HomeParams } from '@/app/types/common';
import Pagination from '@/app/utils/Pagination';


// Định nghĩa kiểu dữ liệu
type CachedData = {
  data: HomeResponseData;
  timestamp: number;
};

export interface HomeResponseData {
  seoOnPage?: ComicSEO;
  items: Comic[];
  params?: HomeParams;
}

const CACHE_KEY = 'home-data';
const CACHE_DURATION = 60 * 60 * 1000; // 1 giờ

export default function HomeContentClient() {
  const [data, setData] = useState<HomeResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const checkCacheValidity = (cached: string | null): CachedData | null => {
      if (!cached) return null;
      try {
        const parsed = JSON.parse(cached) as CachedData;
        return Date.now() - parsed.timestamp < CACHE_DURATION ? parsed : null;
      } catch (error) {
        console.error('Invalid cache format:', error);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        const response = await OTruyenService.getHomeData();
        const newData = response.data; 

        setData(newData);
        setTotalPages(
          response.data.params?.pagination?.totalItems
            ? Math.ceil(response.data.params.pagination.totalItems / 15)
            : 1
        );

        localStorage.setItem(
          `${CACHE_KEY}-page-${currentPage}`,
          JSON.stringify({ data: newData, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Logic chính
    const cached = checkCacheValidity(localStorage.getItem(CACHE_KEY));
    if (cached) {
      setData(cached.data);
      setIsLoading(false);
      fetchData(); 
    } else {
      fetchData(); // Initial fetch
    }
  }, [currentPage]);

  if (isLoading || !data) return <SkeletonComicGrid />;

  return (
    <>
      <ComicGrid comics={data.items} />
      <SEOMetadata seoData={data.seoOnPage} />

      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        basePath="/"
      />
    </>
  );
}