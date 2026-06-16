"use client";

import { useLocale } from "./locale-context";

export function useTranslations() {
	const { t } = useLocale();
	return { t };
}
