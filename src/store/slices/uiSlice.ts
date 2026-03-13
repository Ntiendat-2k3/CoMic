import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  mobileMenuOpen: boolean;
  mobileCategoriesOpen: boolean;
  sidebarVisible: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
  mobileCategoriesOpen: false,
  sidebarVisible: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      // Đóng categories khi đóng menu
      if (!state.mobileMenuOpen) state.mobileCategoriesOpen = false;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
      state.mobileCategoriesOpen = false;
    },
    toggleMobileCategories(state) {
      state.mobileCategoriesOpen = !state.mobileCategoriesOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  toggleMobileCategories,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
