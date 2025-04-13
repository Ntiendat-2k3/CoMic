'use client';

import { useEffect, useState } from 'react';
import OTruyenService from '../../services/otruyen.service';
import ComicGrid from './ComicGrid';
import SEOMetadata from './SEOMetadata';
import SkeletonComicGrid from './SkeletonComicGrid';
import { Comic, ComicSEO } from '@/app/types/comic';
import { HomeParams } from '@/app/types/common';
import Pagination from '@/app/utils/Pagination';

type CachedData = {
  data: HomeResponseData;
  timestamp: number;
};

export interface HomeResponseData {
  seoOnPage?: ComicSEO;
  items: Comic[];
  params?: HomeParams;
}

const ITEMS_PER_PAGE = 15;
const CACHE_KEY = 'home-data';
const CACHE_DURATION = 60 * 60 * 1000;

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

    const fetchData = async (page: number) => {
      try {
        const response = await OTruyenService.getHomeData(page);
        const newData = response.data;

        setData(newData);
        setTotalPages(
          newData.params?.pagination?.totalItems
            ? Math.ceil(newData.params.pagination.totalItems / ITEMS_PER_PAGE)
            : 1
        );

        localStorage.setItem(
          `${CACHE_KEY}-page-${page}`,
          JSON.stringify({ data: newData, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const cached = checkCacheValidity(localStorage.getItem(`${CACHE_KEY}-page-${currentPage}`));
    if (cached) {
      setData(cached.data);
      setIsLoading(false);
      fetchData(currentPage); // Background update
    } else {
      fetchData(currentPage); // Initial fetch
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading || !data) return <SkeletonComicGrid />;

  return (
    <>
      <ComicGrid comics={data.items} />
      <SEOMetadata seoData={data.seoOnPage} />
      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}