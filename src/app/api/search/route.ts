import OTruyenService from '@/app/services/otruyen.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const keyword = searchParams.get('keyword') || ''

  try {
    const response = await OTruyenService.searchComics(keyword)
    return NextResponse.json({
      comics: response.data.data.items,
      error: ''
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { comics: [], error: 'Không thể tải kết quả tìm kiếm' },
      { status: 500 }
    )
  }
}