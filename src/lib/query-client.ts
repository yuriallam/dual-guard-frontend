import { QueryClient } from '@tanstack/react-query';

// Create a query client with default options
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: data is considered fresh for 30 seconds
        staleTime: 30 * 1000,
        // Cache time: unused data stays in cache for 5 minutes
        gcTime: 5 * 60 * 1000, // Previously cacheTime
        // Retry failed requests once
        retry: 1,
        // Refetch on window focus in production (disabled in dev for better DX)
        refetchOnWindowFocus: import.meta.env.PROD,
        // Don't refetch on reconnect by default
        refetchOnReconnect: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  });
};

