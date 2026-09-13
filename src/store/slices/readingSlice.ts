import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Lưu tiến độ đọc từng bộ truyện
export interface ReadingEntry {
  slug: string;
  chapterName: string;
  chapterSlug?: string;
  comicName: string;
  thumbUrl: string;
  readAt: number; // timestamp
}

interface ReadingState {
  // key: comic slug → giá trị: chapter đang đọc
  history: Record<string, ReadingEntry>;
}

const initialState: ReadingState = {
  history: {},
};

const readingSlice = createSlice({
  name: "reading",
  initialState,
  reducers: {
    saveProgress(
      state,
      action: PayloadAction<{
        slug: string;
        chapterName: string;
        chapterSlug?: string;
        comicName: string;
        thumbUrl: string;
      }>
    ) {
      const { slug, chapterName, chapterSlug, comicName, thumbUrl } = action.payload;
      state.history[slug] = {
        slug,
        chapterName,
        chapterSlug,
        comicName,
        thumbUrl,
        readAt: Date.now(),
      };
    },
    clearHistory(state) {
      state.history = {};
    },
    removeEntry(state, action: PayloadAction<string>) {
      delete state.history[action.payload];
    },
  },
});

export const { saveProgress, clearHistory, removeEntry } = readingSlice.actions;

// Selectors
export const selectLastRead = (slug: string) => (state: { reading: ReadingState }) =>
  state.reading.history[slug];

export const selectAllHistory = (state: { reading: ReadingState }) =>
  Object.values(state.reading.history).sort((a, b) => b.readAt - a.readAt);

export const selectReadingHistory = (state: { reading: ReadingState }) =>
  state.reading.history;

export default readingSlice.reducer;
