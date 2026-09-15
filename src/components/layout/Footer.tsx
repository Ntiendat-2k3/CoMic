import Link from "next/link";
import { Heart } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { formatMessage } from "@/i18n/format-message";

export default function Footer() {
  const { brand, footer, navigation } = getDictionary();

  return (
    <footer className="mt-10 hidden border-t border-gray-800/60 bg-gray-900/50 py-10 md:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Thương hiệu */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <Heart size={16} className="text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-white">{brand.name}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {brand.shortDescription}
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="text-white font-semibold mb-3">{footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/danh-sach/truyen-moi" className="hover:text-white transition-colors">{navigation.newComics}</Link></li>
              <li><Link href="/danh-sach/hoan-thanh" className="hover:text-white transition-colors">{navigation.completed}</Link></li>
              <li><Link href="/yeu-thich" className="hover:text-white transition-colors">{navigation.favorites}</Link></li>
              <li><Link href="/lich-su" className="hover:text-white transition-colors">{navigation.history}</Link></li>
            </ul>
          </div>

          {/* Nguồn dữ liệu */}
          <div>
            <h4 className="text-white font-semibold mb-3">{footer.data}</h4>
            <p className="text-gray-400 text-sm">
              {footer.dataSource}{" "}
              <a href="https://mangadex.org" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 transition-colors">
                {footer.sourceName}
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-6 text-center text-sm text-gray-500">
          {formatMessage(footer.copyright, { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
