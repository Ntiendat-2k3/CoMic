import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  mobileMenuOpen: boolean;
  mobileAccountOpen: boolean;
  mobileCategoriesOpen: boolean;
  sidebarVisible: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
  mobileAccountOpen: false,
  mobileCategoriesOpen: false,
  sidebarVisible: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      state.mobileAccountOpen = false;
      // Đóng danh mục con khi đóng menu chính.
      if (!state.mobileMenuOpen) state.mobileCategoriesOpen = false;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
      state.mobileCategoriesOpen = false;
    },
    toggleMobileAccount(state) {
      state.mobileAccountOpen = !state.mobileAccountOpen;
      state.mobileMenuOpen = false;
      state.mobileCategoriesOpen = false;
    },
    closeMobileAccount(state) {
      state.mobileAccountOpen = false;
    },
    closeMobileOverlays(state) {
      state.mobileMenuOpen = false;
      state.mobileAccountOpen = false;
      state.mobileCategoriesOpen = false;
    },
    toggleMobileCategories(state) {
      state.mobileCategoriesOpen = !state.mobileCategoriesOpen;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleMobileAccount,
  closeMobileAccount,
  closeMobileOverlays,
  toggleMobileCategories,
} = uiSlice.actions;

export default uiSlice.reducer;
