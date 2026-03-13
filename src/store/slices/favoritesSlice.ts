import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteEntry {
  slug: string;
  name: string;
  thumbUrl: string;
  cdnUrl: string;
  addedAt: number;
}

interface FavoritesState {
  items: Record<string, FavoriteEntry>;
}

const initialState: FavoritesState = {
  items: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Omit<FavoriteEntry, "addedAt">>) {
      const { slug } = action.payload;
      state.items[slug] = { ...action.payload, addedAt: Date.now() };
    },
    removeFavorite(state, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    toggleFavorite(state, action: PayloadAction<Omit<FavoriteEntry, "addedAt">>) {
      const { slug } = action.payload;
      if (state.items[slug]) {
        delete state.items[slug];
      } else {
        state.items[slug] = { ...action.payload, addedAt: Date.now() };
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;

// Selectors
export const selectIsFavorite = (slug: string) => (state: { favorites: FavoritesState }) =>
  Boolean(state.favorites.items[slug]);

export const selectAllFavorites = (state: { favorites: FavoritesState }) =>
  Object.values(state.favorites.items).sort((a, b) => b.addedAt - a.addedAt);

export default favoritesSlice.reducer;
