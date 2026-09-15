import { Suspense, type ReactNode } from "react";
import ComicCatalogService from "@/services/comic-catalog.service";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

interface LayoutMainProps {
  children: ReactNode;
  hideMobileNavigation?: boolean;
}

async function NavbarData({ hideMobileNavigation }: Pick<LayoutMainProps, "hideMobileNavigation">) {
  const categories = await ComicCatalogService.getCategories().catch(() => []);
  return <Navbar categories={categories} hideMobileNavigation={hideMobileNavigation} />;
}

const LayoutMain = ({ children, hideMobileNavigation = false }: LayoutMainProps) => {
  return (
    <>
      <Sidebar />
      <div className={`flex min-h-screen flex-col bg-[#0d0e16] ${hideMobileNavigation ? "pb-0" : "pb-[4.75rem] md:pb-0"}`}>
        <Suspense fallback={<Navbar categories={[]} hideMobileNavigation={hideMobileNavigation} />}>
          <NavbarData hideMobileNavigation={hideMobileNavigation} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default LayoutMain;
