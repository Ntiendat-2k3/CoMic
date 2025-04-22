import ImageFallback from "@/app/utils/ImageFallback";

interface ThumbnailProps {
  src: string;
  alt: string;
}

const Thumbnail = ({ src, alt }: ThumbnailProps) => (
  <div className="lg:w-1/3 w-full">
    <div className="mx-auto relative aspect-[2/3] rounded-xl overflow-hidden border-2 border-primary-dark shadow-xl h-[500px]">
      <ImageFallback
        src={src}
        alt={alt}
        fill
        className="w-full object-cover hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  </div>
);
export default Thumbnail;