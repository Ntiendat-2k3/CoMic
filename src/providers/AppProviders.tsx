"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store";
import { makeQueryClient } from "@/lib/query-client";
import { I18nProvider } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppProvidersProps {
  children: React.ReactNode;
  dictionary: Dictionary;
}

export default function AppProviders({ children, dictionary }: AppProvidersProps) {
  // useState đảm bảo QueryClient không bị tạo lại sau mỗi lần render.
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <I18nProvider dictionary={dictionary}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
          {/* DevTools chỉ hiển thị ở môi trường phát triển */}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </Provider>
    </I18nProvider>
  );
}
