import LayoutMain from "@/components/layout/LayoutMain";
import OfflineComicClient from "./OfflineComicClient";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary();

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata = {
  title: dictionary.offline.detailMetadataTitle,
  description: dictionary.offline.detailMetadataDescription,
};

export default async function OfflineComicPage(props: Props) {
  const { slug } = await props.params;
  return (
    <LayoutMain>
       <OfflineComicClient slug={slug} />
    </LayoutMain>
  );
}
