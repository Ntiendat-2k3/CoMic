import ComicCatalogService from '@/services/comic-catalog.service'
import { NextRequest, NextResponse } from 'next/server'
import { getDictionary } from '@/i18n/dictionaries'

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const { search } = getDictionary()
  const searchParams = req.nextUrl.searchParams
  const keyword = searchParams.get('keyword') || ''

  try {
    const response = await ComicCatalogService.searchComics(keyword)
    return NextResponse.json(
      {
        comics: response.data.items,
        error: ''
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
        }
      }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { comics: [], error: search.apiError },
      { status: 500 }
    )
  }
}
