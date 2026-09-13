"use client";

import { useDictionary } from "@/i18n/I18nProvider";

export default function Error({ error }: { error: Error }) {
  const { errors } = useDictionary();

  return (
    <div className="text-center py-20 text-red-500">
      <h2 className="text-2xl font-bold">{errors.pageTitle}</h2>
      <p className="mt-4">{error.message}</p>
    </div>
  );
}
