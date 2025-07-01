import { Suspense } from "react"
import LayoutMain from "./layouts/LayoutMain"
import HomeContentClient from "./components/home/HomeContentClient"
import dynamic from "next/dynamic"
import HomeHeroClient from "./components/home/HomeHeroClient"

const SkeletonComicGrid = dynamic(() => import("./components/home/SkeletonComicGrid"), {
  ssr: true,
})

export default function Home() {
  return (
    <LayoutMain>
      {/* Simplified background effects for better performance */}
      <div className="min-h-screen relative">
        {/* Hero Section - Client Component */}
        <HomeHeroClient />

        {/* Comics Grid Section */}
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Section Header - Mobile Optimized */}
          <div className="glass-pink rounded-2xl md:rounded-3xl p-4 md:p-10 mb-6 md:mb-12 text-center border-gradient-pink">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold gradient-text mb-3 md:mb-6">
              Truyện mới cập nhật
            </h2>
            <p className="text-glass-muted text-sm md:text-xl mb-3 md:mb-6">
              Những câu chuyện mới nhất được cập nhật hàng ngày
            </p>
            <div className="w-16 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full mx-auto"></div>
          </div>

          <Suspense fallback={<SkeletonComicGrid />}>
            <HomeContentClient />
          </Suspense>
        </div>

        {/* Newsletter Section - Desktop only để giảm tải mobile */}
        <div className="hidden lg:block container mx-auto px-4 py-20">
          <div className="glass-pink rounded-3xl p-16 text-center max-w-5xl mx-auto border-gradient-pink">
            <div className="floating">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text-accent mb-6">Đăng ký nhận thông báo</h2>
              <p className="text-glass-muted mb-12 text-xl leading-relaxed max-w-2xl mx-auto">
                Nhận thông báo về truyện mới và cập nhật từ các tác giả yêu thích
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  )
}

// Newsletter Form Component
function NewsletterForm() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
      <input
        type="email"
        placeholder="Nhập email của bạn..."
        className="glass-input flex-1 px-8 py-4 rounded-full focus:outline-none text-lg"
        suppressHydrationWarning
      />
      <button
        className="glass-button px-10 py-4 rounded-full font-semibold text-lg whitespace-nowrap pulse-pink"
        suppressHydrationWarning
      >
        🌸 Đăng ký
      </button>
    </div>
  )
}
