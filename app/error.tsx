"use client";

import { useEffect } from "react";

export default function GlobalError({
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
		<html lang="es">
			<body>
				<div className="flex h-screen w-full items-center justify-center">
					<div className="flex flex-col items-center gap-4 text-center max-w-md p-8">
						<div className="text-6xl">😕</div>
						<h1 className="text-2xl font-bold">Error crítico</h1>
						<p className="text-muted-foreground">
							Ocurrió un error inesperado. Por favor recarga la página.
						</p>
						<button
							onClick={reset}
							className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
						>
							Reintentar
						</button>
					</div>
				</div>
			</body>
		</html>
	);
}
