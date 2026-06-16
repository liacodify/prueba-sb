"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";

const defaultRetryDelay = (attemptIndex: number) =>
	Math.min(1000 * 2 ** attemptIndex, 30000);

export function QueryProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000,
						gcTime: 10 * 60 * 1000,
						refetchOnWindowFocus: false,
						retry: (failureCount, error) => {
							if (failureCount >= 3) return false;
							if (
								error instanceof Error &&
								(error.message.includes("401") || error.message.includes("403"))
							) {
								return false;
							}
							return true;
						},
						retryDelay: defaultRetryDelay,
					},
					mutations: {
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
