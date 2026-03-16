import LayoutMain from "@/components/layout/LayoutMain";
import OfflineClient from "./OfflineClient";

export const metadata = {
  title: "Kho tải xuống - Đọc Offline",
  description: "Thư viện các truyện bạn đã tải xuống để đọc không cần mạng.",
};

export default function OfflinePage() {
  return (
    <LayoutMain>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-pink-400">⚡</span> Kho Tải Xuống
        </h1>
        <p className="text-gray-400 mb-8">Danh sách truyện và chương bạn đã lưu để đọc ngoại tuyến.</p>
        
        <OfflineClient />
      </div>
    </LayoutMain>
  );
}
