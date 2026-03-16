import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import uiReducer from "./slices/uiSlice";
import readingReducer from "./slices/readingSlice";
import favoritesReducer from "./slices/favoritesSlice";

const rootReducer = combineReducers({
  ui: uiReducer,
  reading: readingReducer,
  favorites: favoritesReducer,
});

// Load state từ localStorage khi khởi động
function loadState(): Partial<ReturnType<typeof rootReducer>> | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const serialized = localStorage.getItem("comic-store");
    if (!serialized || serialized === "undefined" || serialized.trim() === "") return undefined;
    const { reading, favorites } = JSON.parse(serialized);
    return { reading, favorites };
  } catch (error) {
    console.error("Redux loadState parsing error:", error);
    // If parse fails, clear the corrupted item
    if (typeof window !== "undefined") {
      localStorage.removeItem("comic-store");
    }
    return undefined;
  }
}

// Persist reading + favorites (không persist UI)
function saveState(state: ReturnType<typeof rootReducer>) {
  try {
    localStorage.setItem(
      "comic-store",
      JSON.stringify({ reading: state.reading, favorites: state.favorites })
    );
  } catch {
    // Bỏ qua lỗi storage
  }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

// Subscribe → lưu vào localStorage mỗi khi state thay đổi
if (typeof window !== "undefined") {
  store.subscribe(() => saveState(store.getState()));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
