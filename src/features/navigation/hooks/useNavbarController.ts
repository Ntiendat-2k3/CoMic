"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  closeMobileMenu,
  toggleMobileCategories,
  toggleMobileMenu,
} from "@/store/slices/uiSlice";

/** Điều phối trạng thái menu và hiệu ứng khóa cuộn trên thiết bị nhỏ. */
export function useNavbarController() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { mobileMenuOpen, mobileCategoriesOpen } = useAppSelector(
    (state) => state.ui,
  );

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [dispatch, pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(closeMobileMenu());
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [dispatch, mobileMenuOpen]);

  const toggleMenu = useCallback(
    () => dispatch(toggleMobileMenu()),
    [dispatch],
  );
  const closeMenu = useCallback(
    () => dispatch(closeMobileMenu()),
    [dispatch],
  );
  const toggleCategories = useCallback(
    () => dispatch(toggleMobileCategories()),
    [dispatch],
  );

  return {
    mobileMenuOpen,
    mobileCategoriesOpen,
    toggleMenu,
    closeMenu,
    toggleCategories,
  };
}
