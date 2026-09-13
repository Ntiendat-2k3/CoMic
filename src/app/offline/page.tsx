import LayoutMain from "@/components/layout/LayoutMain";
import OfflineClient from "./OfflineClient";
import { getDictionary } from "@/i18n/dictionaries";

const dictionary = getDictionary();

export const metadata = {
  title: dictionary.offline.metadataTitle,
  description: dictionary.offline.metadataDescription,
};

export default function OfflinePage() {
  return (
    <LayoutMain>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-pink-400">⚡</span> {dictionary.offline.title}
        </h1>
        <p className="text-gray-400 mb-8">{dictionary.offline.description}</p>
        
        <OfflineClient />
      </div>
    </LayoutMain>
  );
}
