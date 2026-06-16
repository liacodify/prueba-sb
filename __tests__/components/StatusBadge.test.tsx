import { screen } from "@testing-library/react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { renderWithProviders } from "../utils/render-with-providers";

describe("StatusBadge", () => {
	it("renderiza estado pendiente correctamente", () => {
		renderWithProviders(<StatusBadge status="pending" />);
		expect(screen.getByText("Pendiente")).toBeInTheDocument();
	});

	it("renderiza estado en revisión correctamente", () => {
		renderWithProviders(<StatusBadge status="in_review" />);
		expect(screen.getByText("En Revisión")).toBeInTheDocument();
	});

	it("renderiza estado aprobado correctamente", () => {
		renderWithProviders(<StatusBadge status="approved" />);
		expect(screen.getByText("Aprobada")).toBeInTheDocument();
	});

	it("renderiza estado rechazado correctamente", () => {
		renderWithProviders(<StatusBadge status="rejected" />);
		expect(screen.getByText("Rechazada")).toBeInTheDocument();
	});

	it("renderiza estado cerrado correctamente", () => {
		renderWithProviders(<StatusBadge status="closed" />);
		expect(screen.getByText("Cerrada")).toBeInTheDocument();
	});
});
