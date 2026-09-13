"use client";

import { useEffect, useState } from "react";

/** Cho biết Client Component đã hydrate để tránh lệch dữ liệu lưu cục bộ. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
