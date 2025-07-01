"use client"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useLocalComicList } from "@/app/hooks/useLocalComicList"
import Image from "next/image"

export default function HistoryContent() {
  const { isSignedIn } = useUser()
  const [items, loading] = useLocalComicList<string>("lastRead-")

  if (!isSignedIn) {
    return <div className="p-6 text-center text-lg text-white">Vui lòng đăng nhập để xem lịch sử đọc.</div>
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/70">Bạn chưa đọc chương nào.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {items.map(({ slug, comic, meta }) => {
            const imgSrc = `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`
            return (
              <li
                key={slug}
                className="overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <Link href={`/truyen-tranh/${slug}/${meta}`} className="block">
                  <Image
                    src={imgSrc || "/placeholder.svg"}
                    alt={comic.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="truncate text-lg font-semibold text-white">{comic.name}</h2>
                  <p className="mt-1 text-sm text-yellow-300">Đã đọc đến chap {meta}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
