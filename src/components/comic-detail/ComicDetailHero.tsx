import { getImageProps } from "next/image";
import type { Comic } from "@/types/comic";
import { getDictionary } from "@/i18n/dictionaries";
import {
  ActionButtons,
  CategoriesList,
  ComicMetadata,
  ComicThumbnail,
} from "./ComicDetailParts";
import styles from "./ComicDetailHero.module.scss";

interface ComicDetailHeroProps {
  comic: Comic;
  cdnUrl: string;
  firstChapterSlug: string;
  thumbSrc: string;
}

/** Sắp xếp phần giới thiệu chính theo luồng dọc trên mobile và hai cột trên desktop. */
export default function ComicDetailHero({
  comic,
  cdnUrl,
  firstChapterSlug,
  thumbSrc,
}: ComicDetailHeroProps) {
  const { comic: copy } = getDictionary();
  const commonBackgroundProps = {
    alt: "",
    fill: true,
    priority: true,
    sizes: "100vw",
  } as const;
  const { props: mobileBackgroundProps } = getImageProps({
    ...commonBackgroundProps,
    src: "/assets/background-of-detail-mobile.png",
  });
  const { props: desktopBackgroundProps } = getImageProps({
    ...commonBackgroundProps,
    src: "/assets/background-of-detail-destop.png",
  });

  return (
    <section className={styles.hero} aria-labelledby="comic-detail-title">
      <picture>
        <source media="(min-width: 640px)" srcSet={desktopBackgroundProps.srcSet} />
        <img {...mobileBackgroundProps} alt="" className={styles.backgroundArtwork} />
      </picture>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.coverColumn}>
          <div className={styles.coverFrame}>
            <ComicThumbnail src={thumbSrc} alt={comic.name} />
          </div>
        </div>

        <div className={styles.information}>
          <ComicMetadata comic={comic} titleId="comic-detail-title" />

          {comic.category.length > 0 ? (
            <div className={styles.categories}>
              <h2 className="sr-only">{copy.categoriesHeading}</h2>
              <CategoriesList categories={comic.category} />
            </div>
          ) : null}

          <div className={styles.actions}>
            <ActionButtons
              comic={comic}
              cdnUrl={cdnUrl}
              firstChapterSlug={firstChapterSlug}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
