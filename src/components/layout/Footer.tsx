import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/60 bg-gray-900/50 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <Heart size={16} className="text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white">TruyenHay</span>
            </div>
            <p className="text-gray-400 text-sm">
              Đọc truyện tranh online miễn phí, cập nhật nhanh nhất.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Nhanh</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/danh-sach/truyen-moi" className="hover:text-white transition-colors">Truyện mới</Link></li>
              <li><Link href="/danh-sach/hoan-thanh" className="hover:text-white transition-colors">Hoàn thành</Link></li>
              <li><Link href="/yeu-thich" className="hover:text-white transition-colors">Yêu thích</Link></li>
              <li><Link href="/lich-su" className="hover:text-white transition-colors">Lịch sử</Link></li>
            </ul>
          </div>

          {/* Data source */}
          <div>
            <h4 className="text-white font-semibold mb-3">Dữ liệu</h4>
            <p className="text-gray-400 text-sm">
              Dữ liệu từ{" "}
              <a href="https://otruyenapi.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors">
                OTruyenAPI
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TruyenHay. Dành cho mục đích học tập.
        </div>
      </div>
    </footer>
  );
}
