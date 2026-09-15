"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Flame,
  Heart,
  PauseCircle,
  Shapes,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ComicGrid from "@/components/comic/ComicGrid";
import Pagination from "@/components/ui/Pagination";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { useHomePageController } from "@/features/home/hooks/useHomePageController";
import type { HomeResponse } from "@/types/response";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";
import styles from "./Home.module.scss";

interface HomeClientProps {
  initialData?: HomeResponse;
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const { page, setPage, data, isLoading, isFetching } = useHomePageController(initialData);
  const { comic: comicCopy, home, locale, navigation } = useDictionary();
  const featured = initialData?.data.items[0] ?? data?.comics?.[0];
  const comics = page === 1 ? data?.comics?.slice(1) : data?.comics;

  const statusLabels: Record<string, string> = {
    ongoing: comicCopy.ongoing,
    completed: comicCopy.completed,
    hiatus: comicCopy.hiatus,
    cancelled: comicCopy.cancelled,
  };
  const quickActions = [
    { href: "/danh-sach/truyen-moi", label: navigation.newComics, icon: Flame, featured: true },
    { href: "/danh-sach/dang-phat-hanh", label: comicCopy.ongoing, icon: BookOpen },
    { href: "/danh-sach/hoan-thanh", label: navigation.completed, icon: CheckCircle2 },
    { href: "/danh-sach/tam-ngung", label: navigation.hiatus, icon: PauseCircle },
    { href: "/the-loai", label: navigation.categories, icon: Shapes },
    { href: "/yeu-thich", label: navigation.favorites, icon: Heart },
  ];

  return (
    <div className={styles.pageContent}>
      {featured ? (
        <section className={styles.hero} aria-labelledby="featured-comic-title">
          <Image
            src={resolveCoverUrl(featured.thumb_url)}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroBackdrop}
          />
          <div className={styles.heroScrim} />

          <div className={styles.heroContent}>
            <div className={styles.heroCopy}>
              <h1 id="featured-comic-title">{featured.name}</h1>
              {featured.origin_name[0] ? (
                <p className={styles.alternativeTitle}>{featured.origin_name[0]}</p>
              ) : null}

              <div className={styles.heroBadges}>
                <span><BookOpen size={14} />{statusLabels[featured.status] ?? featured.status}</span>
                {featured.year ? <span><CalendarDays size={14} />{featured.year}</span> : null}
                {featured.statistics?.rating ? (
                  <span><Star size={14} />{formatMessage(home.rating, { rating: featured.statistics.rating.toFixed(1) })}</span>
                ) : null}
                {featured.statistics?.follows ? (
                  <span><Heart size={14} />{formatMessage(home.followers, {
                    count: new Intl.NumberFormat(locale, { notation: "compact" }).format(featured.statistics.follows),
                  })}</span>
                ) : null}
              </div>

              {featured.content ? <p className={styles.heroDescription}>{featured.content}</p> : null}

              <div className={styles.heroTags}>
                {featured.category.slice(0, 4).map((category) => (
                  <Link key={category._id} href={`/the-loai/${category.slug}`}>{category.name}</Link>
                ))}
              </div>

              <Link href={`/truyen-tranh/${featured.slug}`} className={styles.heroAction}>
                {home.featuredAction}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <Link href={`/truyen-tranh/${featured.slug}`} className={styles.heroCover} tabIndex={-1} aria-hidden="true">
              <Image
                src={resolveCoverUrl(featured.thumb_url)}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 300px, 34vw"
                className="object-cover"
              />
            </Link>
          </div>
        </section>
      ) : null}

      <nav className={styles.quickActions} aria-label={navigation.quickActionsAriaLabel}>
        {quickActions.map(({ href, label, icon: Icon, featured: isFeatured }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.quickAction} ${isFeatured ? styles.quickActionFeatured : ""}`}
          >
            <Icon size={23} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

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
  );
}
