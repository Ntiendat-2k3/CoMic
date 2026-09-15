"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ComicGrid from "@/components/comic/ComicGrid";
import HomeHero from "@/components/home/HomeHero";
import HomeQuickActions from "@/components/home/HomeQuickActions";
import Pagination from "@/components/ui/Pagination";
import { useHomePageController } from "@/features/home/hooks/useHomePageController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import type { HomeResponse } from "@/types/response";
import styles from "./Home.module.scss";

interface HomeClientProps {
  initialData?: HomeResponse;
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const { page, setPage, data, isLoading, isFetching } = useHomePageController(initialData);
  const { home } = useDictionary();
  const featuredComics = data?.comics ?? initialData?.data.items ?? [];
  const comics = page === 1 ? data?.comics?.slice(1) : data?.comics;

  return (
    <div className={styles.pageContent}>
      <HomeHero key={page} comics={featuredComics} />

      <div className={styles.contentFrame}>
        <HomeQuickActions />

        <section className={styles.catalogSection} aria-labelledby="home-catalog-title">
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>{home.subtitle}</p>
              <h2 id="home-catalog-title">{home.title}</h2>
              <p>
                {data?.comics
                  ? formatMessage(home.updatedSummary, { count: data.comics.length })
                  : formatMessage(home.subtitleWithPages, { pages: data?.totalPages ?? 1 })}
              </p>
            </div>
            <Link href="/danh-sach/truyen-moi" className={styles.viewAllLink}>
              {home.viewAll}<ArrowRight size={16} aria-hidden="true" />
            </Link>
          </header>

          <div className={`${styles.gridTransition} ${isFetching && !isLoading ? styles.gridFetching : ""}`}>
            <ComicGrid
              comics={comics}
              cdnUrl=""
              isLoading={isLoading}
              skeletonCount={14}
            />
          </div>

          {data ? (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
