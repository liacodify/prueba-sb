import { screen } from "@testing-library/react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { renderWithProviders } from "../utils/render-with-providers";
import type { Solicitud } from "@/types";

describe("StatusBadge", () => {
	it.each([
		["pending", "Pendiente"],
		["in_review", "En Revisión"],
		["approved", "Aprobada"],
		["rejected", "Rechazada"],
		["closed", "Cerrada"],
	])("renderiza estado %s", (status, label) => {
		renderWithProviders(<StatusBadge status={status as Solicitud["status"]} />);
		expect(screen.getByText(label)).toBeInTheDocument();
	});
});

describe("PriorityBadge", () => {
	it.each([
		["low", "Baja"],
		["medium", "Media"],
		["high", "Alta"],
		["critical", "Crítica"],
	])("renderiza prioridad %s", (priority, label) => {
		renderWithProviders(<PriorityBadge priority={priority as Solicitud["priority"]} />);
		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it("no renderiza nada cuando priority es undefined", () => {
		renderWithProviders(<PriorityBadge priority={undefined} />);
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});
});
