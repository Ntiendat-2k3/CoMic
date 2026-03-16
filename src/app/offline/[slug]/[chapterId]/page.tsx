import LayoutMain from "@/components/layout/LayoutMain";
import OfflineReaderClient from "./OfflineReaderClient";

interface Props {
  params: Promise<{ slug: string; chapterId: string }>;
}

export const metadata = {
  title: "Đọc Offline",
};

export default async function OfflineChapterPage(props: Props) {
  const { slug, chapterId } = await props.params;

  return (
    <LayoutMain>
       <OfflineReaderClient slug={slug} chapterId={chapterId} />
    </LayoutMain>
  );
}
