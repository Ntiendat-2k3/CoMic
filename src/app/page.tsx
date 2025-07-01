import { Suspense } from "react"
import LayoutMain from "./layouts/LayoutMain"
import HomeContentClient from "./components/home/HomeContentClient"
import dynamic from "next/dynamic"

const SkeletonComicGrid = dynamic(() => import("./components/home/SkeletonComicGrid"), {
  ssr: true,
})

export default function Home() {
  return (
    <LayoutMain>
      {/* 🖤 DARK MYSTICAL BACKGROUND */}
      <div className="geometric-bg">
        <div className="geometric-shape"></div>
        <div className="geometric-shape"></div>
        <div className="geometric-shape"></div>
        <div className="geometric-shape"></div>
        <div className="geometric-shape"></div>
      </div>

      <div className="geometric-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="wave-pattern"></div>
      <div className="grid-overlay"></div>

      <div className="min-h-screen relative overflow-hidden">
        {/* Dark Pink Floating Particles */}
        <div className="particles">
          <div className="particle" style={{ left: "10%", animationDelay: "0s" }}></div>
          <div className="particle" style={{ left: "20%", animationDelay: "2s" }}></div>
          <div className="particle" style={{ left: "30%", animationDelay: "4s" }}></div>
          <div className="particle" style={{ left: "40%", animationDelay: "1s" }}></div>
          <div className="particle" style={{ left: "60%", animationDelay: "3s" }}></div>
          <div className="particle" style={{ left: "70%", animationDelay: "5s" }}></div>
          <div className="particle" style={{ left: "80%", animationDelay: "2.5s" }}></div>
          <div className="particle" style={{ left: "90%", animationDelay: "4.5s" }}></div>
        </div>

        {/* MOBILE HERO - Compact */}
        <div className="block md:hidden relative">
          <div className="container mx-auto px-4 py-8">
            {/* Mobile Title - Compact */}
            <div className="text-center mb-6">
              <div className="floating mb-4">
                <h1 className="text-4xl font-bold gradient-text mb-3 tracking-tight">TruyenHay</h1>
                <p className="text-sm text-glass-muted font-light leading-relaxed">
                  Khám phá thế giới truyện tranh huyền bí
                </p>
              </div>

              {/* Mobile Stats - Single Row */}
              <div className="glass-pink rounded-2xl p-4 mb-6 border-gradient-pink">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold gradient-text mb-1">10K+</div>
                    <div className="text-glass-muted text-xs">Truyện</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text-accent mb-1">24/7</div>
                    <div className="text-glass-muted text-xs">Cập nhật</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold gradient-text-secondary mb-1">∞</div>
                    <div className="text-glass-muted text-xs">Miễn phí</div>
                  </div>
                </div>
              </div>

              {/* Mobile CTA - Compact */}
              <div className="space-y-3">
                <button className="glass-button w-full px-6 py-3 rounded-full font-semibold pulse-pink">
                  🌸 Khám phá ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP HERO - Full */}
        <div className="hidden md:block relative">
          <div className="container mx-auto px-4 py-20">
            {/* Main Title */}
            <div className="text-center mb-20">
              <div className="floating mb-12">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold gradient-text mb-8 tracking-tight">
                  TruyenHay
                </h1>
                <p className="text-xl md:text-2xl text-glass-muted font-light max-w-3xl mx-auto leading-relaxed">
                  Khám phá thế giới truyện tranh trong không gian đen huyền bí với ánh hồng mộng mơ
                </p>
              </div>

              {/* Dark Pink Glass Info Card */}
              <div className="glass-pink rounded-3xl p-10 max-w-5xl mx-auto floating-delayed border-gradient-pink">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="text-center group">
                    <div className="text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                      10,000+
                    </div>
                    <div className="text-glass-muted text-lg">Truyện tranh chất lượng cao</div>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-center group">
                    <div className="text-5xl font-bold gradient-text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                      24/7
                    </div>
                    <div className="text-glass-muted text-lg">Cập nhật không ngừng nghỉ</div>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-yellow-300 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-center group">
                    <div className="text-5xl font-bold gradient-text-secondary mb-3 group-hover:scale-110 transition-transform duration-300">
                      ∞
                    </div>
                    <div className="text-glass-muted text-lg">Không giới hạn truy cập</div>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Glass Feature Cards - Desktop Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              <div className="glass-card rounded-3xl p-8 floating group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-pink">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-glass mb-4 group-hover:gradient-text transition-all duration-300">
                  Chất lượng 4K
                </h3>
                <p className="text-glass-muted text-lg leading-relaxed">
                  Hình ảnh siêu nét, màu sắc sống động, tải nhanh trên mọi thiết bị
                </p>
              </div>

              <div className="glass-card rounded-3xl p-8 floating-delayed group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 glow-dark-pink">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-glass mb-4 group-hover:gradient-text-accent transition-all duration-300">
                  Cộng đồng sôi động
                </h3>
                <p className="text-glass-muted text-lg leading-relaxed">
                  Kết nối với triệu độc giả, chia sẻ cảm xúc và thảo luận
                </p>
              </div>

              <div className="glass-card rounded-3xl p-8 floating md:col-span-2 lg:col-span-1 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-glass mb-4 group-hover:gradient-text-secondary transition-all duration-300">
                  Đa dạng thể loại
                </h3>
                <p className="text-glass-muted text-lg leading-relaxed">
                  Manga, Manhwa, Manhua từ hành động đến lãng mạn
                </p>
              </div>
            </div>

            {/* Dark Pink CTA Section - Desktop */}
            <div className="text-center mb-20">
              <div className="glass-pink rounded-3xl p-12 max-w-4xl mx-auto border-gradient-pink">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Bắt đầu cuộc phiêu lưu huyền bí</h2>
                <p className="text-glass-muted mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
                  Hàng ngàn câu chuyện kỳ diệu đang chờ bạn khám phá trong thế giới đen huyền bí
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button className="glass-button px-10 py-4 rounded-full font-semibold text-lg pulse-pink">
                    🌸 Khám phá ngay
                  </button>
                  <button className="glass-button px-10 py-4 rounded-full font-semibold text-lg">
                    ✨ Tìm hiểu thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* Newsletter Section - Desktop Only */}
        <div className="hidden md:block container mx-auto px-4 py-20">
          <div className="glass-pink rounded-3xl p-16 text-center max-w-5xl mx-auto border-gradient-pink">
            <div className="floating">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text-accent mb-6">
                Đăng ký nhận thông báo huyền bí
              </h2>
              <p className="text-glass-muted mb-12 text-xl leading-relaxed max-w-2xl mx-auto">
                Nhận thông báo về truyện mới và cập nhật từ các tác giả yêu thích trong thế giới đen huyền bí
              </p>
              <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="glass-input flex-1 px-8 py-4 rounded-full focus:outline-none text-lg"
                />
                <button className="glass-button px-10 py-4 rounded-full font-semibold text-lg whitespace-nowrap pulse-pink">
                  🌸 Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutMain>
  )
}
