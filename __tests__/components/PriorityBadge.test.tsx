import { screen } from "@testing-library/react";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { renderWithProviders } from "../utils/render-with-providers";

describe("PriorityBadge", () => {
	it("renderiza prioridad baja correctamente", () => {
		renderWithProviders(<PriorityBadge priority="low" />);
		expect(screen.getByText("Baja")).toBeInTheDocument();
	});

	it("renderiza prioridad media correctamente", () => {
		renderWithProviders(<PriorityBadge priority="medium" />);
		expect(screen.getByText("Media")).toBeInTheDocument();
	});

	it("renderiza prioridad alta correctamente", () => {
		renderWithProviders(<PriorityBadge priority="high" />);
		expect(screen.getByText("Alta")).toBeInTheDocument();
	});

	it("renderiza prioridad crítica correctamente", () => {
		renderWithProviders(<PriorityBadge priority="critical" />);
		expect(screen.getByText("Crítica")).toBeInTheDocument();
	});
});
