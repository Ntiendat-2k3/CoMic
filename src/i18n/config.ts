export const DEFAULT_LOCALE = "vi" as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
