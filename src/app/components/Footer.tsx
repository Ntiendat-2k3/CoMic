"use client"

import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Footer() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <footer className="glass-dark text-white mt-12 py-10 border-t border-pink-glow">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4 gradient-text">Về chúng tôi</h3>
            <p className="text-sm text-glass-muted">
              TruyenHay là nền tảng đọc truyện tranh online lớn nhất Việt Nam, với kho truyện đa dạng từ manga, manhwa
              đến teenfic.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-semibold mb-4 gradient-text">Điều hướng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/lich-su" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Lịch sử đọc
                </Link>
              </li>
              <li>
                <Link href="/yeu-thich" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Yêu thích
                </Link>
              </li>
              <li>
                <Link href="/the-loai" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Thể loại
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4 gradient-text">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-glass-muted hover:text-pink-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-glass-muted hover:text-pink-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4 gradient-text">Đăng ký nhận tin</h3>
            <form className="flex flex-col sm:flex-row items-center gap-2 mb-4">
              <div className="flex items-center w-full sm:flex-1 glass-input rounded-lg overflow-hidden">
                <Mail className="w-5 h-5 mx-3 text-pink-400" />
                {isClient ? (
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-3 py-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
                    suppressHydrationWarning
                  />
                ) : (
                  <div className="flex-1 px-3 py-2 bg-transparent text-gray-400">Email của bạn</div>
                )}
              </div>
              {isClient ? (
                <button
                  type="submit"
                  className="glass-button px-5 py-2 rounded-lg font-medium hover:bg-pink-500/20 whitespace-nowrap transition-colors"
                  suppressHydrationWarning
                >
                  Đăng ký
                </button>
              ) : (
                <div className="glass-button px-5 py-2 rounded-lg font-medium hover:bg-pink-500/20 whitespace-nowrap transition-colors">
                  Đăng ký
                </div>
              )}
            </form>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-glass-muted hover:text-pink-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-glass-muted hover:text-pink-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-glass-muted hover:text-pink-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-glass-muted hover:text-pink-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-glass-muted">
          © {new Date().getFullYear()} TruyenHay. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
