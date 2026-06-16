import "@testing-library/jest-dom";
import { render, type renderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { LocaleProvider } from "@/lib/locale-provider";
import { QueryWrapper } from "./query-wrapper";

export function renderWithAllProviders(
	ui: ReactElement,
	options?: renderOptions,
) {
	return render(ui, {
		wrapper: ({ children }) => (
			<QueryWrapper>
				<LocaleProvider>{children}</LocaleProvider>
			</QueryWrapper>
		),
		...options,
	});
}
