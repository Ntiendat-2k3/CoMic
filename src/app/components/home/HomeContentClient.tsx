// components/home/HomeContentClient.tsx
'use client';

import { useEffect, useState } from 'react';
import OTruyenService from '../../services/otruyen.service';
import ComicGrid from './ComicGrid';
import SEOMetadata from './SEOMetadata';
import SkeletonComicGrid from './SkeletonComicGrid';
import { Comic, ComicSEO } from '@/app/types/comic';
import { HomeParams } from '@/app/types/common';

// Định nghĩa kiểu cho dữ liệu cache
type CachedData = {
  data: HomeResponseData
  timestamp: number
}

// Kiểu dữ liệu cho response từ API
export interface HomeResponseData {
  seoOnPage: ComicSEO
  items: Comic[]
  params?: HomeParams
}

const CACHE_KEY = 'home-data'
const CACHE_DURATION = 60 * 60 * 1000 // 1 giờ

export default function HomeContentClient() {
  const [data, setData] = useState<HomeResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Kiểm tra cache
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed: CachedData = JSON.parse(cached)
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setData(parsed.data)
            setIsLoading(false)
          }
        }

        // Fetch dữ liệu mới
        const response = await OTruyenService.getHomeData()
        const newData: HomeResponseData = response.data 
        
        // Cập nhật state và cache
        setData(newData)
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: newData,
            timestamp: Date.now()
          })
        )
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading || !data) {
    return <SkeletonComicGrid />
  }

  return (
    <>
      <ComicGrid comics={data.items} />
      <SEOMetadata seoData={data.seoOnPage} />
    </>
  )
}