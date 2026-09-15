"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";
import { useHomeHeroController } from "@/features/home/hooks/useHomeHeroController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import type { Comic } from "@/types/comic";
import styles from "./HomeHero.module.scss";

const MAX_FEATURED_COMICS = 5;

interface HomeHeroProps {
  comics: Comic[];
}

/** Banner toàn chiều rộng, luân phiên các truyện nổi bật của trang hiện tại. */
export default function HomeHero({ comics }: HomeHeroProps) {
  const slides = comics.slice(0, MAX_FEATURED_COMICS);
  const controller = useHomeHeroController(slides.length);
  const { comic: comicCopy, home, locale } = useDictionary();
  const featured = slides[controller.activeIndex];

  if (!featured) return null;

  const statusLabels: Record<string, string> = {
    ongoing: comicCopy.ongoing,
    completed: comicCopy.completed,
    hiatus: comicCopy.hiatus,
    cancelled: comicCopy.cancelled,
  };
  const description = featured.content.replace(/<[^>]+>/g, "");
  const slideNumber = String(controller.activeIndex + 1).padStart(2, "0");
  const slideCount = String(slides.length).padStart(2, "0");

  return (
    <section
      className={styles.hero}
      aria-label={home.featuredCarouselAriaLabel}
      aria-roledescription="carousel"
      onMouseEnter={controller.pause}
      onMouseLeave={controller.resume}
      onFocusCapture={controller.pause}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) controller.resume();
      }}
    >
      <Image
        src="/assets/background-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.backgroundArtwork}
      />
      <div className={styles.colorWash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div key={featured._id} className={styles.slideFrame}>
        <div className={styles.heroContent}>
          <div className={styles.coverStage} aria-hidden="true">
            <div className={styles.heroCover}>
              <Image
                src={resolveCoverUrl(featured.thumb_url)}
                alt=""
                fill
                priority={controller.activeIndex === 0}
                sizes="(min-width: 1280px) 430px, (min-width: 768px) 34vw, 68vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span>{home.featuredEyebrow}</span>
              <span aria-hidden="true">{"//"}</span>
              <span>{slideNumber} — {slideCount}</span>
            </p>

            <h1>{featured.name}</h1>

            {featured.origin_name[0] ? (
              <p className={styles.alternativeTitle}>{featured.origin_name[0]}</p>
            ) : null}

            <div className={styles.heroBadges}>
              <span>
                <BookOpen size={15} aria-hidden="true" />
                {statusLabels[featured.status] ?? featured.status}
              </span>
              {featured.year ? (
                <span><CalendarDays size={15} aria-hidden="true" />{featured.year}</span>
              ) : null}
              {featured.statistics?.rating ? (
                <span>
                  <Star size={15} aria-hidden="true" />
                  {formatMessage(home.rating, {
                    rating: featured.statistics.rating.toFixed(1),
                  })}
                </span>
              ) : null}
              {featured.statistics?.follows ? (
                <span>
                  <Heart size={15} aria-hidden="true" />
                  {formatMessage(home.followers, {
                    count: new Intl.NumberFormat(locale, { notation: "compact" }).format(
                      featured.statistics.follows,
                    ),
                  })}
                </span>
              ) : null}
            </div>

            {description ? <p className={styles.description}>{description}</p> : null}

            <div className={styles.heroTags}>
              {featured.category.slice(0, 4).map((category) => (
                <Link key={category._id} href={`/the-loai/${category.slug}`}>
                  {category.name}
                </Link>
              ))}
            </div>

            <Link href={`/truyen-tranh/${featured.slug}`} className={styles.primaryAction}>
              {home.featuredAction}
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className={styles.carouselControls}>
          <button
            type="button"
            onClick={controller.showPrevious}
            aria-label={home.previousFeaturedAriaLabel}
            className={styles.arrowButton}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <div className={styles.indicators}>
            {slides.map((comic, index) => (
              <button
                key={comic._id}
                type="button"
                onClick={() => controller.showSlide(index)}
                aria-label={formatMessage(home.selectFeaturedAriaLabel, { name: comic.name })}
                aria-current={index === controller.activeIndex ? "true" : undefined}
                className={index === controller.activeIndex ? styles.activeIndicator : undefined}
              >
                <span />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={controller.showNext}
            aria-label={home.nextFeaturedAriaLabel}
            className={styles.arrowButton}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
