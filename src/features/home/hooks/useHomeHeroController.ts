"use client";

import { useCallback, useEffect, useState } from "react";

const AUTO_PLAY_INTERVAL = 7_000;

/** Điều phối slide nổi bật, tự dừng khi người dùng tương tác hoặc hạn chế chuyển động. */
export function useHomeHeroController(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      itemCount > 0 ? (current - 1 + itemCount) % itemCount : 0,
    );
  }, [itemCount]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      itemCount > 0 ? (current + 1) % itemCount : 0,
    );
  }, [itemCount]);

  const showSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (itemCount <= 1 || isPaused || prefersReducedMotion) return;

    const intervalId = window.setInterval(showNext, AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(intervalId);
  }, [isPaused, itemCount, prefersReducedMotion, showNext]);

  return {
    activeIndex: itemCount > 0 ? activeIndex % itemCount : 0,
    pause,
    resume,
    showNext,
    showPrevious,
    showSlide,
  };
}
