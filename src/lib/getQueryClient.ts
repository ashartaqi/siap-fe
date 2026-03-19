import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// cache() ensures one instance per server request (RSC-safe)
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
        },
      },
    }),
);
