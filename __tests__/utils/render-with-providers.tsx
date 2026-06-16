"use client";

import { render, type renderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { LocaleProvider } from "@/lib/locale-provider";

export function renderWithProviders(ui: ReactElement, options?: renderOptions) {
	return render(ui, { wrapper: LocaleProvider, ...options });
}
