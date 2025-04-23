import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-12 py-10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-sm opacity-90">
              TruyenHay là nền tảng đọc truyện tranh online lớn nhất Việt Nam,
              với kho truyện đa dạng từ manga, manhwa đến teenfic.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Điều hướng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:underline">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/lich-su" className="hover:underline">
                  Lịch sử đọc
                </a>
              </li>
              <li>
                <a href="/yeu-thich" className="hover:underline">
                  Yêu thích
                </a>
              </li>
              <li>
                <a href="/the-loai" className="hover:underline">
                  Thể loại
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="hover:underline">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:underline">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:underline">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Đăng ký nhận tin</h3>
            <form className="flex flex-col sm:flex-row items-center gap-2 mb-4">
              <div className="flex items-center w-full sm:flex-1 bg-white rounded-lg overflow-hidden">
                <Mail className="w-5 h-5 mx-3" color='red'/>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 text-black focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-primary px-5 py-2 rounded-lg font-medium hover:opacity-90 whitespace-nowrap"
              >
                Đăng ký
              </button>
            </form>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:opacity-80">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:opacity-80">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:opacity-80">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-80">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm opacity-80">
          © {new Date().getFullYear()} TruyenHay. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
