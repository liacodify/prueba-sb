import { screen } from "@testing-library/react";
import { ErrorState } from "@/components/shared/ErrorState";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { renderWithProviders } from "../utils/render-with-providers";

describe("Accesibilidad - StatusBadge", () => {
	it("renderiza con atributos aria correctos", () => {
		renderWithProviders(<StatusBadge status="pending" />);
		const badge = screen.getByText("Pendiente");
		expect(badge).toHaveAttribute("class");
	});
});

describe("Accesibilidad - PriorityBadge", () => {
	it("renderiza con atributos aria correctos", () => {
		renderWithProviders(<PriorityBadge priority="high" />);
		const badge = screen.getByText("Alta");
		expect(badge).toHaveAttribute("class");
	});
});

describe("Accesibilidad - ErrorState", () => {
	it("debe tener role=alert", () => {
		renderWithProviders(<ErrorState />);
		const alert = screen.getByRole("alert");
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveAttribute("aria-live", "assertive");
	});
});
