"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  closeMobileMenu,
  toggleMobileCategories,
  toggleMobileMenu,
} from "@/store/slices/uiSlice";

/** Điều phối trạng thái menu và hiệu ứng khóa cuộn trên thiết bị nhỏ. */
export function useNavbarController() {
  const dispatch = useAppDispatch();
  const { mobileMenuOpen, mobileCategoriesOpen } = useAppSelector(
    (state) => state.ui,
  );

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
