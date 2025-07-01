import ImageFallback from "@/app/utils/ImageFallback"

interface ThumbnailProps {
  src: string
  alt: string
}

const Thumbnail = ({ src, alt }: ThumbnailProps) => (
  <div className="w-full">
    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-700 border border-gray-600">
      <ImageFallback
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
      />
    </div>
  </div>
)

export default Thumbnail
