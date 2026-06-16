"use client";

import { useCallback, useEffect } from "react";

export interface KeyboardShortcut {
	key: string;
	ctrlKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	action: () => void;
	description: string;
}

interface UseKeyboardShortcutsOptions {
	shortcuts: KeyboardShortcut[];
	enabled?: boolean;
}

export function useKeyboardShortcuts({
	shortcuts,
	enabled = true,
}: UseKeyboardShortcutsOptions) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!enabled) return;

			const target = event.target as HTMLElement;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable
			) {
				return;
			}

			for (const shortcut of shortcuts) {
				const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
				const ctrlMatch =
					!!shortcut.ctrlKey === (event.ctrlKey || event.metaKey);
				const shiftMatch = !!shortcut.shiftKey === event.shiftKey;

				if (keyMatch && ctrlMatch && shiftMatch) {
					event.preventDefault();
					shortcut.action();
					return;
				}
			}
		},
		[shortcuts, enabled],
	);

	useEffect(() => {
		if (!enabled) return;

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown, enabled]);
}

export function useFocusOnKey(targetKey: string, targetSelector: string) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === targetKey.toLowerCase()) {
				const target = event.target as HTMLElement;
				if (
					target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.tagName === "SELECT" ||
					target.isContentEditable
				) {
					return;
				}

				const element = document.querySelector(targetSelector) as HTMLElement;
				element?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [targetKey, targetSelector]);
}
