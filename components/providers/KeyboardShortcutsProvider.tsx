"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";

interface KeyboardShortcutsProviderProps {
	children: ReactNode;
}

export function KeyboardShortcutsProvider({
	children,
}: KeyboardShortcutsProviderProps) {
	const router = useRouter();

	useKeyboardShortcuts({
		shortcuts: [
			{
				key: "n",
				ctrlKey: true,
				action: () => router.push("/solicitudes/new"),
				description: "Crear nueva solicitud",
			},
			{
				key: "b",
				ctrlKey: true,
				action: () => router.push("/solicitudes"),
				description: "Ir a bandeja de solicitudes",
			},
			{
				key: "d",
				ctrlKey: true,
				action: () => router.push("/"),
				description: "Ir al dashboard",
			},
			{
				key: "Escape",
				action: () => {
					document.body.blur();
					document.activeElement instanceof HTMLElement &&
						document.activeElement.blur();
				},
				description: "Quitar foco del elemento actual",
			},
		],
	});

	return <>{children}</>;
}
