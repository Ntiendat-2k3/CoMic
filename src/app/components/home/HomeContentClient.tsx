"use client"

import { lazy, useEffect, useState, useCallback, useMemo } from "react"
import OTruyenService from "../../services/otruyen.service"
import ComicGrid from "./ComicGrid"
import SEOMetadata from "./SEOMetadata"
import type { Comic, ComicSEO } from "@/app/types/comic"
import type { HomeParams } from "@/app/types/common"
import Pagination from "@/app/utils/Pagination"

const SkeletonComicGrid = lazy(() => import("./SkeletonComicGrid"))

type CachedData = {
  data: HomeResponseData
  timestamp: number
}

export interface HomeResponseData {
  seoOnPage?: ComicSEO
  items: Comic[]
  params?: HomeParams
}

const ITEMS_PER_PAGE = 15
const CACHE_KEY = "home-data"
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export default function HomeContentClient() {
  const [data, setData] = useState<HomeResponseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Memoize cache check function
  const checkCacheValidity = useCallback((cached: string | null): CachedData | null => {
    if (!cached) return null
    try {
      const parsed = JSON.parse(cached) as CachedData
      return Date.now() - parsed.timestamp < CACHE_DURATION ? parsed : null
    } catch (error) {
      console.error("Invalid cache format:", error)
      return null
    }
  }, [])

  // Memoize fetch function
  const fetchData = useCallback(async (page: number) => {
    try {
      setIsLoading(true)
      const response = await OTruyenService.getHomeData(page)
      const newData = response.data

      setData(newData)
      setTotalPages(
        newData.params?.pagination?.totalItems ? Math.ceil(newData.params.pagination.totalItems / ITEMS_PER_PAGE) : 1,
      )

      // Cache data
      localStorage.setItem(`${CACHE_KEY}-page-${page}`, JSON.stringify({ data: newData, timestamp: Date.now() }))
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = checkCacheValidity(localStorage.getItem(`${CACHE_KEY}-page-${currentPage}`))

    if (cached) {
      setData(cached.data)
      setIsLoading(false)
      // Background update
      fetchData(currentPage)
    } else {
      fetchData(currentPage)
    }
  }, [currentPage, checkCacheValidity, fetchData])

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Memoize components để tránh re-render
  const memoizedComicGrid = useMemo(
    () => <ComicGrid comics={data?.items} isLoading={isLoading} />,
    [data?.items, isLoading],
  )

  const memoizedSEOMetadata = useMemo(() => <SEOMetadata seoData={data?.seoOnPage} />, [data?.seoOnPage])

  const memoizedPagination = useMemo(
    () => <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />,
    [totalPages, currentPage, handlePageChange],
  )

  if (isLoading && !data) return <SkeletonComicGrid />

  return (
    <>
      {memoizedComicGrid}
      {memoizedSEOMetadata}
      {memoizedPagination}
    </>
  )
}
