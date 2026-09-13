import vi from "../../public/locales/vi.json";
import { DEFAULT_LOCALE, type Locale } from "./config";

export type Dictionary = typeof vi;

const dictionaries: Record<Locale, Dictionary> = {
  vi,
};

/** Trả về dictionary tương ứng với locale đã được ứng dụng xác thực. */
export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return dictionaries[locale];
}
