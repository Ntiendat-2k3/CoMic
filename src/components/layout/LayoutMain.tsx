import { Suspense, type ReactNode } from "react";
import ComicCatalogService from "@/services/comic-catalog.service";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

interface LayoutMainProps {
  children: ReactNode;
}

async function NavbarData() {
  const categories = await ComicCatalogService.getCategories().catch(() => []);
  return <Navbar categories={categories} />;
}

const LayoutMain = ({ children }: LayoutMainProps) => {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Suspense fallback={<Navbar categories={[]} />}>
          <NavbarData />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default LayoutMain;
