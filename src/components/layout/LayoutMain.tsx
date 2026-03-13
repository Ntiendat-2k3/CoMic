import type { ReactNode } from "react";
import OTruyenService from "@/services/otruyen.service";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

interface LayoutMainProps {
  children: ReactNode;
}

// Server Component: fetch categories 1 lần ở đây, pass xuống Navbar
// Nhờ vậy không cần gọi API ở client, tốt hơn cho SEO
const LayoutMain = async ({ children }: LayoutMainProps) => {
  const categories = await OTruyenService.getCategories();

  return (
    <>
      <Sidebar />
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default LayoutMain;
