import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5,      // кэш 5 сек
      gcTime: 1000 * 60 * 5,    // хранить 5 минут
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
