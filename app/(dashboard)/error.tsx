"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4 text-center max-w-md">
				<div className="text-6xl">😕</div>
				<h1 className="text-2xl font-bold">Algo salió mal</h1>
				<p className="text-muted-foreground">
					Lo sentimos, occurred an unexpected error. Please try again.
				</p>
				{error.digest && (
					<p className="text-xs text-muted-foreground font-mono">
						Error ID: {error.digest}
					</p>
				)}
				<Button onClick={reset} className="mt-4">
					Reintentar
				</Button>
			</div>
		</div>
	);
}
