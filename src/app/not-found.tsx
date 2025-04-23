"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
        <div className="mx-auto mb-6 w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 relative">
          <Image
            src="/404-comic.png"
            alt="404 Not Found"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
          Ôi không… Trang này không có thật!
        </h1>
        <p className="text-sm sm:text-base md:text-lg mb-6 opacity-80">
          Có thể bạn đã gõ sai đường dẫn hoặc trang này đã bị gỡ bỏ.
        </p>

        <Link
          href="/"
          className="inline-flex items-center bg-primary px-4 py-2 sm:px-5 sm:py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Quay về Trang chủ</span>
        </Link>
      </div>
    </main>
  );
}
