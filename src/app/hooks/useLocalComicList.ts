import { useEffect, useState } from 'react';
import OTruyenService from '@/app/services/otruyen.service';
import { Comic } from '@/app/types/comic';

export function useLocalComicList<TMeta extends string = string>(
  keyPrefix: string
): [Array<{ slug: string; comic: Comic; meta: TMeta }>, boolean] {
  const [items, setItems] = useState<Array<{ slug: string; comic: Comic; meta: TMeta }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const raw: Array<{ slug: string; meta: TMeta }> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(keyPrefix)) {
          const slug = key.slice(keyPrefix.length);
          const meta = localStorage.getItem(key) as TMeta;
          if (meta) raw.push({ slug, meta });
        }
      }
      if (raw.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const results = await Promise.all(
          raw.map(async ({ slug, meta }) => {
            const res = await OTruyenService.getComicDetail(slug);
            return { slug, comic: res.data.item, meta };
          })
        );
        setItems(results);
      } catch (error) {
        console.error('useLocalComicList load error', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [keyPrefix]);

  return [items, loading];
}
