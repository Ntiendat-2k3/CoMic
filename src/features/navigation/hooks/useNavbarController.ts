"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  closeMobileAccount,
  closeMobileMenu,
  closeMobileOverlays,
  toggleMobileAccount,
  toggleMobileCategories,
  toggleMobileMenu,
} from "@/store/slices/uiSlice";

/** Điều phối các lớp điều hướng; chỉ menu phủ toàn màn hình mới khóa cuộn trang. */
export function useNavbarController() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { mobileMenuOpen, mobileAccountOpen, mobileCategoriesOpen } = useAppSelector(
    (state) => state.ui,
  );
  const mobileOverlayOpen = mobileMenuOpen || mobileAccountOpen;

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    dispatch(closeMobileOverlays());
  }, [dispatch, pathname]);

  useEffect(() => {
    if (!mobileOverlayOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(closeMobileOverlays());
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [dispatch, mobileOverlayOpen]);

  const toggleMenu = useCallback(
    () => dispatch(toggleMobileMenu()),
    [dispatch],
  );
  const closeMenu = useCallback(
    () => dispatch(closeMobileMenu()),
    [dispatch],
  );
  const toggleAccount = useCallback(
    () => dispatch(toggleMobileAccount()),
    [dispatch],
  );
  const closeAccount = useCallback(
    () => dispatch(closeMobileAccount()),
    [dispatch],
  );
  const toggleCategories = useCallback(
    () => dispatch(toggleMobileCategories()),
    [dispatch],
  );

  return {
    pathname,
    mobileMenuOpen,
    mobileAccountOpen,
    mobileCategoriesOpen,
    toggleMenu,
    closeMenu,
    toggleAccount,
    closeAccount,
    toggleCategories,
  };
}
