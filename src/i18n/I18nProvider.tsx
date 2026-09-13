"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries";

const I18nContext = createContext<Dictionary | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  dictionary: Dictionary;
}

/** Cung cấp cùng một dictionary cho toàn bộ Client Component trong cây ứng dụng. */
export function I18nProvider({ children, dictionary }: I18nProviderProps) {
  return (
    <I18nContext.Provider value={dictionary}>{children}</I18nContext.Provider>
  );
}

/** Đọc nội dung hiển thị đã được chọn tại boundary của ứng dụng. */
export function useDictionary(): Dictionary {
  const dictionary = useContext(I18nContext);

  if (!dictionary) {
    throw new Error("I18nProvider chưa được khởi tạo");
  }

  return dictionary;
}
