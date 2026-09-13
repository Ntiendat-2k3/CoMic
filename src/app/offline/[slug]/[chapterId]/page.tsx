import LayoutMain from "@/components/layout/LayoutMain";
import OfflineReaderClient from "./OfflineReaderClient";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary();

interface Props {
  params: Promise<{ slug: string; chapterId: string }>;
}

export const metadata = {
  title: dictionary.offline.readerMetadataTitle,
};

export default async function OfflineChapterPage(props: Props) {
  const { slug, chapterId } = await props.params;

  return (
    <LayoutMain>
       <OfflineReaderClient slug={slug} chapterId={chapterId} />
    </LayoutMain>
  );
}
