"use client";

import { useCallback, useState } from "react";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import { type Locale, LocaleContext } from "./locale-context";

const messages: Record<Locale, Record<string, unknown>> = {
	es: esMessages as Record<string, unknown>,
	en: enMessages as Record<string, unknown>,
};

function getNestedValue(obj: Record<string, unknown>, path: string): string {
	const keys = path.split(".");
	let current: unknown = obj;
	for (const key of keys) {
		if (current && typeof current === "object" && key in current) {
			current = (current as Record<string, unknown>)[key];
		} else {
			return path;
		}
	}
	return typeof current === "string" ? current : path;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocale] = useState<Locale>("es");

	const t = useCallback(
		(key: string): string => {
			return getNestedValue(messages[locale], key);
		},
		[locale],
	);

	return (
		<LocaleContext.Provider value={{ locale, setLocale, t }}>
			{children}
		</LocaleContext.Provider>
	);
}
