import LayoutMain from "@/app/layouts/LayoutMain";
import Link from "next/link";
import HistoryContent from "../components/history/HistoryContent";

export default function HistoryPageWrapper() {
  return (
    <LayoutMain>
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-white/70">
          <Link href="/" className="hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">Lịch sử đọc</span>
        </nav>
        {/* Client-side history list */}
        <HistoryContent />
      </div>
    </LayoutMain>
  );
}