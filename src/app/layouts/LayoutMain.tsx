import { ReactNode } from "react";
import OTruyenService from "../services/otruyen.service";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface LayoutMainProps {
  children: ReactNode;
}

const LayoutMain = async ({ children }: LayoutMainProps) => {
  // Không gọi trực tiếp trong Dropdown là để tối ưu cho SEO vì đây là server side  còn Dropdown là client side (cần useEffect, fetch)
  // chỉ fetch 1 lần cho cả trang, k bị render nhiều lần
  const categories = await OTruyenService.getCategories();
  // console.log("🚀 ~ LayoutMain ~ categories:", categories)

  return (
    <div className="min-h-screen flex flex-col bg-gray-700">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutMain;
