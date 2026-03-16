import LayoutMain from "@/components/layout/LayoutMain";
import OfflineComicClient from "./OfflineComicClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: "Chi tiết truyện Offline",
  description: "Trang chi tiết truyện đã tải xuống",
};

export default async function OfflineComicPage(props: Props) {
  const { slug } = await props.params;
  return (
    <LayoutMain>
       <OfflineComicClient slug={slug} />
    </LayoutMain>
  );
}
