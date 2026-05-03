"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { Toaster } from "sonner";
import { RewardProvider } from "./RewardProvider";
import { PageTransition } from "@/components/ui/PageTransition";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error: unknown) => {
              if ((error as AxiosError)?.response?.status === 401) return false;
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <RewardProvider>{children}</RewardProvider>
      <PageTransition />
    </QueryClientProvider>
  );
}
