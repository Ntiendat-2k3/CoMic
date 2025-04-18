'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Comic } from '../../types/comic'
import ComicGrid from '../home/ComicGrid'
import dynamic from 'next/dynamic'
import HamsterLoading from '../loading/HamsterLoading'

const SkeletonComicGrid = dynamic(() => import('../home/SkeletonComicGrid'), {
  ssr: true,
})


export default function SearchResults({
  keyword: initialKeyword,
  comics: initialComics,
  error: initialError
}: {
  keyword: string
  comics: Comic[]
  error: string
}) {
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(initialKeyword)
  const [comics, setComics] = useState(initialComics)
  const [error, setError] = useState(initialError)
  const [isLoading, setIsLoading] = useState(false)

  // Client-side revalidation
  useEffect(() => {
    const updateResults = async () => {
      const currentKeyword = searchParams.get('keyword') || ''
      if (currentKeyword === keyword) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?keyword=${encodeURIComponent(currentKeyword)}`)
        const data = await response.json()
        setComics(data.comics)
        setError('')
        setKeyword(currentKeyword)
      } catch (err) {
        console.error(err)
        setError('Không thể cập nhật kết quả')
      } finally {
        setIsLoading(false)
      }
    }

    updateResults()
  }, [searchParams, keyword])

  return (
    <div className="container">
      <div className="space-y-8 mt-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-400">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-white">&ldquo;{keyword}&rdquo;</span>
        </h2>

        {isLoading && <SkeletonComicGrid />}

        {error && (
          <div className="text-center py-12 text-red-500 font-medium">
            {error}
          </div>
        )}

        {!isLoading && comics.length > 0 && <ComicGrid comics={comics} />}

        {!isLoading && comics.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy truyện phù hợp với từ khóa &ldquo;
            <span className="text-white">{keyword}</span>&rdquo;
            <HamsterLoading></HamsterLoading>
          </div>
        )}
      </div>
    </div>
  );
};
